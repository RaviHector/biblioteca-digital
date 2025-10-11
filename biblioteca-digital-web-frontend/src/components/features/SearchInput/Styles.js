import styled from 'styled-components';

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'error',
})`
  height: 4rem;
  font-size: 1.8rem;
  padding: 0.8rem 1.6rem;
  padding-left: 4rem;
  width: 100%;
  color: ${(props) => props.customcolor ?? '#000'};
  border-radius: ${(props) => props.customborderradius ?? '0.4rem'};

  border: ${(props) => (props.error ? '0.2rem red solid' : 'none')};
  background: ${(props) =>
    props.error ? 'rgba(239, 202, 202, 1)' : props.backgroundcolor};

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
export const InputWrapper = styled.div`
  position: relative;
  width: ${(props) => props.customwidth ?? '100%'};
  border-color: ${(props) => props.custombordercolor ?? '#ccc'};
  background-color: ${(props) => props.custombackgroundcolor ?? '#fff'};
  border-radius: ${(props) => props.customborderradius ?? '2rem'};
  min-height: ${(props) => props.customminheight ?? '3rem'};
  border-radius: ${(props) => props.customborderradius ?? '0.4rem'};
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
