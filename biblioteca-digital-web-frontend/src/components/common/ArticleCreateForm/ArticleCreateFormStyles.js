import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${(props) => props.theme.colors.background};
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 100%;
  min-height: 400px;
  
  h2 {
    margin: 0 0 16px 0;
    color: #1f2937;
    font-size: 1.25rem;
  }
  
  label {
    font-weight: 500;
    color: #374151;
    margin-bottom: 4px;
  }
  
  select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #d1d5db;
    font-size: 1rem;
  background: ${(props) => props.theme.colors.background};
    width: 100%;
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`;

export const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  padding: 0.8rem 1.4rem;
  background-color: ${(props) => props.backgroundcolor || "black"};
  color: ${(props) => props.color || "white"};
  border: none;
  border-radius: ${(props) => props.borderradius || "0.4rem"};
  cursor: pointer;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

export const ContainerWrapper = styled.div`
  margin-bottom: 16px;
`;

export const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  width: 100%;
  resize: vertical;
  font-family: inherit;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;