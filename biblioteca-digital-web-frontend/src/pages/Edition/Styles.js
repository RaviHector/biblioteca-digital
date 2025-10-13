import styled from "styled-components";

import { motion } from "framer-motion";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: transparent;
  min-height: 100vh;
  color: #1A1A1A;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
  width: 100%;
  max-width: 1000px;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(242,246,251,0.95);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  color: #1A1A1A;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.24s ease;
  align-self: flex-start;

  &:hover {
    background: rgba(56,189,248,0.08);
    border-color: rgba(56,189,248,0.6);
    transform: translateX(-2px);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(-2px);
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1A1A1A;
  text-align: center;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const EditionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  color: #2C2C2C;

  svg {
    color: #1976d2;
    flex-shrink: 0;
  }

  strong {
    color: #1A1A1A;
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  width: 100%;
  background: transparent;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled(motion.div)`
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.24s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(56,189,248,0.6);
    background: rgba(242,246,251,0.95);
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.9rem;
    color: #2C2C2C;
  }

  svg {
    color: #64748b;
    flex-shrink: 0;
  }

  strong {
    color: #1A1A1A;
  }
`;

export const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 2rem 0;

  svg {
    color: #64748b;
  }

  h3 {
    font-size: 1.5rem;
    color: #1A1A1A;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    max-width: 400px;
    color: #6b7280;
  }
`;
