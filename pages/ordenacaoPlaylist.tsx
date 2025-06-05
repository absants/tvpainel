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

  const [videos, setVideos] = useState([]);
  const [campanha, setCampanha] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
    const campanhaSelecionada = lista.find((c) => c.id === id);

    if (campanhaSelecionada) {
      setCampanha(campanhaSelecionada);
      if (Array.isArray(campanhaSelecionada.videos)) {
        setVideos(campanhaSelecionada.videos);
      } else {
        setVideos([]);
      }
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
    const novaLista = lista.map((c) =>
      c.id === id ? { ...c, videos } : c
    );
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

      {campanha && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight={600}>
            Cliente: <span style={{ fontWeight: 400 }}>{campanha.cliente}</span>
          </Typography>
          <Typography fontWeight={600}>
            Campanha: <span style={{ fontWeight: 400 }}>{campanha.nome}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Carregada em: {campanha.data || 'Data não disponível'}
          </Typography>
        </Paper>
      )}

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
                          border: '1px solid #ccc',
                          mb: 1,
                          borderRadius: 1,
                          backgroundColor: '#f9f9f9',
                        }}
                      >
                        <ListItemText
                          primary={`${index + 1}. ${video.nome}`}
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
