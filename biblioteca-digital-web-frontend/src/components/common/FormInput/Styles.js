import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props) => props.theme.fonts.montserrat};
  font-style: normal;
  font-weight: 500;
  gap: 0.5rem;

  width: 100%;
`;

export const Label = styled.label`
  color: ${(props) => props.theme.colors.textPrimary || '#1A1A1A'};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
  @media (max-width: 700px) {
    font-size: 0.95rem;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Icon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 2rem;
  pointer-events: none;
`;

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== "error",
})`
  height: 3.6rem;
  font-size: 1rem;
  padding: 0.6rem 1rem;
  padding-left: 3.6rem;
  border-radius: ${(props) => props.borderradius ?? "8px"};
  width: 100%;
  border: ${(props) => (props.error ? "2px solid #ef4444" : "1px solid rgba(0,0,0,0.12)")};
  background-color: ${(props) => props.backgroundcolor ? props.backgroundcolor : "#fff"};
  color: ${(props) => props.theme.colors.textPrimary || '#1A1A1A'};

  @media (max-width: 700px) {
    font-weight: 400;
    font-size: 0.95rem;
    line-height: 1.4rem;
    height: 3rem;
  }

  @media (max-width: 370px) {
    font-size: 0.9rem;
  }
`;

export const ErrorMessage = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 2rem;
  color: red;

  @media (max-width: 700px) {
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 1.7rem;
  }

  @media (max-width: 370px) {
    font-size: 1.2rem;
  }
`;
