import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.main`
  min-height: calc(100vh - 8rem);
  background: ${(props) => props.theme.colors.white};
  padding: 3.2rem 1.6rem;
  display: flex;
  flex-direction: column;
`;

export const SearchSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 2.4rem 1.6rem;
`;

export const Title = styled.h1`
  font-size: 3.6rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primaryDark};
  margin-bottom: 0.8rem;
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.6rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 2.4rem;
  font-weight: 300;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 640px;
  margin-bottom: 2rem;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.primaryLight};
  opacity: 0.95;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 1.4rem 1.6rem 1.4rem 4rem;
  font-size: 1.6rem;
  border: 0.12rem solid rgba(13,71,161,0.06);
  border-radius: 3rem;
  outline: none;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0 6px 20px ${(props) => props.theme.colors.shadow};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primaryDark};
    box-shadow: 0 8px 30px rgba(21,101,192,0.12);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
    opacity: 0.8;
  }
`;

export const ResultsSection = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
`;

export const ArticleCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  padding: 1.6rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 6px 20px ${(props) => props.theme.colors.shadow};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(13,71,161,0.03);

  &:hover {
    box-shadow: 0 10px 32px rgba(13,71,161,0.08);
    transform: translateY(-3px);
  }
`;

export const ArticleTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${(props) => props.theme.colors.primaryDark};
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  line-height: 1.4;
`;

export const ArticleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const ArticleAuthors = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1.4rem;
`;

export const ArticleEvent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1.4rem;
`;

export const LoginPrompt = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1.4rem;
  font-weight: 500;
  padding: 0.5rem 0;
  border-top: 1px solid ${(props) => props.theme.colors.surface};
  margin-top: 1rem;
  padding-top: 1rem;
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

export const NoResults = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${(props) => props.theme.colors.textSecondary};
  svg {
    opacity: 0.6;
    margin-bottom: 1rem;
  }
  h3 {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
    opacity: 0.9;
  }
  p {
    opacity: 0.8;
  }
`;

export const LoginButton = styled.button`
  background: ${(props) => props.theme.colors.primaryDark};
  color: ${(props) => props.theme.colors.white};
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primaryLight};
    color: ${(props) => props.theme.colors.textPrimary};
    transform: translateY(-2px);
  }
`;

// Backwards-compatible alias: some components/pages previously imported HomeBackground
// Keep this alias to avoid runtime module import errors after refactors.
export const HomeBackground = Container;
