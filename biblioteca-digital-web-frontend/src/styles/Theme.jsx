import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primaryDark: '#1565c0', // azul escuro
    primaryLight: '#e3f2fd', // azul claro
    // Use semi-transparent white so the global gradient remains visible through UI surfaces
    white: 'rgba(255,255,255,0.9)',
    background: 'rgba(255,255,255,0.92)',
    surface: '#f5f5f5', // cinza suave
    textPrimary: '#0d47a1',
    textSecondary: '#546e7a',
    shadow: 'rgba(13, 71, 161, 0.08)',
    headerBackground: '#0f1724', // mais escuro para o topo (aprox. thefront)
    ctaGradientStart: '#42a5f5',
    ctaGradientEnd: '#1565c0',
    ctaShadow: 'rgba(21,101,192,0.18)',
    gradientBottom: '#dceeff',
  },

  fonts: {
    inter: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    roboto: '"Roboto", sans-serif',
    poppins: '"Poppins", sans-serif',
  },
};

// Backwards-compatible aliases for older code that used green palette and different font keys
theme.colors.darkGreen = theme.colors.primaryDark;
theme.colors.midGreen = theme.colors.ctaGradientStart;
theme.colors.softGreen = theme.colors.primaryLight;
theme.colors.headerGreen = theme.colors.headerBackground;
theme.colors.lightGreen = '#e8f7ff';
theme.colors.font = { white: theme.colors.white, black: '#000000' };

// Font aliases
theme.fonts.artnoova = theme.fonts.inter;
theme.fonts.montserrat = theme.fonts.inter;

export default function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

Theme.propTypes = {
  children: PropTypes.node.isRequired,
};
