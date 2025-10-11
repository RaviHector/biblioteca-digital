import styled from 'styled-components';

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
  color: #ffffff;
  font-size: 2.4rem;

  @media (max-width: 700px) {
    font-size: 2rem;
  }
  @media (max-width: 370px) {
    font-size: 1.5rem;
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
  shouldForwardProp: (prop) => prop !== 'error',
})`
  height: 4rem;
  font-size: 1.8rem;
  padding: 0.8rem 1.6rem;
  padding-left: 4rem;
  border-radius: ${(props) => props.borderradius ?? '0.4rem'};
  width: 100%;

  border: ${(props) => (props.error ? '0.2rem red solid' : 'none')};
  background-color: ${(props) =>
    props.backgroundcolor ? props.backgroundcolor : 'transparent'};

  @media (max-width: 700px) {
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 2rem;
    height: 3rem;
  }

  @media (max-width: 370px) {
    font-size: 1.2rem;
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
