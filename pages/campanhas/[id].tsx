import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function DetalhesCampanha() {
  const router = useRouter();
  const { id } = router.query;

  const [campanha, setCampanha] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
      const encontrada = lista.find((c: any) => c.id === id);
      if (encontrada) {
        setCampanha(encontrada);
        setStatus(encontrada.status);
      }
    }
  }, [id]);

  const handleSalvar = () => {
    const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
    const atualizada = lista.map((c: any) =>
      c.id === id ? { ...c, status } : c
    );
    localStorage.setItem("campanhas", JSON.stringify(atualizada));
    alert("Campanha atualizada!");
    router.push("/dashboard");
  };

  if (!campanha) return <p>Carregando...</p>;

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Detalhes da Campanha
      </Typography>

      <Typography fontWeight={600}>
        Cliente: <span style={{ fontWeight: 400 }}>{campanha.cliente}</span>
      </Typography>
      <Typography fontWeight={600} mb={2}>
        Nome: <span style={{ fontWeight: 400 }}>{campanha.nome}</span>
      </Typography>

      {campanha.videoUrl && (
        <video
          width="100%"
          height="auto"
          controls
          src={campanha.videoUrl}
          style={{ marginBottom: "1rem" }}
        />
      )}

      <Box sx={{ mb: 3 }}>
        <Typography>Status</Typography>
        <Select
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="Ativa">Ativa</MenuItem>
          <MenuItem value="Inativa">Inativa</MenuItem>
        </Select>
      </Box>

      <Button
        onClick={handleSalvar}
        variant="contained"
        sx={{ backgroundColor: "#1D7BBA" }}
      >
        Salvar Alterações
      </Button>
    </Container>
  );
}
