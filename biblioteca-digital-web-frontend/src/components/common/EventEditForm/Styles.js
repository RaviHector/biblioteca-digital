import styled from "styled-components";

export const Form = styled.form`
  min-width: 50rem;
  justify-content: center;
  padding: 1.5rem;
`;

export const ContainerWrapper = styled.div`
  margin-bottom: 1.2rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.6rem;
  color: ${({ theme }) => theme.colors.font.black};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
`;

export const Button = styled.button`
  padding: 0.8rem 1.4rem;
  background-color: ${(props) => props.backgroundcolor || "black"};
  color: ${(props) => props.color || "white"};
  border: none;
  border-radius: ${(props) => props.borderradius || "0.4rem"};
  cursor: pointer;
`;
