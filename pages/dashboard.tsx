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
  TableContainer,
} from "@mui/material";
import { useRouter } from "next/router";

const campanhasMock = [
  { id: 1, cliente: "Cliente A", campanha: "Black Friday", status: "Ativa" },
  { id: 2, cliente: "Cliente B", campanha: "Inverno 2024", status: "Inativa" },
  { id: 3, cliente: "Cliente C", campanha: "Verão Azul", status: "Ativa" },
];

export default function DashboardPage() {
  const router = useRouter();

  const handleRowClick = (id: number) => {
    router.push(`/campanhas/${id}`);
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Campanhas
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push("/nova-campanha")}
          sx={{
            backgroundColor: "#1D7BBA",
            ":hover": { backgroundColor: "#156b9c" },
          }}
        >
          + Nova Campanha
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Campanha</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campanhasMock.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(row.id)}
              >
                <TableCell>{row.cliente}</TableCell>
                <TableCell>{row.campanha}</TableCell>
                <TableCell sx={{ color: row.status === "Ativa" ? "#1D7BBA" : "#999" }}>
                  {row.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
