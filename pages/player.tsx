import { useEffect, useRef, useState } from "react";

export default function PlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  const videos = ["/videos/video1.mp4", "/videos/video2.mp4", "/videos/video3.mp4"];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const date = now.toLocaleDateString([], { weekday: 'long', day: '2-digit', month: 'short' });
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
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
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

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden", position: "relative" }}>
      <video
        ref={videoRef}
        src={videos[currentVideoIndex]}
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
        <strong style={{ letterSpacing: 1, fontSize: 20, color: "#1D7BBA" }}>TV PAINEL</strong>
        <span style={{ opacity: 0.9 }}>{currentTime}</span>
      </div>
    </div>
  );
}
