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

  const tiposPermitidos = ["image/png", "image/jpeg", "video/mp4", "video/h264"];
  const tamanhoMaximoMB = 10;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!tiposPermitidos.includes(file.type)) {
        alert("Tipo de arquivo não permitido. Aceitamos PNG, JPG, MP4 e H264.");
        return;
      }

      if (file.size > tamanhoMaximoMB * 1024 * 1024) {
        alert("Arquivo excede o limite de 10MB.");
        return;
      }

      setVideoFile(file);
      setPreviewNome(file.name);
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
          videoUrl: reader.result,
        };

        lista.push(nova);
        localStorage.setItem("campanhas", JSON.stringify(lista));

        router.push("/dashboard");
      };

      reader.readAsDataURL(videoFile);
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
          {previewNome || "Selecionar PNG, JPG, MP4 ou H264 (até 10MB)"}
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.mp4,.h264"
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
