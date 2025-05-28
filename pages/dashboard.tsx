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
  Stack
} from '@mui/material';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [campanhas, setCampanhas] = useState<any[]>([]);

  useEffect(() => {
    const dados = localStorage.getItem('campanhas');
    if (dados) {
      setCampanhas(JSON.parse(dados));
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

  const handleVerOrdenacao = () => {
    router.push('/ordenacaoPlaylist');
  };

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
        <Button variant="outlined" color="info" onClick={handleVerOrdenacao}>
          Ver Ordenação
        </Button>
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
            {campanhas.map((campanha) => (
              <TableRow key={campanha.id}>
                <TableCell>{campanha.cliente}</TableCell>
                <TableCell>{campanha.campanha}</TableCell>
                <TableCell>{campanha.status}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleVerDetalhes(campanha.id)}>
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
