// pages/dashboard.tsx
import { useRouter } from "next/router";
import { Button, Container, Typography } from "@mui/material";

export default function Dashboard() {
  const router = useRouter();

  const handleVerPlayer = () => {
    router.push("/player");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleVerPlayer}
      >
        Ver Player
      </Button>
    </Container>
  );
}
