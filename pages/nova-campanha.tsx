// pages/nova-campanha.tsx
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";

export default function NovaCampanhaPage() {
  const [cliente, setCliente] = useState("");
  const [campanha, setCampanha] = useState("");
  const [status, setStatus] = useState("Ativa");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewNome, setPreviewNome] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setPreviewNome(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cliente && campanha && videoFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
        const nova = {
          id: Date.now().toString(),
          cliente,
          nome: campanha,
          status,
          videoUrl: reader.result, // <- Base64 salvo corretamente
        };

        lista.push(nova);
        localStorage.setItem("campanhas", JSON.stringify(lista));

        router.push("/dashboard");
      };

      reader.readAsDataURL(videoFile); // ← inicia leitura
    } else {
      alert("Preencha todos os campos e selecione um arquivo de mídia.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" mb={3} fontWeight={600}>
        Nova Campanha
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <TextField
          label="Nome do Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          required
        />

        <TextField
          label="Nome da Campanha"
          value={campanha}
          onChange={(e) => setCampanha(e.target.value)}
          required
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="Ativa">Ativa</MenuItem>
            <MenuItem value="Inativa">Inativa</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" component="label">
          {previewNome || "Selecionar Vídeo / Imagem / Áudio"}
          <input
            type="file"
            accept="video/*,image/*,audio/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#1D7BBA",
            ":hover": { backgroundColor: "#156b9c" },
          }}
        >
          Salvar
        </Button>
      </Box>
    </Container>
  );
}
