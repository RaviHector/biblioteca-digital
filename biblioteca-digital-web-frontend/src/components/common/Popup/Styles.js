import styled from "styled-components";

export const OverlayStyle = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 48;
  z-index: 9999;
`;

export const DialogStyle = styled.div`
  background: #fff;
  border-radius: 8;
  padding: 16;
  width: min(900px, 95%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

export const TitleRowStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CloseButtonStyle = styled.div`
  background: transparent;
  border: none;
  font-size: 18;
  cursor: pointer;
`;
