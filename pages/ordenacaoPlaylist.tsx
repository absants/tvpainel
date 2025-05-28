// pages/ordenacaoPlaylist.tsx
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
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

    const todosArquivos = campanhas
      .filter((c: any) => c.status === "Ativa")
      .flatMap((c: any) => {
        if (Array.isArray(c.videos) && c.videos.length > 0) {
          return c.videos;
        } else if (c.videoUrl) {
          return [{ id: c.id, nome: c.nome, arquivo: c.videoUrl }];
        }
        return [];
      });

    setVideos(todosArquivos);
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

    // 🔁 Dispara evento de storage para forçar refresh no player (outra aba)
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "ordemGlobal",
        newValue: novaOrdem,
      })
    );

    // 🧠 Gatilho auxiliar para forçar o player a recarregar mesmo na mesma aba
    localStorage.setItem("forcarRefreshPlayer", Date.now().toString());

    alert("Ordem salva com sucesso!");
    router.push("/dashboard");
  };

  const renderPreview = (arquivo: string) => {
    const tipo = arquivo.split(".").pop()?.toLowerCase();
    if (!tipo) return null;

    if (["mp4", "webm", "mov"].includes(tipo)) {
      return <video src={arquivo} width="100%" height="auto" controls />;
    }
    if (["jpg", "jpeg", "png", "gif"].includes(tipo)) {
      return <img src={arquivo} alt="Imagem" style={{ width: "100%", borderRadius: 4 }} />;
    }
    if (["mp3", "wav"].includes(tipo)) {
      return <audio src={arquivo} controls style={{ width: "100%" }} />;
    }

    return <Typography variant="body2">Arquivo: {arquivo}</Typography>;
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
                {videos.map((item, index) => (
                  <Draggable
                    key={item.id + index}
                    draggableId={item.id + index}
                    index={index}
                  >
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          border: "1px solid #ccc",
                          mb: 2,
                          borderRadius: 2,
                          flexDirection: "column",
                          alignItems: "flex-start",
                          padding: 2,
                        }}
                      >
                        <Typography fontWeight={600} mb={1}>
                          {index + 1}. {item.nome}
                        </Typography>
                        {renderPreview(item.arquivo)}
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
