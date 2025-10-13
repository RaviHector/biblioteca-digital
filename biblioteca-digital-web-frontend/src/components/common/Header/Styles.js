import styled from "styled-components";

import Button from "../Button/Button";

const menuBreak = "900px";

export const Content = styled.header`
  display: flex;
  justify-content: center;
  padding: 1.4rem 2.4rem;
  margin: 0;
  width: 100%;
  background-color: ${(props) => props.theme.colors.headerBackground};
  color: ${(props) => props.theme.colors.white};
  box-shadow: 0 4px 14px ${(props) => props.theme.colors.shadow};
`;

export const InternContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  max-width: 140rem;
  gap: 2rem;
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  a {
    font-size: 1.6rem;
    text-decoration: none;
    color: ${(props) => props.theme.colors.white};
    position: relative;
    :hover {
      opacity: 0.95;
      text-decoration: underline;
    }
    @media (max-width: 1080px) {
      font-size: 1.4rem;
    }
  }
  @media (max-width: ${menuBreak}) {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    top: 7.2rem;
    left: 0;
    right: 0;
    z-index: 10000;
    background-color: ${(props) => props.theme.colors.primaryDark};
    padding: ${({ $bar }) => ($bar ? "1rem 0" : "0rem")};
    max-height: ${({ $bar }) => ($bar ? "50rem" : "0rem")};
    overflow: hidden;
    transition: all 300ms ease;
    a {
      color: ${(props) => props.theme.colors.white};
    }
  }
`;

export const Bar = styled.div`
  width: 2.6rem;
  right: 4%;
  height: 4rem;
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  z-index: 100;
  @media (max-width: ${menuBreak}) {
    display: flex;
  }
  span {
    position: relative;
    width: 100%;
    height: 0.2rem;
    background-color: ${(props) => props.theme.colors.primaryLight};
    border-radius: 0.5rem;
    transition: all 300ms ease-in-out;

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 0.2rem;
      background-color: ${(props) => props.theme.colors.primaryLight};
      border-radius: 0.5rem;
      transition: all 300ms ease-in-out;
    }

    &::before {
      transform: ${({ $bar }) => ($bar ? "rotate(-45deg)" : "translateY(-8px)")};
    }

    &::after {
      transform: ${({ $bar }) => ($bar ? "rotate(45deg)" : "translateY(8px)")};
    }
  }
`;

export const ButtonLogin = styled(Button)`
  font-size: 1.6rem;
  min-width: 12rem;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.ctaGradientStart} 0%, ${(props) => props.theme.colors.ctaGradientEnd} 100%);
  color: ${(props) => props.theme.colors.white};
  border-radius: 0.8rem;
  padding: 0.8rem 1.8rem;
  border: none;
  box-shadow: 0 8px 24px ${(props) => props.theme.colors.ctaShadow};
  transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(21,101,192,0.22);
    opacity: 0.98;
  }

  @media (max-width: ${menuBreak}) {
    display: ${({ $collapse }) => ($collapse ? "flex" : "none")};
  }
`;

export const InvertItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.6rem;

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
  font-size: 1.6rem;
  font-weight: 600;
  a {
    margin-right: 0.5rem;
  }
  @media (max-width: 1080px) {
    font-size: 1.4rem;
  }
`;

export const Divider = styled.div`
  background-color: rgba(255,255,255,0.12);
  height: 0.1rem;
  width: 100%;
  max-height: ${({ $collapse }) => ($collapse ? "1rem" : "0rem")};
  align-self: stretch;
  overflow: hidden;
  transition: all 300ms ease-in-out;
`;

export const MenuProfile = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease-in-out;
  div {
    svg {
      transform: ${({ $collapse }) => ($collapse ? "rotate(180deg)" : "rotate(0deg)")};
      transition: all 200ms ease-in-out;
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
    color: ${(props) => props.theme.colors.white};
    font-size: 1.4rem;
    :hover {
      cursor: pointer;
      text-decoration: underline solid rgba(255,255,255,0.9) 0.2rem;
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
  color: ${(props) => props.theme.colors.white};
  font-weight: 500;
  background-color: transparent;
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  @media (max-width: ${menuBreak}) {
    color: white;
    padding-left: 0rem;
    display: flex;
    max-height: ${({ $collapse }) => ($collapse ? "10rem" : "0rem")};
    overflow-y: hidden;
  }

  transition: all 200ms ease-in-out;
`;

export const NotificationButton = styled.button`
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(227, 242, 253, 0.9); /* primaryLight */
    color: ${(props) => props.theme.colors.textPrimary};
    transform: translateY(-2px);
    border-color: rgba(13,71,161,0.12);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${menuBreak}) {
    width: 40px;
    height: 40px;
  }
`;
