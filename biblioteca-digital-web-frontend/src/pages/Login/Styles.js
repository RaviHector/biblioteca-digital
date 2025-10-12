import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const InputsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.midGreen};
  border-radius: 2rem;
  width: 30%;
  height: 80%;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: auto;
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.darkGreen};
  }
`;

export const ToggleForm = styled.p`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.lightGreen};
  text-decoration: underline;
  margin-top: 1rem;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;
