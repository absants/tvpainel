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
import { supabase } from "../lib/supabase";

export default function NovaCampanhaPage() {
  const [cliente, setCliente] = useState("");
  const [campanha, setCampanha] = useState("");
  const [status, setStatus] = useState("Ativa");
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [previewNome, setPreviewNome] = useState("");
  const router = useRouter();

  const tiposPermitidos = ["mp4", "h264", "jpg", "jpeg", "png"];
  const tamanhoMaximoMB = 10;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    files.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !tiposPermitidos.includes(ext)) return;
      if (file.size > tamanhoMaximoMB * 1024 * 1024) return;
      validFiles.push(file);
    });

    if (validFiles.length === 0) {
      alert("Nenhum arquivo válido selecionado. Verifique o tipo e tamanho (máx 10MB).");
      return;
    }

    setVideoFiles(validFiles);
    setPreviewNome(`${validFiles.length} arquivo(s) selecionado(s)`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cliente || !campanha || videoFiles.length === 0) {
      alert("Preencha todos os campos e selecione ao menos um arquivo.");
      return;
    }

    try {
      const uploads = await Promise.all(
        videoFiles.map(async (file) => {
          const filename = `${Date.now()}-${file.name}`;

          const { error } = await supabase.storage
            .from("videos")
            .upload(filename, file, {
              contentType: file.type,
              upsert: true,
            });

          if (error) {
            alert(`Erro ao subir o vídeo ${file.name}: ${error.message}`);
            return null;
          }

          const { data } = supabase.storage.from("videos").getPublicUrl(filename);

          return {
            id: Date.now().toString() + Math.random(),
            nome: file.name,
            arquivo: data.publicUrl,
          };
        })
      );

      const videos = uploads.filter(Boolean);

      if (videos.length === 0) {
        alert("Nenhum vídeo foi salvo. Verifique os arquivos selecionados.");
        return;
      }

      const nova = {
        id: Date.now().toString(),
        cliente,
        nome: campanha,
        status,
        data: new Date().toLocaleString("pt-BR"),
        videos,
      };

      const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
      lista.push(nova);
      localStorage.setItem("campanhas", JSON.stringify(lista));

      alert("Campanha criada com sucesso!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erro geral ao criar campanha:", err);
      alert("Erro inesperado ao criar a campanha. Tente novamente.");
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
          {previewNome || "Selecionar arquivos (PNG, JPG, MP4, H264 - até 10MB)"}
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.mp4,.h264"
            multiple
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
