import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: transparent;
  padding: 0;
  width: 100%;
  min-height: 400px;
  
  h2 {
    margin: 0 0 16px 0;
    color: ${({ theme }) => theme.colors.textPrimary || '#1A1A1A'};
    font-size: 1.25rem;
  }
  
  label {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary || '#1A1A1A'};
    margin-bottom: 4px;
  }
  
  select {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.08);
    font-size: 1rem;
    background: ${({ theme }) => theme.colors.white};
    width: 100%;
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primaryDark};
      box-shadow: 0 6px 18px rgba(21,101,192,0.08);
    }
  }
`;

export const Input = styled.input`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.08);
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryDark};
    box-shadow: 0 6px 18px rgba(21,101,192,0.08);
  }
  &:read-only {
    background-color: #f9f9f9;
    cursor: not-allowed;
    color: #6b7280;
  }
`;

export const ErrorMsg = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: -8px;
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
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary || '#1A1A1A'};
  font-size: 0.875rem;
`;

export const ContainerWrapper = styled.div`
  margin-bottom: 16px;
`;

export const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.08);
  font-size: 1rem;
  width: 100%;
  resize: vertical;
  font-family: inherit;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryDark};
    box-shadow: 0 6px 18px rgba(21,101,192,0.08);
  }
`;