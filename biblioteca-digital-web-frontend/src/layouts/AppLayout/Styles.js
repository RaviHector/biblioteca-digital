import styled from "styled-components";

export const Container = styled.div`
  min-height: 100dvh;
  min-height: 100vh;

  display: grid;
  grid-template-rows: auto 1fr auto;
`;

export const Content = styled.main`
  /* Ensure the content area shows the same subtle bottom-to-top gradient
     as applied globally, without affecting the Header. */
  background: linear-gradient(
    to top,
    rgba(220, 235, 255, 1) 0%,
    rgba(235, 245, 255, 0.8) 40%,
    rgba(255, 255, 255, 1) 100%
  );
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;

  /* Make sure it fills the available grid row */
  width: 100%;
  min-height: 100%;
  display: block;
`;
