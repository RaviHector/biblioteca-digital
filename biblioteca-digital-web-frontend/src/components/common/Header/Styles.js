import styled from 'styled-components';

import Button from '../Button/Button';

const menuBreak = '900px';

export const Content = styled.div`
  display: flex;
  justify-content: center;

  padding: 0rem 5rem;
  margin: 0.5rem 0rem 0.5rem 0rem;
  box-shadow: 0px -1px 5px 1px ${({ theme }) => theme.colors.grey};
  height: 8rem;
  width: 100%;
  border-radius: 5rem;
  background-color: ${({ theme }) => theme.colors.headerGreen};

  @media (max-width: 420px) {
    padding: 0rem 2rem;
    height: 6rem;
  }
`;

export const InternContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  max-width: 140rem;
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4rem;
  @media (max-width: 1100px) {
    gap: 2rem;
  }
`;

export const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: justify;
  gap: 2rem;
  a {
    font-size: 2.2rem;
    font-family: ${(props) => props.theme.fonts.artnoova};
    text-decoration: none;
    color: ${(props) => props.theme.colors.font.black};
    position: relative;
    flex-direction: row;
    flex-grow: 1;
    :hover {
      text-decoration: underline;
    }
    @media (max-width: 1080px) {
      font-size: 1.8rem;
    }
    @media (max-width: ${menuBreak}) {
      margin-right: 0rem;
    }
  }
  @media (max-width: 990px) {
    gap: 1rem;
  }
  @media (max-width: ${menuBreak}) {
    background-color: ${(props) => props.theme.colors.softGreen};
    text-align: center;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    top: 10rem;
    padding: ${({ $bar }) => ($bar ? '1rem 0' : '0rem')};
    height: auto;
    max-height: ${({ $bar }) => ($bar ? '50rem' : '0rem')};
    left: 0%;
    right: 0%;
    transition: all 400ms ease;
    font-weight: 600;
    z-index: 10000;
    overflow-y: hidden;
    a {
      color: #fff;
      display: flex;
    }
    button {
      transition: all 700ms ease;
      font-weight: 600;
    }
  }
  @media (max-width: 420px) {
    top: 8rem;
  }
`;

export const Bar = styled.div`
  width: 2.6rem;
  right: 4%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  display: none;
  cursor: pointer;
  z-index: 100;
  @media (max-width: ${menuBreak}) {
    display: flex;
  }
  span {
    position: relative;
    width: 100%;
    height: 0.2rem;
    background-color: ${({ $bar, theme }) =>
      $bar ? 'transparent' : theme.colors.softGreen};
    border-radius: 0.5rem;
    transition: all 400ms ease-in-out;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 0.2rem;
      background-color: ${({ theme }) => theme.colors.softGreen};
      border-radius: 0.5rem;
      transition: all 400ms ease-in-out;
    }

    &::before {
      transform: ${({ $bar }) =>
        $bar ? 'rotate(-45deg)' : 'translateY(-8px)'};
    }

    &::after {
      transform: ${({ $bar }) => ($bar ? 'rotate(45deg)' : 'translateY(8px)')};
    }
  }
`;

export const ButtonLogin = styled(Button)`
  font-size: 2rem;
  width: 13rem;
  @media (max-width: 990px) {
    font-size: 1.8rem;
    width: 12rem;
  }
  @media (max-width: ${menuBreak}) {
    display: ${({ $collapse }) => ($collapse ? 'flex' : 'none')};
  }
`;

export const InvertItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4rem;

  @media (max-width: ${menuBreak}) {
    flex-direction: column-reverse;
    justify-content: center;
    gap: 1rem;
  }
`;

export const Welcome = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0rem;
  font-family: ${(props) => props.theme.fonts.artnoova};
  font-size: 2.2rem;
  font-weight: 700;
  a {
    margin-right: 0.5rem;
  }
  @media (max-width: 1080px) {
    font-size: 1.8rem;
  }
  @media (max-width: ${menuBreak}) {
    text-align: center;
    font-weight: 600;
  }
`;

export const Divider = styled.div`
  background-color: white;
  height: 0.2rem;
  display: flex;
  max-height: ${({ $collapse }) => ($collapse ? '1rem' : '0rem')};
  align-self: stretch;
  overflow-y: hidden;
  transition: all 400ms ease-in-out;
`;

export const MenuProfile = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.5s ease-in-out 0.5s;
  div {
    svg {
      transform: ${({ $collapse }) =>
        $collapse ? 'rotate(180deg)' : 'rotate(0deg)'};
      transition: all 400ms ease-in-out;
    }
  }
`;

export const MyProfile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;

  button {
    background-color: transparent;
    border: none;
    max-height: none;
    color: white;
    font-family: ${(props) => props.theme.fonts.artnoova};
    font-size: 1.8rem;
    :hover {
      cursor: pointer;
      text-decoration: underline solid white 0.2rem;
    }
  }
  svg {
    :hover {
      cursor: pointer;
    }
  }
`;

export const LogoutBtn = styled.button`
  border: none;
  border-left: 0.2rem solid ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.font.black};
  font-family: ${(props) => props.theme.fonts.artnoova};
  font-weight: 500;
  text-decoration: none;
  background-color: transparent;
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 2.2rem;
  :hover {
    text-decoration: underline solid ${(props) => props.theme.colors.softGreen}
      0.2rem;
    cursor: pointer;
  }

  @media (max-width: ${menuBreak}) {
    border-left: none;
    color: white;
    font-weight: 500;
    padding-left: 0rem;
    display: flex;
    max-height: ${({ $collapse }) => ($collapse ? '10rem' : '0rem')};
    overflow-y: hidden;
    :hover {
      text-decoration-color: white;
      text-decoration-thickness: 0.1rem;
    }
  }

  @media (max-width: 1080px) {
    font-size: 1.8rem;
  }

  transition: all 400ms ease-in-out;
`;
