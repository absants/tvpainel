import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Switch,
  FormControlLabel
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

export default function CampanhaDetalhe() {
  const router = useRouter();
  const { id } = router.query;
  const [campanha, setCampanha] = useState(null);

  useEffect(() => {
    if (id) {
      const encontrada = mockCampanhas.find((c) => c.id === id);
      setCampanha(encontrada);
    }
  }, [id]);

  const handleToggleStatus = () => {
    if (campanha) {
      const novoStatus = campanha.status === "Ativa" ? "Inativa" : "Ativa";
      setCampanha({ ...campanha, status: novoStatus });
    }
  };

  if (!campanha) return <Typography>Carregando campanha...</Typography>;

  return (
    <Container>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/dashboard")}
        sx={{ mt: 2 }}
      >
        Voltar ao Dashboard
      </Button>

      <Paper sx={{ p: 4, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          {campanha.nome}
        </Typography>
        <Typography>Cliente: {campanha.cliente}</Typography>
        <Typography>Status atual: {campanha.status}</Typography>

        <FormControlLabel
          control={
            <Switch
              checked={campanha.status === "Ativa"}
              onChange={handleToggleStatus}
            />
          }
          label="Ativar campanha"
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          href={`/${campanha.video}`}
          download
          sx={{ mt: 3 }}
        >
          Baixar vídeo da campanha
        </Button>
      </Paper>
    </Container>
  );
}
