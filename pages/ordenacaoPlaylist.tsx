import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function OrdenacaoPlaylist() {
  const router = useRouter();
  const { id } = router.query;

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
    const campanha = lista.find((c) => c.id === id);
    if (campanha && campanha.videos) {
      setVideos(campanha.videos);
    } else if (campanha) {
      // fallback: vídeo único por campanha (como definido no cadastro)
      setVideos([
        {
          id: campanha.id,
          nome: campanha.nome,
          arquivo: campanha.videoUrl,
        },
      ]);
    }
  }, [id]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(videos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setVideos(reordered);
  };

  const salvarOrdem = () => {
    const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
    const novaLista = lista.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          videos,
        };
      }
      return c;
    });
    localStorage.setItem("campanhas", JSON.stringify(novaLista));
    alert("Ordem salva com sucesso!");
    router.push(`/campanhas/${id}`);
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
        Ordenar Vídeos da Campanha #{id}
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
                        sx={{ border: '1px solid #ccc', mb: 1, borderRadius: 1 }}
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
