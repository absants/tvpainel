// pages/ordenacaoPlaylist.tsx
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
  const router = useRouter();
  const [videos, setVideos] = useState<
    { id: string; nome: string; arquivo: string }[]
  >([]);

  useEffect(() => {
    const campanhas = JSON.parse(localStorage.getItem("campanhas") || "[]");

    const todosVideos = campanhas
      .filter((c: any) => c.status === "Ativa")
      .flatMap((c: any) => {
        if (Array.isArray(c.videos) && c.videos.length > 0) {
          return c.videos;
        } else if (c.videoUrl) {
          return [{ id: c.id, nome: c.nome, arquivo: c.videoUrl }];
        }
        return [];
      });

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
    const novaOrdem = JSON.stringify(videos);
    localStorage.setItem("ordemGlobal", novaOrdem);

    // 🔁 Dispara evento de storage para forçar refresh no player
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "ordemGlobal",
        newValue: novaOrdem,
      })
    );

    alert("Ordem salva com sucesso!");
    router.push("/dashboard");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
        Voltar
      </Button>
      <Typography variant="h5" gutterBottom>
        Ordenar Playlist Global
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {videos.map((video, index) => (
                  <Draggable key={video.id + index} draggableId={video.id + index} index={index}>
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ border: "1px solid #ccc", mb: 1, borderRadius: 1 }}
                      >
                        <ListItemText
                          primary={`${index + 1}. ${video.nome}`}
                          secondary={video.arquivo}
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
