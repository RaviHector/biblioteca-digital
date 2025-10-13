import styled from "styled-components";
import { motion } from "framer-motion";

// --- SEUS ESTILOS EXISTENTES ---

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: transparent;
  min-height: 100vh;
  /* Keep header exactly as-is; this only adjusts page content typography */
  color: #1A1A1A;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  /* Title should be darker for legibility over light background */
  color: #1A1A1A;
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
  /* Slightly darker, semi-opaque card background for contrast */
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.24s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(56, 189, 248, 0.6);
    /* Keep subtle hover but do not change to strong translucent blue which would break contrast */
    background: rgba(242, 246, 251, 0.95); /* #f2f6fb toned */
  }
`;

export const Line = styled.p`
  font-size: 1rem;
  margin: 0.3rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2C2C2C; /* darker text for readability */
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
  background-color: rgba(242,246,251,0.95); /* slightly darker than before */
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.06);

  input {
    width: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 1rem;
    color: #2C2C2C;

    &::placeholder {
      color: #6b7280; /* darker placeholder for accessibility */
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
  background-color: ${(props) => (props.$active ? "#38bdf8" : "rgba(255, 255, 255, 0.85)")};
  color: ${(props) => (props.$active ? "#ffffff" : "#1A1A1A")};

  &:hover {
    background-color: ${(props) => (props.$active ? "#0ea5e9" : "rgba(242,246,251,0.95)")};
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
  border-top: 1px solid rgba(0,0,0,0.06); /* Separador visual (subtle) */
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
  color: #1976d2; /* slightly darker blue for contrast */
`;

export const DeleteButton = styled(ActionButton)`
  color: #c62828; /* darker red for better contrast */
`;