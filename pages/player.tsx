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

interface VideoItem {
  id: string;
  nome: string;
  arquivo: string;
  campanha: string;
  cliente: string;
}

export default function OrdenacaoPlaylist() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
    const allVideos: VideoItem[] = lista.flatMap((c: any) => {
      if (Array.isArray(c.videos)) {
        return c.videos.map((v: any, idx: number) => ({
          id: `${c.id}-${idx}`,
          nome: v.nome,
          arquivo: v.arquivo,
          campanha: c.nome,
          cliente: c.cliente,
        }));
      } else if (c.videoUrl) {
        return [
          {
            id: c.id,
            nome: c.nome,
            arquivo: c.videoUrl,
            campanha: c.nome,
            cliente: c.cliente,
          },
        ];
      } else {
        return [];
      }
    });
    setVideos(allVideos);
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(videos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setVideos(reordered);
    // Atualiza imediatamente o localStorage para refletir no player
    localStorage.setItem("playlistOrdenada", JSON.stringify(reordered));
  };

  const salvarOrdem = () => {
    localStorage.setItem("playlistOrdenada", JSON.stringify(videos));
    alert("Ordem global da playlist salva com sucesso!");
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
        Ordenar Playlist Global
      </Typography>

      {videos.length === 0 ? (
        <Typography color="text.secondary">
          Nenhum vídeo encontrado nas campanhas.
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
                            secondary={`Cliente: ${video.cliente} • Campanha: ${video.campanha}`}
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
