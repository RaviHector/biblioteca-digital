import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.colors.white};
  padding: 2rem 1rem;
`;

export const Header = styled.header`
  max-width: 800px;
  margin: 0 auto 2rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.darkGreen};
  border: 2px solid ${({ theme }) => theme.colors.darkGreen};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    background: ${({ theme }) => theme.colors.darkGreen};
    color: white;
  }
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.darkGreen};
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const InfoSection = styled.section`
  max-width: 800px;
  margin: 0 auto 2rem;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    color: ${({ theme }) => theme.colors.darkGreen};
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  strong {
    color: ${({ theme }) => theme.colors.darkGreen};
  }
`;

export const AuthorsList = styled.div`
  color: #374151;
  line-height: 1.5;
`;

export const EventInfo = styled.div`
  color: #374151;
  line-height: 1.5;
`;

export const ContentSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.darkGreen};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0 auto;
  min-width: 200px;

  &:hover {
    background: ${({ theme }) => theme.colors.midGreen};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  gap: 1rem;
  
  p {
    color: ${({ theme }) => theme.colors.darkGreen};
    font-size: 1.1rem;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  color: ${({ theme }) => theme.colors.darkGreen};
  
  svg {
    opacity: 0.5;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.8;
    margin-bottom: 2rem;
    max-width: 500px;
  }
`;