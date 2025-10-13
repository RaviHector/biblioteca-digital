import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  h1 {
    color: #1A1A1A;
    margin-bottom: 2rem;
    text-align: center;
  }

  p {
    color: #6b7280;
    font-size: 1.1rem;
    text-align: center;
  }

  button {
    background: #1976d2;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);

    &:hover {
      background: #165fa8;
    }
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;