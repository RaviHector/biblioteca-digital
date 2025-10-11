import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    font: {
      white: '#ffffff',
      black: '#000000',
    },
    white: '#ffffff',
    grey: '#808080',
    black: '#000000',
    softGreen: '#30ad8e',
    midGreen: '#95c93c ',
    darkGreen: '#b7d432',
    headerGreen: '#B5E85D',
    warningRed: '#af0c0c',
    backgroundGrey: '#d2cece',
    blueFlux: '#104c84',
    yellowGirl: '#fed532',
    welcomeGirl: '#99ebd2',
    orange: '#f26e26',
    lightBlue: '#99daff',
    purple: '#d9b8f3',
  },

  fonts: {
    artnoova: 'Artnoova, sans-serif',
    cooper: 'Cooper BT, sans-serif',
    inter: '"Inter", sans-serif',
  },
};

export default function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

Theme.propTypes = {
  children: PropTypes.node.isRequired,
};
