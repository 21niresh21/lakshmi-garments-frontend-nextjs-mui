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
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../api/loginApi";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FaceIcon from "@mui/icons-material/Face";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "../context/AuthProvider";
import { Roles } from "../_types/RoleType";

export default function LoginPage() {
  const { setHasToken } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Single change handler for both username and password
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async () => {
    setLoading(true);
    const { username, password } = credentials;
    if (!username || !password) return;

    try {
      const response: any = await login(username, password);

      // 1. Extract the token from your production-grade response
      const token = response.token; // 2. Set the cookie with the ACTUAL token instead of "true"

      const expiresAtZonedStr = response.expiresAt;

      // Parse it into a Date object
      const expiresAt = new Date(expiresAtZonedStr);

      // Convert to UTC string for cookie
      const utcString = expiresAt.toUTCString();

      // Set the cookie
      document.cookie = `token=${token}; path=/; expires=${utcString}; SameSite=Strict; Secure`;

      // 3. Store user details (username, roles) for the UI
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.username,
          roles: response.roles,
        }),
      );
      // Store session expiry for tracking
      localStorage.setItem(
        "session_expires_at",
        expiresAt.getTime().toString(),
      );

      if (response.roles.includes(Roles.SUPER_ADMIN)) {
        router.push("/users");
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      if (err.status === 403) {
        setError(err.message || "Your account is inactive");
      } else if (err.status === 401) {
        setError(err.message || "Invalid username or password");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
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
      bgcolor="background.default"
      px={2}
    >
      <Paper
        elevation={8}
        sx={{
          width: 420,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <NextImage
            src="/lg_logo.svg"
            alt="LG Logo"
            width={200}
            height={150}
            style={{
              maxWidth: "50%",
              height: "auto",
              objectFit: "contain",
            }}
            priority
          />
        </Box>

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

          <Button
            loading={loading}
            // loadingPosition="end"
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 1 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
