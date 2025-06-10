import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Campanha {
  id: string;
  cliente: string;
  nome: string;
  status: 'Ativa' | 'Inativa';
  videos?: any[];
  data?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<'Todas' | 'Ativa' | 'Inativa'>('Todas');

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth !== 'true') router.replace('/login');
  }, [router]);

  useEffect(() => {
    const stored = localStorage.getItem('campanhas');
    if (stored) {
      setCampanhas(JSON.parse(stored));
    }
  }, []);

  const handleVerDetalhes = (id: string) => {
    router.push(`/campanhas/${id}`);
  };

  const handleNovaCampanha = () => {
    router.push('/nova-campanha');
  };

  const handleExcluir = async (id: string) => {
    const confirmacao = confirm("Tem certeza que deseja excluir esta campanha?");
    if (!confirmacao) return;

    const listaAtual = JSON.parse(localStorage.getItem("campanhas") || "[]");
    const campanhaExcluida = listaAtual.find((c: any) => c.id === id);

    const atualizadas = listaAtual.filter((c: any) => c.id !== id);
    localStorage.setItem("campanhas", JSON.stringify(atualizadas));
    setCampanhas(atualizadas);

    if (campanhaExcluida?.videos?.length > 0) {
      const arquivos = campanhaExcluida.videos.map((v: any) => v.arquivo);

      const { error } = await supabase
        .from("ordem_global")
        .delete()
        .in("arquivo", arquivos);

      if (error) {
        console.error("Erro ao excluir vídeos do Supabase:", error);
        alert("Campanha excluída localmente, mas houve erro ao remover vídeos do servidor.");
      }
    }

    alert("Campanha excluída com sucesso.");
  };

  const campanhasFiltradas =
    filtroStatus === 'Todas'
      ? campanhas
      : campanhas.filter((c) => c.status === filtroStatus);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Painel de Campanhas
      </Typography>

      <Stack direction="row" spacing={2} marginBottom={2}>
        <Button variant="contained" color="primary" onClick={handleNovaCampanha}>
          Nova Campanha
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.open("/player", "_blank")}
        >
          Ver Player
        </Button>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filtroStatus}
            label="Status"
            onChange={(e) => setFiltroStatus(e.target.value as any)}
          >
            <MenuItem value="Todas">Todas</MenuItem>
            <MenuItem value="Ativa">Ativa</MenuItem>
            <MenuItem value="Inativa">Inativa</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Campanha</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campanhasFiltradas.map((campanha) => (
              <TableRow key={campanha.id}>
                <TableCell>{campanha.cliente}</TableCell>
                <TableCell>{campanha.nome}</TableCell>
                <TableCell>{campanha.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => handleVerDetalhes(campanha.id)}
                    >
                      Ver Detalhes
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        router.push(`/ordenacaoPlaylist?id=${campanha.id}`)
                      }
                    >
                      Ordenar Playlist
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleExcluir(campanha.id)}
                    >
                      Excluir
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
