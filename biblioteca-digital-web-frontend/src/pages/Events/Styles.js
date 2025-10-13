import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: ${(props) => props.theme.colors.white};
  min-height: 100vh;
  color: #1A1A1A;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
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
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.24s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(56, 189, 248, 0.6);
    background: rgba(242,246,251,0.95);
  }
`;

export const Line = styled.p`
  font-size: 1rem;
  margin: 0.3rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2C2C2C;
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;
