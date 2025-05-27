import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";

// Simulação de dados
const mockCampanhas = [
  {
    id: "1",
    cliente: "Cliente A",
    nome: "Black Friday",
    status: "Ativa",
    video: "black-friday-final.mp4",
  },
  {
    id: "2",
    cliente: "Cliente B",
    nome: "Verão 2024",
    status: "Inativa",
    video: "verao-2024.mp4",
  },
];

export default function CampanhaDetalhePage() {
  const router = useRouter();
  const { id } = router.query;

  const [campanha, setCampanha] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const encontrada = mockCampanhas.find((c) => c.id === id);
      setCampanha(encontrada || null);
    }
  }, [id]);

  if (!campanha) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography>Carregando campanha...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/dashboard")}
          >
            Voltar
          </Button>
        </Box>

        <Typography variant="h5" fontWeight={600} gutterBottom>
          {campanha.nome}
        </Typography>

        <Typography>
          <strong>Cliente:</strong> {campanha.cliente}
        </Typography>
        <Typography>
          <strong>Status:</strong>{" "}
          <span style={{ color: campanha.status === "Ativa" ? "#1D7BBA" : "#999" }}>
            {campanha.status}
          </span>
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>
            <strong>Vídeo:</strong> {campanha.video}
          </Typography>
          <Button
            variant="contained"
            href={`/uploads/${campanha.video}`}
            download
            sx={{
              backgroundColor: "#1D7BBA",
              ":hover": { backgroundColor: "#156b9c" },
            }}
          >
            Baixar vídeo
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
