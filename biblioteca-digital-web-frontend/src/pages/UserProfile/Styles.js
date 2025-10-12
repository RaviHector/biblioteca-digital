import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 140rem;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  border-radius: 1.2rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  svg {
    color: ${({ theme }) => theme.colors.midGreen};
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

export const UserName = styled.h1`
  font-size: 2.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.font.black};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.4rem;
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
    color: ${({ theme }) => theme.colors.grey};
  }
`;

export const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.midGreen};
`;

export const StatLabel = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.font.grey};
`;

export const ArticlesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.font.black};
  text-align: center;
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  border-radius: 1.2rem;
  padding: 1.5rem;

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
  max-width: 40rem;

  svg {
    color: ${({ theme }) => theme.colors.grey};
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  border-radius: 0.8rem;
  font-size: 1.4rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.midGreen};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey};
  }
`;

export const FilterSelect = styled.select`
  padding: 1rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  border-radius: 0.8rem;
  font-size: 1.4rem;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.font.black};
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.midGreen};
  }
`;

export const YearSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const YearTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.midGreen};
  padding: 1rem 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrey};
`;

export const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(35rem, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ArticleCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  border-radius: 1.2rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.midGreen};
  }
`;

export const ArticleTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.font.black};
  margin-bottom: 1rem;
  line-height: 1.4;
`;

export const ArticleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.font.grey};

  div {
    display: flex;
    gap: 0.5rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.font.black};
    min-width: 8rem;
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40rem;
  width: 100%;
`;

export const NoArticlesMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.font.grey};

  svg {
    color: ${({ theme }) => theme.colors.grey};
  }

  h3 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.font.black};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.6rem;
    max-width: 40rem;
  }
`;