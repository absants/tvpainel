import { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (usuario === "admin13" && senha === "Tv987654") {
      localStorage.setItem("auth", "true");
      router.push("/dashboard");
    } else {
      alert("Usuário ou senha inválidos");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ mt: 10, p: 4, backgroundColor: "#f9f9f9" }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: "#1D1D1D" }}
        >
          IMPACTO MIDIA TV - Acesso Admin
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#1D7BBA",
              ":hover": { backgroundColor: "#156b9c" },
            }}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
