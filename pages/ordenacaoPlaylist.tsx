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
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function OrdenacaoPlaylist() {
  const router = useRouter();
  const { id } = router.query;
  const [videos, setVideos] = useState<any[]>([]);
  const [campanhaNome, setCampanhaNome] = useState("");

  useEffect(() => {
    if (!id) return;

    const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
    const campanha = lista.find((c) => c.id === id);

    if (campanha) {
      setCampanhaNome(campanha.nome);
      if (campanha.videos && Array.isArray(campanha.videos)) {
        setVideos(campanha.videos);
      } else if (campanha.videoUrl) {
        setVideos([
          {
            id: campanha.id,
            nome: campanha.nome,
            arquivo: campanha.videoUrl,
          },
        ]);
      } else {
        setVideos([]);
      }
    }
  }, [id]);

  const onDragEnd = (result: any) => {
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
    router.push(`/campanhas/ordenacaoPlaylist?id=${campanha.id}`)
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
        Ordenar Vídeos da Campanha: {campanhaNome || id}
      </Typography>
      {videos.length === 0 ? (
        <Typography color="text.secondary">
          Nenhum vídeo disponível para ordenar.
        </Typography>
      ) : (
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
      )}
    </Container>
  );
}
