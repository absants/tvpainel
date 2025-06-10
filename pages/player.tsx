import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

export default function PlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fetchOrdemGlobal = async () => {
      const { data, error } = await supabase
        .from("ordem_global")
        .select("arquivo, ordem")
        .order("ordem", { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn("Nenhuma ordem de vídeo encontrada no Supabase.");
        setVideos([]);
        return;
      }

      console.table(data); // debug
      const urls = data.map((item) => `${item.arquivo}?t=${Date.now()}`);
      setVideos(urls);
    };

    fetchOrdemGlobal();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hora = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const data = now.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });

      const formatado =
        data.toUpperCase().replace("-FEIRA", " FEIRA") + " - " + hora;
      setCurrentTime(formatado);
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

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      {videos.length > 0 ? (
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
            zIndex: 1,
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontSize: "1.6rem",
            fontWeight: 600,
            zIndex: 1,
          }}
        >
          NENHUM VÍDEO DISPONÍVEL
        </div>
      )}

      {/* Rodapé */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "#eae7e1", // cinza claro
          color: "#000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 30px",
          fontSize: "18px",
          fontFamily: "'Segoe UI', sans-serif",
          zIndex: 2,
        }}
      >
        <img
          src="/public/logo-impacto.jpg"
          style={{ height: "40px", objectFit: "contain" }}
        />
        <span
          style={{
            fontWeight: 700,
            color: "#1D3C6E",
            fontSize: "16px",
          }}
        >
          {currentTime}
        </span>
      </div>
    </div>
  );
}
