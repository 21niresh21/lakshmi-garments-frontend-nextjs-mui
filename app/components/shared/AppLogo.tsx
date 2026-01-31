'use client';
import * as React from 'react';
import { Box, useTheme, type BoxProps } from '@mui/material';
import Image from 'next/image';

interface AppLogoProps extends BoxProps {
  size?: number;
  mode?: 'light' | 'dark';
}

export default function AppLogo({ size = 40, mode, sx, ...props }: AppLogoProps) {
  const theme = useTheme();
  const currentMode = mode || theme.palette.mode;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Optional: Apply filter for dark mode if Magenta is too dark
        ...(currentMode === 'dark' && {
          filter: 'brightness(1.2) contrast(1.1)',
        }),
        ...sx,
      }}
      {...props}
    >
      <Image
        src="/lg_logo.svg"
        alt="Lakshmi Garments Logo"
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        priority
      />
    </Box>
  );
}
