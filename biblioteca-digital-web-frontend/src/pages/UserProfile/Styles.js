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

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  margin-bottom: 3rem;
  width: 100%;
  max-width: 600px;

  svg {
    color: #38bdf8;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

export const UserName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const UserStats = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  svg {
    color: #64748b;
  }
`;

export const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: #38bdf8;
`;

export const StatLabel = styled.div`
  font-size: 1rem;
  color: #94a3b8;
`;

export const ArticlesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #f8fafc;
  text-align: center;
  margin-bottom: 1rem;
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 400px;

  svg {
    color: #64748b;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  color: #f1f5f9;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`;

export const FilterSelect = styled.select`
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  color: #f1f5f9;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
  }

  option {
    background: #1e293b;
    color: #f1f5f9;
  }
`;

export const YearSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const YearTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #38bdf8;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(56, 189, 248, 0.3);
`;

export const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ArticleCard = styled(motion.div)`
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

export const ArticleTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

export const ArticleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1rem;
  color: #94a3b8;

  div {
    display: flex;
    gap: 0.5rem;
  }

  strong {
    color: #e2e8f0;
    min-width: 8rem;
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

export const NoArticlesMessage = styled.div`
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
