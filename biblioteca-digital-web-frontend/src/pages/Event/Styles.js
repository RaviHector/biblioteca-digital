import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: ${(props) => props.theme.colors.white};
  min-height: 100vh;
  color: ${(props) => props.theme.colors.textPrimary};
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
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  color: #f1f5f9;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    background: rgba(56, 189, 248, 0.1);
    border-color: #38bdf8;
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
  color: #f8fafc;
  text-align: center;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Description = styled.p`
  font-size: 1.1rem;
  color: #94a3b8;
  text-align: center;
  line-height: 1.6;
  margin: 0;
`;

export const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  color: #e2e8f0;

  svg {
    color: #38bdf8;
    flex-shrink: 0;
  }

  strong {
    color: #f8fafc;
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  width: 100%;
  background: ${(props) => props.theme.colors.white};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #f8fafc;
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
    color: #94a3b8;
  }

  svg {
    color: #64748b;
    flex-shrink: 0;
  }

  strong {
    color: #e2e8f0;
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
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin: 2rem 0;

  svg {
    color: #64748b;
  }

  h3 {
    font-size: 1.5rem;
    color: #f8fafc;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    max-width: 400px;
    color: #94a3b8;
  }
`;
