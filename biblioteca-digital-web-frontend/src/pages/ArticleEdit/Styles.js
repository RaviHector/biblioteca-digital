import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    color: #1f2937;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  p {
    color: #6b7280;
    font-size: 1.1rem;
    text-align: center;
  }
  
  button {
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
    
    &:hover {
      background: #2563eb;
    }
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;