import styled from 'styled-components';

export const FooterContainer = styled.footer`
  display: flex;

  background: #f8f9fa;
  padding: 2rem 1rem;
  margin-top: 2rem;
  border-top: 3px solid #d72638; /* cor que lembra o logo */

  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
    flex-direction: row;
    justify-content: space-between;
    padding: 2rem 4rem;
  }
`;

export const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: #d72638;
  margin-bottom: 1rem;
`;

export const Names = styled.div`
  font-size: 1.2rem;
  color: #333;
  max-width: 600px;
  line-height: 1.4;

  span {
    display: inline-block;
    margin-right: 6px;
  }
`;

export const ExtraInfo = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: #555;

  p {
    margin: 4px 0;
  }

  @media (min-width: 768px) {
    margin-top: 0;
    text-align: right;
  }
`;
