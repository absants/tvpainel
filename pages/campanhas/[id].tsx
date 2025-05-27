// pages/campanhas/[id].tsx

import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function DetalheCampanhaPage() {
  const router = useRouter();
  const { id } = router.query;

  const [campanha, setCampanha] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Simula fetch da campanha pelo ID
    const dados = {
      id,
      cliente: "Cliente A",
      nome: "Campanha de Exemplo",
      status: "Ativa",
      video: "/videos/video1.mp4",
    };
    setCampanha(dados);
    setStatus(dados.status);
  }, [id]);

  const handleSalvar = () => {
    // Aqui você salvaria no backend ou localStorage
    console.log("Campanha atualizada:", {
      ...campanha,
      status,
    });

    alert("Status salvo com sucesso!");
    router.push("/dashboard");
  };

  if (!campanha) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Detalhes da Campanha
        </Typography>

        <Typography variant="body1"><strong>Cliente:</strong> {campanha.cliente}</Typography>
        <Typography variant="body1" mb={2}><strong>Nome:</strong> {campanha.nome}</Typography>

        <video
          src={campanha.video}
          controls
          style={{ width: "100%", maxHeight: 400, borderRadius: 10, marginBottom: 24 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="Ativa">Ativa</MenuItem>
            <MenuItem value="Inativa">Inativa</MenuItem>
          </Select>
        </FormControl>

        <Box textAlign="right">
          <Button variant="contained" color="primary" onClick={handleSalvar}>
            Salvar Alterações
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
