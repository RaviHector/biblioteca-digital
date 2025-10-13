import styled from "styled-components";
import { motion } from "framer-motion";

// --- SEUS ESTILOS EXISTENTES ---

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  min-height: 100vh;
  color: #f1f5f9;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #f8fafc;
  text-align: center;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
`;

export const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  /* Removido o cursor: pointer daqui para ser mais específico */

  &:hover {
    transform: translateY(-6px);
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
  }
`;

export const Line = styled.p`
  font-size: 1rem;
  margin: 0.3rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e2e8f0;
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto 32px;
  padding: 10px 16px;
  background-color: #f1f5f9;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  input {
    width: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 1rem;
    color: #334155;

    &::placeholder {
      color: #9ca3af;
    }
  }
`;


// --- NOVOS COMPONENTES ADICIONADOS ---

export const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 2rem; /* Aumentei a margem para combinar com o título */
`;

export const SearchTypeButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px; /* Combinando com o raio da borda do SearchInput */
  cursor: pointer;
  font-weight: 600; /* Um pouco mais forte */
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  /* Estilização condicional baseada na prop '$active' */
  background-color: ${(props) => (props.$active ? "#38bdf8" : "rgba(255, 255, 255, 0.1)")};
  color: ${(props) => (props.$active ? "#ffffff" : "#e2e8f0")};

  &:hover {
    background-color: ${(props) => (props.$active ? "#0ea5e9" : "rgba(255, 255, 255, 0.2)")};
  }
`;

export const CardContent = styled.div`
  cursor: pointer;
  /* O conteúdo clicável herda os estilos do Card */
`;

export const CardActions = styled.div`
  display: flex;
  justify-content: flex-end; /* Alinhando os botões à direita */
  gap: 16px; /* Aumentando um pouco o espaçamento */
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Separador visual */
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.9rem;
  padding: 4px;
  transition: transform 0.2s ease, text-decoration 0.2s ease;

  &:hover {
    transform: scale(1.05);
    text-decoration: underline;
  }
`;

export const EditButton = styled(ActionButton)`
  color: #38bdf8; /* Azul claro para editar */
`;

export const DeleteButton = styled(ActionButton)`
  color: #f472b6; /* Um rosa/vermelho mais suave para combinar com o tema */
`;