// pages/player.tsx

import { useEffect, useRef, useState } from "react";

export default function PlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videos = ["/videos/video1.mp4", "/videos/video2.mp4", "/videos/video3.mp4"];

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

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ height: "100vh", width: "100vw", margin: 0, padding: 0, overflow: "hidden" }}>
      <video
        ref={videoRef}
        src={videos[currentVideoIndex]}
        autoPlay
        muted
        controls={false}
        style={{
          width: "100%",
          height: "calc(100vh - 40px)",
          objectFit: "cover",
        }}
      />
      <footer
        style={{
          height: 40,
          backgroundColor: "#1D7BBA",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          fontSize: 16,
        }}
      >
        <div>TV Painel</div>
        <div>{getCurrentTime()}</div>
      </footer>
    </div>
  );
}
