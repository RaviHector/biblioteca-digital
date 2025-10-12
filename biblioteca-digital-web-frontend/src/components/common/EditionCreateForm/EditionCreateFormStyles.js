import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.midGreen};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 400px;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.lightGreen};
  font-size: 1rem;
  outline: none;
  background: ${({ theme }) => theme.colors.white};
`;

export const ErrorMsg = styled.span`
  color: ${({ theme }) => theme.colors.error || '#ef4444'};
  font-size: 0.9rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: flex-end;
`;

export const Button = styled.button`
  padding: 0.8rem 1.4rem;
  background-color: ${(props) => props.backgroundcolor || "black"};
  color: ${(props) => props.color || "white"};
  border: none;
  border-radius: ${(props) => props.borderradius || "0.4rem"};
  cursor: pointer;
`;
