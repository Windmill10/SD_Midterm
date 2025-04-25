// src/theme.ts
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    extraColors: {
      info: string;
      success: string;
      successDark: string;
      warning: string;
      danger: string;
    };
  }

  interface PaletteOptions {
    extraColors?: {
      info?: string;
      success?: string;
      successDark?: string;
      warning?: string;
      danger?: string;
    };
  }
}
const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1c4da9',       // Your chosen blue
        light: '#4867b4',      // lighter variation
        dark: '#003288',       // deep royal blue
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#a9771c',       // golden-orange
        light: '#e9ae5b',
        dark: '#d77522',
        contrastText: '#000000'
      },
      background: {
        default: '#f8f9fc',
        paper: '#ffffff',
      },
      extraColors: {
        info: '#1c93a9',        // Analogous - teal/cyan
        success: '#1c93a9',     // Analogous - indigo (vibrant)
        successDark: '#105d65', // Deeper indigo (custom)
        warning: '#771ca9',     // Triadic - purple
        danger: '#a91c4d',      // Triadic - crimson pink
      }
    },
    typography: {
      fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    },
    shape: {
      borderRadius: 8,
    }
});



export default theme;
