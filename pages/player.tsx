// player.tsx - fallback para buscar vídeos direto do Supabase se ordemGlobal estiver ausente

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export default function PlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const loadVideos = async () => {
      const ordem = JSON.parse(localStorage.getItem("ordemGlobal") || "null");
      const campanhas = JSON.parse(localStorage.getItem("campanhas") || "[]");

      if (ordem) {
        const todosVideosAtuais = campanhas.flatMap((c: any) =>
          (c.videos || []).map((v: any) => v.arquivo)
        );

        const ordemValida = ordem.filter((v: any) =>
          todosVideosAtuais.includes(v.arquivo)
        );

        if (ordemValida.length === 0) {
          localStorage.removeItem("ordemGlobal");
          setVideos([]);
        } else {
          setVideos(ordemValida.map((v: any) => `${v.arquivo}?t=${Date.now()}`));
        }
      } else {
        // fallback: buscar do Supabase diretamente
        const { data, error } = await supabase.storage.from("videos").list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

        if (error || !data) {
          console.error("Erro ao buscar vídeos do Supabase:", error);
          setVideos([]);
          return;
        }

        const urls = data
          .filter((file) => file.name.endsWith(".mp4") || file.name.endsWith(".h264"))
          .map((file) => {
            const { data: publicUrlData } = supabase.storage.from("videos").getPublicUrl(file.name);
            return `${publicUrlData.publicUrl}?t=${Date.now()}`;
          });

        setVideos(urls);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString("pt-BR", { weekday: 'long', day: '2-digit', month: 'short' });
      const capitalized = date.charAt(0).toUpperCase() + date.slice(1);
      setCurrentTime(`${capitalized} • ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      if (videoElement.currentTime >= 10) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videos, currentIndex]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load();
      videoElement.play().catch(() => {});
    }
  }, [currentIndex]);

  if (videos.length === 0) {
    return (
      <div style={{ color: "#fff", backgroundColor: "#000", padding: "2rem", fontSize: "1.5rem", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
        Nenhum vídeo encontrado para reprodução.
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden", position: "relative" }}>
      <video
        ref={videoRef}
        src={videos[currentIndex]}
        autoPlay
        muted
        controls={false}
        style={{
          width: "100vw",
          height: "100vh",
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
          left: 0,
          right: 0,
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
        <strong style={{ letterSpacing: 1, fontSize: 20, color: "#1D7BBA" }}>Impacto Mídia TV</strong>
        <span style={{ opacity: 0.9 }}>{currentTime}</span>
      </div>
    </div>
  );
}