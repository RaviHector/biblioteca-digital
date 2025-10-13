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
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  width: 420px;
  max-width: 92%;
  justify-content: center;
  align-items: center;
  padding: 40px 36px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
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
  padding: 0.9rem 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.18s ease;
  background: ${(props) => props.theme.colors.primaryDark};
  color: ${(props) => props.theme.colors.white};
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(21,101,192,0.12);
  }
`;

export const ToggleForm = styled.p`
  cursor: pointer;
  color: ${(props) => props.theme.colors.primaryDark};
  text-decoration: underline;
  margin-top: 12px;
  text-align: center;
  font-size: 0.95rem;
`;

export const IconWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(21,101,192,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;
