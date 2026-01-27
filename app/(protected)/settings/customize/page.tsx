"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Slider,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { useCustomTheme, ThemeConfiguration, defaultConfig } from "@/app/context/ThemeContext";
import RefreshIcon from "@mui/icons-material/Refresh";
import PaletteIcon from "@mui/icons-material/Palette";
import SaveIcon from "@mui/icons-material/Save";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import AppBreadcrumbs from "@/app/components/navigation/AppBreadcrumbs";

export default function CustomizePage() {
  const { config, updateConfig, resetConfig } = useCustomTheme();

  // Local state for the inputs to keep them fast
  const [localConfig, setLocalConfig] = useState<ThemeConfiguration>({ ...config });
  const [success, setSuccess] = useState(false);

  const handleChange = (key: keyof ThemeConfiguration, value: any) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleApply = () => {
    updateConfig(localConfig);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const fonts = [
    { label: "Inter (Modern)", value: "'Inter', sans-serif" },
    { label: "Roboto (Classic)", value: "'Roboto', sans-serif" },
    { label: "Outfit (Rounded)", value: "'Outfit', sans-serif" },
    { label: "Poppins (Friendly)", value: "'Poppins', sans-serif" },
  ];

  const presetThemes = [
    {
      name: "Lakshmi Garments",
      primaryMain: "#6f41a8ff",
      primaryLight: "#9B7EBD",
      primaryDark: "#4e2a7bff",
      secondaryMain: "#3F4C6B",
    },

{
  name: "Vintage",
  primaryMain: "#4B4658",   // softened ink purple
  primaryLight: "#EFE6D3",  // parchment
  primaryDark: "#322E3E",   // dusk ink
  secondaryMain: "#8A4F63", // muted wine
}



,


    {
      name: "Midnight Ocean",
      primaryMain: "#0077B6",
      primaryLight: "#00B4D8",
      primaryDark: "#023E8A",
      secondaryMain: "#1D3557",
    },
    {
      name: "Forest Nature",
      primaryMain: "#2D6A4F",
      primaryLight: "#52B788",
      primaryDark: "#104e39ff",
      secondaryMain: "#1B4332",
    },
  ];

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setLocalConfig((prev) => ({
      ...prev,
      primaryMain: preset.primaryMain,
      primaryLight: preset.primaryLight,
      primaryDark: preset.primaryDark,
      secondaryMain: preset.secondaryMain,
    }));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ mb: 2 }}>
        <AppBreadcrumbs />
      </Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <PaletteIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Appearance Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fully customize the look and feel of your workspace.
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Reset to Defaults">
          <IconButton onClick={() => { setLocalConfig(defaultConfig); resetConfig(); }} color="inherit">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Changes applied successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Preset Themes Section */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Quick Presets</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
              Select a professionally designed color scheme to update your primary and secondary colors at once.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {presetThemes.map((preset) => (
                <Box
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  sx={{
                    p: 2,
                    border: "2px solid",
                    borderColor: localConfig.primaryMain === preset.primaryMain ? preset.primaryMain : "divider",
                    borderRadius: 2,
                    cursor: "pointer",
                    minWidth: 160,
                    transition: "all 0.2s",
                    "&:hover": { borderColor: preset.primaryMain, transform: "translateY(-2px)" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: preset.primaryMain }} />
                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: preset.primaryLight }} />
                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: preset.secondaryMain }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700}>{preset.name}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        {/* Theme Mode & Layout Density */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DarkModeIcon fontSize="small" /> Mode & Density
            </Typography>
            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig.mode === "dark"}
                    onChange={(e) => handleChange("mode", e.target.checked ? "dark" : "light")}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {localConfig.mode === "dark" ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                    <Typography variant="body2">Dark Theme</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={localConfig.compactMode}
                    onChange={(e) => handleChange("compactMode", e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ViewCompactIcon fontSize="small" />
                    <Typography variant="body2">Compact Mode (High Density)</Typography>
                  </Box>
                }
              />
            </Box>
          </Paper>
        </Grid>

        {/* Typography */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextFieldsIcon fontSize="small" /> Typography
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" fontWeight={600}>Font Family</Typography>
              <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
                <Select
                  value={localConfig.fontFamily}
                  onChange={(e) => handleChange("fontFamily", e.target.value)}
                >
                  {fonts.map((f) => (
                    <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="caption" fontWeight={600}>Base Font Size: {localConfig.fontSize}px</Typography>
              <Slider
                min={12}
                max={18}
                step={1}
                value={localConfig.fontSize}
                onChange={(_, val) => handleChange("fontSize", val)}
                valueLabelDisplay="auto"
                sx={{ mt: 1 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Brand Colors */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Brand Identity</Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <ColorField label="Primary Main" value={localConfig.primaryMain} onChange={(v) => handleChange("primaryMain", v)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <ColorField label="Primary Light" value={localConfig.primaryLight} onChange={(v) => handleChange("primaryLight", v)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <ColorField label="Primary Dark" value={localConfig.primaryDark} onChange={(v) => handleChange("primaryDark", v)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <ColorField label="Secondary Main" value={localConfig.secondaryMain} onChange={(v) => handleChange("secondaryMain", v)} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Layout Shape */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Corner Roundness</Typography>
            <Slider
              min={0}
              max={24}
              step={1}
              value={localConfig.borderRadius}
              onChange={(_, val) => handleChange("borderRadius", val)}
              valueLabelDisplay="auto"
            />
            <Box sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "center" }}>
               <Button variant="contained" sx={{ borderRadius: localConfig.borderRadius / 4 }}>Sample Button</Button>
               <Button variant="outlined" sx={{ borderRadius: localConfig.borderRadius / 4 }}>Sample Button</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Apply Button */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleApply}
              sx={{ px: 6, py: 1.5, borderRadius: 2, fontWeight: 800, fontSize: "1rem" }}
            >
              Apply All Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Box>
      <Typography variant="caption" fontWeight={700} sx={{ mb: 1, display: "block", color: "text.secondary" }}>{label}</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          InputProps={{
            startAdornment: (
              <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: value, mr: 1, border: "1px solid", borderColor: "divider" }} />
            ),
          }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 36, height: 36, border: "none", cursor: "pointer", background: "none" }}
        />
      </Box>
    </Box>
  );
}
