import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

* {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  font-family: ${(props) => props.theme.fonts.artnoova}, sans-serif;
  font-size: 1.4rem;
  /* Subtle gradient from light blue at the bottom to white at the top.
     Kept intentionally soft to add depth without overpowering content.
     Using fixed attachment ensures the gradient persists across route changes
     and partial reloads. */
  background: linear-gradient(
    to top,
    rgba(220, 235, 255, 1) 0%,   /* soft light-blue at bottom */
    rgba(235, 245, 255, 0.8) 40%,
    rgba(255, 255, 255, 1) 100%  /* white near top (header) */
  );
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

html,
body,
#root {
  height: 100%;
}

html {
  scroll-behavior: smooth;
  @media (prefers-reduced-motion: reduce) {
	  scroll-behavior:auto;
  }
}
`;
