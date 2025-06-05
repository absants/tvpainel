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
  const [campanha, setCampanha] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const lista = JSON.parse(localStorage.getItem("campanhas") || "[]");
    const campanhaEncontrada = lista.find((c) => c.id === id);

    if (campanhaEncontrada) {
      setCampanha(campanhaEncontrada);

      if (campanhaEncontrada.videos && Array.isArray(campanhaEncontrada.videos)) {
        setVideos(campanhaEncontrada.videos);
      } else if (campanhaEncontrada.videoUrl) {
        setVideos([
          {
            id: campanhaEncontrada.id,
            nome: campanhaEncontrada.nome,
            arquivo: campanhaEncontrada.videoUrl,
          },
        ]);
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
        <List>
          <ListItem>
            <ListItemText
              primary={`Cliente: ${campanha?.cliente || 'N/A'}`}
              secondary={`Campanha: ${campanha?.nome || 'N/A'} • Carregada em: ${campanha?.data || 'Data não disponível'}`}
            />
          </ListItem>
        </List>
        <Box textAlign="right" mt={2}>
          <Button variant="contained" color="primary" onClick={salvarOrdem}>
            Salvar Ordem
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
