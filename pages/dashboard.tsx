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

interface Campanha {
  id: string;
  cliente: string;
  nome: string;
  status: 'Ativa' | 'Inativa';
  videoUrl?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<'Todas' | 'Ativa' | 'Inativa'>('Todas');

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

  const handleAbrirPlayer = () => {
    router.push('/player');
  };

  const handleExcluirCampanha = (id: string) => {
    const confirmacao = confirm('Tem certeza que deseja excluir esta campanha?');
    if (!confirmacao) return;

    const atualizadas = campanhas.filter((c) => c.id !== id);
    setCampanhas(atualizadas);
    localStorage.setItem('campanhas', JSON.stringify(atualizadas));
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
        <Button variant="contained" color="secondary" onClick={handleAbrirPlayer}>
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
                      onClick={() => router.push(`/ordenacaoPlaylist?id=${campanha.id}`)}
                    >
                      Ordenar Playlist
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleExcluirCampanha(campanha.id)}
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
