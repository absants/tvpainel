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

// Mock inicial
const mockVideos = [
  { id: '1', nome: 'Black Friday', arquivo: 'black-friday.mp4' },
  { id: '2', nome: 'Verão 2024', arquivo: 'verao-2024.mp4' },
  { id: '3', nome: 'Campanha Dia das Mães', arquivo: 'maes.mp4' },
];

export default function OrdenacaoPlaylist() {
  const router = useRouter();
  const { id } = router.query;

  const [videos, setVideos] = useState(mockVideos);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(videos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setVideos(reordered);
  };

  const salvarOrdem = () => {
    console.log('Nova ordem de vídeos:', videos);
    alert('Ordem salva com sucesso!');
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