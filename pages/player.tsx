// pages/player.tsx
import { useEffect, useRef, useState } from "react";

export default function PlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<{ id: string; nome: string; arquivo: string }[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  // Carrega os vídeos das campanhas do localStorage, respeitando a ordem
  useEffect(() => {
    const campanhas = JSON.parse(localStorage.getItem("campanhas") || "[]");

    // Filtra apenas campanhas ativas e extrai os vídeos
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
  }, []);

  // Atualiza o horário exibido na tarja inferior
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const date = now.toLocaleDateString([], {
        weekday: "long",
        day: "2-digit",
        month: "short",
      });
      setCurrentTime(`${date} • ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reproduz próximo vídeo quando o atual termina
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

  // Quando muda o vídeo, reinicia a reprodução
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
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "relative",
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
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "60px",
          background: "rgba(0, 0, 0, 0.65)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 30px",
          fontSize: "18px",
          fontFamily: "'Segoe UI', sans-serif",
          zIndex: 2,
        }}
      >
        <strong style={{ letterSpacing: 1, fontSize: 20, color: "#1D7BBA" }}>
          TV PAINEL
        </strong>
        <span style={{ opacity: 0.9 }}>{currentTime}</span>
      </div>
    </div>
  );
}
