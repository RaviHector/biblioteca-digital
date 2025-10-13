import styled from "styled-components";

export const OverlayStyle = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
`;

export const DialogStyle = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12);
`;

export const TitleRowStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const CloseButtonStyle = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;
