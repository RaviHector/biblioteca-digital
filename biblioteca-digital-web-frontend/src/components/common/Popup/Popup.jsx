/* eslint-disable react-hooks/rules-of-hooks */
import { useTheme } from "styled-components";
import {
  CloseButtonStyle,
  DialogStyle,
  OverlayStyle,
  TitleRowStyle,
} from "./Styles";

export default function Popup({ title, children, openPopup, setOpenPopup }) {
  if (!openPopup) return null;
  const theme = useTheme();
  return (
    <OverlayStyle onMouseDown={() => setOpenPopup(false)}>
      <DialogStyle onMouseDown={(e) => e.stopPropagation()}>
        <TitleRowStyle>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: theme.colors.font.black,
            }}
          >
            {title}
          </div>
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
