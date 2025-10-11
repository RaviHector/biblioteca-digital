import styled from 'styled-components';

const CHAMFER = '4rem';

export const Card = styled.div`
  background-color: ${(props) => props.backgroundcolor};
  width: 36rem;
  height: 36rem;
  padding: 2.8rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 3rem;
  /* recorte no canto superior direito e no canto inferior esquerdo */
  clip-path: polygon(
    0 0,
    calc(100% - ${CHAMFER}) 0,
    100% ${CHAMFER},
    100% 100%,
    ${CHAMFER} 100%,
    0 calc(100% - ${CHAMFER})
  );

  border: none;
  @media (max-width: 500px) {
    width: 36rem;
    height: 36rem;
  }
`;

export const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.cooper};
`;

export const Separator = styled.hr`
  border: none;
  border-top: 2px solid black;
  margin: 8px 0;
`;

export const Text = styled.p`
  font-size: 1.8rem;
  font-family: ${({ theme }) => theme.fonts.inter};
`;

export const IconWrapper = styled.div`
  align-self: flex-end;
  font-size: 6rem;
`;
