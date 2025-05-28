import { useEffect, useRef, useState } from "react";

interface VideoItem {
  id: string;
  nome: string;
  arquivo: string;
  campanha?: string;
  cliente?: string;
}

export default function PlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playlist, setPlaylist] = useState<VideoItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("playlistOrdenada");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlaylist(parsed);
          return;
        }
      } catch (e) {
        console.error("Erro ao carregar playlist:", e);
      }
    }

    setPlaylist([
      { id: "1", nome: "Vídeo 1", arquivo: "/videos/video1.mp4" },
      { id: "2", nome: "Vídeo 2", arquivo: "/videos/video2.mp4" },
      { id: "3", nome: "Vídeo 3", arquivo: "/videos/video3.mp4" },
    ]);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
      setCurrentTime(`${date} • ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    };

    videoElement.addEventListener("ended", handleEnded);
    return () => {
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, [playlist]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && playlist.length > 0) {
      videoElement.load();
      videoElement.play().catch(() => {});
    }
  }, [currentVideoIndex, playlist]);

  const currentVideo = playlist[currentVideoIndex];

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      margin: 0,
      padding: 20,
      position: "fixed",
      top: 0,
      left: 0,
      overflow: "hidden",
      backgroundColor: "#000",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minWidth: "1280px",
      minHeight: "720px"
    }}>
      <video
        ref={videoRef}
        src={currentVideo?.arquivo}
        autoPlay
        muted
        controls={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          flex: 1,
          borderRadius: 8
        }}
      />

      <div
        style={{
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
          marginTop: 20,
          borderRadius: 8
        }}
      >
        <strong style={{ letterSpacing: 1, fontSize: 20, color: "#1D7BBA" }}>
          IMPACTO TV
        </strong>
        <span style={{ opacity: 0.9 }}>{currentTime}</span>
      </div>
    </div>
  );
}