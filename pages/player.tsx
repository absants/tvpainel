// pages/player.tsx
import { useEffect, useRef, useState } from "react";

export default function PlayerPage() {
  const videoRef = useRef<HTMLMediaElement>(null);
  const [videos, setVideos] = useState<{ id: string; nome: string; arquivo: string }[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const ordemRef = useRef("");

  const carregarVideos = () => {
    const ordem = localStorage.getItem("ordemGlobal");
    if (ordem && ordem !== "[]") {
      ordemRef.current = ordem;
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

      ordemRef.current = JSON.stringify(todosVideos);
      setVideos(todosVideos);
    }
  };

  useEffect(() => {
    carregarVideos();
  }, []);

  // Detecta mudanças na ordenação (a cada 2s)
  useEffect(() => {
    const intervalo = setInterval(() => {
      const novaOrdem = localStorage.getItem("ordemGlobal") || "";
      if (novaOrdem !== ordemRef.current && novaOrdem !== "[]") {
        ordemRef.current = novaOrdem;
        setCurrentVideoIndex(0);
        setVideos(JSON.parse(novaOrdem));
      }
    }, 2000);

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
    const mediaElement = videoRef.current;
    if (!mediaElement) return;

    const handleEnded = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    };

    mediaElement.addEventListener("ended", handleEnded);
    return () => {
      mediaElement.removeEventListener("ended", handleEnded);
    };
  }, [videos]);

  useEffect(() => {
    const mediaElement = videoRef.current;
    if (mediaElement) {
      mediaElement.load();
      mediaElement.play().catch(() => {});
    }
  }, [currentVideoIndex]);

  if (videos.length === 0) {
    return <p style={{ padding: 20 }}>Nenhum vídeo disponível.</p>;
  }

  const tipoAtual = videos[currentVideoIndex].arquivo.split(";")[0];

  const renderMedia = () => {
    if (tipoAtual.includes("video")) {
      return (
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
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
      );
    }

    if (tipoAtual.includes("audio")) {
      return (
        <audio
          ref={videoRef as React.RefObject<HTMLAudioElement>}
          src={videos[currentVideoIndex].arquivo}
          autoPlay
          controls={false}
          style={{
            width: "100%",
            height: "auto",
            backgroundColor: "#000",
          }}
        />
      );
    }

    if (tipoAtual.includes("image")) {
      return (
        <img
          src={videos[currentVideoIndex].arquivo}
          alt="Imagem"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            backgroundColor: "#000",
          }}
        />
      );
    }

    return <p style={{ color: "#fff" }}>Tipo de mídia não suportado</p>;
  };

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
        flexDirection: "column",
      }}
    >
      <div style={{ width: "100%", height: "calc(100% - 48px)" }}>
        {renderMedia()}
      </div>

      <div
        style={{
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
