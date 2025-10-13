/* eslint-disable react-hooks/rules-of-hooks */
import { useTheme } from "styled-components";
import {
  CloseButtonStyle,
  DialogStyle,
  OverlayStyle,
  TitleRowStyle,
} from "./Styles";
import styled from 'styled-components';

const Title = styled.div`
  color: ${(props) => props.theme.colors.textPrimary};
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

export default function Popup({ title, children, openPopup, setOpenPopup }) {
  if (!openPopup) return null;
  const theme = useTheme();
  return (
    <OverlayStyle onMouseDown={() => setOpenPopup(false)}>
      <DialogStyle onMouseDown={(e) => e.stopPropagation()}>
        <TitleRowStyle>
          <Title>{title}</Title>
          <CloseButtonStyle
            onClick={() => setOpenPopup(false)}
            aria-label="close"
          >
            ✕
          </CloseButtonStyle>
        </TitleRowStyle>

        <div style={{ marginTop: 12 }}>{children}</div>
      </DialogStyle>
    </OverlayStyle>
  );
}
