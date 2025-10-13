import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: transparent;
  min-height: 100vh;
  color: ${(props) => props.theme.colors.textPrimary};
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #f8fafc;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Message = styled.div`
  font-size: 1.2rem;
  color: #94a3b8;
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const YearSection = styled.div`
  width: 100%;
  max-width: 900px;
  margin-bottom: 3rem;
`;

export const YearTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #38bdf8;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(56, 189, 248, 0.3);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const ArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ArticleCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
    box-shadow: 0 8px 32px rgba(56, 189, 248, 0.2);
  }
`;

export const ArticleTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 0.8rem;
  line-height: 1.4;
`;

export const ArticleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #cbd5e1;
  font-size: 0.95rem;
`;

export const ArticleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #38bdf8;
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
`;

export const AuthorStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

export const StatItem = styled.div`
  text-align: center;

  .number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #38bdf8;
    display: block;
  }

  .label {
    font-size: 0.9rem;
    color: #94a3b8;
    margin-top: 0.25rem;
  }
`;
