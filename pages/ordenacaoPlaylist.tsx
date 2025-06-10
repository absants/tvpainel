import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function OrdenacaoPlaylist() {
  const [videos, setVideos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");

    const todosVideos = lista.flatMap((campanha: any) =>
      (campanha.videos || []).map((video: any) => ({
        ...video,
        campanhaId: campanha.id,
        cliente: campanha.cliente,
        campanhaNome: campanha.nome,
        data: campanha.data,
      }))
    );

    setVideos(todosVideos);
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(videos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setVideos(reordered);
  };

  const salvarOrdem = async () => {
    const ordem = videos.map((v, index) => {
      const arquivoBase = v.arquivo.split("?")[0]; // remove timestamp se houver
      return {
        arquivo: arquivoBase,
        ordem: index,
      };
    });

    console.log("Salvando ordem:", ordem);

    const { error } = await supabase
      .from("ordem_global")
      .upsert(ordem, { onConflict: "arquivo" });

    if (error) {
      console.error("Erro ao salvar ordem no Supabase:", error);
      alert("Erro ao salvar ordem no Supabase.");
    } else {
      alert("Ordem salva com sucesso!");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

      <Typography variant="h5" gutterBottom>
        Ordenar Todos os Vídeos
      </Typog
