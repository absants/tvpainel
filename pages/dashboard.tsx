// pages/dashboard.tsx

import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

const mockCampanhas = [
  {
    id: "1",
    cliente: "Cliente A",
    nome: "Campanha Black Friday",
    status: "Ativa",
  },
  {
    id: "2",
    cliente: "Cliente B",
    nome: "Campanha Verão",
    status: "Inativa",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [campanhas, setCampanhas] = useState(mockCampanhas);

  const handleRowClick = (id: string) => {
    router.push(`/campanhas/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
        <Box display="flex" gap={2}>
          <Link href="/nova-campanha" passHref>
            <Button variant="contained" color="primary">+ Nova Campanha</Button>
          </Link>
          <Link href="/player" passHref>
            <Button variant="outlined" color="secondary">Ver Tela do Player</Button>
          </Link>
        </Box>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Campanha</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campanhas.map((campanha) => (
              <TableRow
                key={campanha.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(campanha.id)}
              >
                <TableCell>{campanha.cliente}</TableCell>
                <TableCell>{campanha.nome}</TableCell>
                <TableCell>{campanha.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
