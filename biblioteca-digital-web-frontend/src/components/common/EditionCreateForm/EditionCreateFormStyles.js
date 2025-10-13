import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: transparent;
  padding: 0;
  width: 100%;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.08);
  font-size: 1rem;
  outline: none;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary || '#1A1A1A'};
  &::placeholder { color: ${({ theme }) => theme.colors.textSecondary || '#6b7280'}; }
  &:focus { box-shadow: 0 6px 18px rgba(21,101,192,0.08); border-color: ${({ theme }) => theme.colors.primaryDark}; }
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
  padding: 0.75rem 1.25rem;
  background-color: ${(props) => props.backgroundcolor || "#1976d2"};
  color: ${(props) => props.color || "#fff"};
  border: none;
  border-radius: ${(props) => props.borderradius || "8px"};
  cursor: pointer;
  font-weight: 600;
`;

export const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.darkGreen || '#374151'};
`;

export const Select = styled.select`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.lightGreen};
  font-size: 1rem;
  outline: none;
  background: ${({ theme }) => theme.colors.white};
`;
