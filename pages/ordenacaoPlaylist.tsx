// ordenacaoPlaylist.tsx - refatorado para ordenação global de todos os vídeos

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

export default function OrdenacaoPlaylist() {
  const [videos, setVideos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");

    const todosVideos = lista.flatMap((campanha: any) =>
      (campanha.videos || []).map((video: any, idx: number) => ({
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

  const salvarOrdem = () => {
    localStorage.setItem("ordemGlobal", JSON.stringify(videos));
    alert("Ordem global salva com sucesso!");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Typography variant="h5" gutterBottom>
        Ordenar Todos os Vídeos
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {videos.map((video, index) => (
                  <Draggable key={video.id} draggableId={video.id} index={index}>
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          border: "1px solid #ccc",
                          mb: 1,
                          borderRadius: 1,
                          backgroundColor: "#f9f9f9",
                          flexDirection: "column",
                        }}
                      >
                        <ListItemText
                          primary={`${index + 1}. ${video.nome}`}
                          secondary={`Cliente: ${video.cliente} | Campanha: ${video.campanhaNome}`}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>

        <Box textAlign="right" mt={2}>
          <Button variant="contained" color="primary" onClick={salvarOrdem}>
            Salvar Ordem
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
