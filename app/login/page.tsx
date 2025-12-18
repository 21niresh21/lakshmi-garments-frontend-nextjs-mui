"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../api/loginApi";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FaceIcon from "@mui/icons-material/Face";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Single change handler for both username and password
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async () => {
    const { username, password } = credentials;
    if (!username || !password) return;

    try {
      const response = await login(username, password);

      // Set cookie to expire in 20 seconds
      document.cookie = `auth=true; path=/; max-age=43200`;
      localStorage.setItem("user", JSON.stringify(response));
      router.push("/invoice/create");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f0f2f5"
      px={2}
    >
      <Paper
        elevation={8}
        sx={{
          width: 360,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight={500}>
          Lakshmi Garments
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Username"
            name="username" // <-- important
            value={credentials.username}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FaceIcon />
                  </InputAdornment>
                ),
              },
            }}
            fullWidth
            required
          />

          <TextField
            label="Password"
            name="password" // <-- important
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                ),
              },
            }}
            fullWidth
            required
          />

          {error && (
            <Typography sx={{ alignSelf: "center", color: "red" }}>
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
