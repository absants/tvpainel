// pages/player.tsx
import { useEffect, useRef, useState } from "react";

export default function PlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<{ id: string; nome: string; arquivo: string }[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const ordemRef = useRef(""); // armazena a ordem atual

  const carregarVideos = () => {
    const ordem = localStorage.getItem("ordemGlobal");
    ordemRef.current = ordem || "";
    if (ordem) {
      setVideos(JSON.parse(ordem));
    } else {
      const campanhas = JSON.parse(localStorage.getItem("campanhas") || "[]");
      const todosVideos = campanhas
        .filter((c: any) => c.status === "Ativa")
        .flatMap((c: any) => {
          if (Array.isArray(c.videos) && c.videos.length > 0) {
            return c.videos;
          } else if (c.videoUrl) {
            return [{ id: c.id, nome: c.nome, arquivo: c.videoUrl }];
          }
          return [];
        });
      setVideos(todosVideos);
    }
  };

  useEffect(() => {
    carregarVideos();
  }, []);

  // 🔁 Verifica constantemente se houve alteração no localStorage
  useEffect(() => {
    const intervalo = setInterval(() => {
      const novaOrdem = localStorage.getItem("ordemGlobal") || "";
      if (novaOrdem !== ordemRef.current) {
        ordemRef.current = novaOrdem;
        setCurrentVideoIndex(0);
        setVideos(JSON.parse(novaOrdem));
        console.log("Playlist atualizada por alteração na ordenação.");
      }
    }, 2000); // verifica a cada 2 segundos

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const date = now.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "short",
      });
      setCurrentTime(`${capitalize(date)} • ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    };

    videoElement.addEventListener("ended", handleEnded);
    return () => {
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, [videos]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load();
      videoElement.play().catch(() => {});
    }
  }, [currentVideoIndex]);

  if (videos.length === 0) {
    return <p style={{ padding: 20 }}>Nenhum vídeo disponível.</p>;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        src={videos[currentVideoIndex].arquivo}
        autoPlay
        muted
        controls={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "48px",
          background: "rgba(0, 0, 0, 0.65)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          fontSize: "16px",
          fontFamily: "'Segoe UI', sans-serif",
          zIndex: 2,
        }}
      >
        <strong style={{ letterSpacing: 1, fontSize: 18, color: "#1D7BBA" }}>
          TV PAINEL
        </strong>
        <span style={{ opacity: 0.9 }}>{currentTime}</span>
      </div>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
