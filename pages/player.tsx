// pages/player.tsx

import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

export default function PlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playlist] = useState<string[]>([
    '/videos/video1.mp4',
    '/videos/video2.mp4'
  ]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    const interval = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load();
      videoElement.play();
    }
  }, [currentVideoIndex]);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'black'
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          onEnded={handleVideoEnd}
          style={{ objectFit: 'cover' }}
          controls={false}
          autoPlay
          muted
        >
          <source src={playlist[currentVideoIndex]} type="video/mp4" />
        </video>
      </Box>
      <Box
        sx={{
          height: '60px',
          width: '100%',
          bgcolor: '#1D7BBA',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3
        }}
      >
        <Typography variant="h6" color="white">
          TV Painel
        </Typography>
        <Typography variant="h6" color="white">
          {currentTime}
        </Typography>
      </Box>
    </Box>
  );
}
