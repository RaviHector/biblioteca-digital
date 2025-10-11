import { useState } from 'react';

import { IoIosArrowDown } from 'react-icons/io';
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';

import { Logo } from '..';
import {
  Content,
  Menu,
  Nav,
  Bar,
  ButtonLogin,
  InternContainer,
  InvertItems,
  Welcome,
  LogoutBtn,
  MenuProfile,
  Divider,
  MyProfile,
} from './Styles';

export default function Header() {
  // State variables
  const [bar, setBar] = useState(false);
  const [collapseLogout, setCollapseLogout] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery({ maxWidth: 900 });

  const closeHeader = () => {
    setBar(false);
    setCollapseLogout(false);
  };
  const user = {
    name: 'Rian Rero',
  };
  // const user = undefined;

  // Component
  const welcomeSectionComponent = (() => {
    if (isSmallScreen)
      return (
        <MenuProfile $collapse={collapseLogout} $bar={bar}>
          <MyProfile>
            <button
              type="button"
              onClick={() => {
                closeHeader();
                navigate('/perfil');
              }}
            >
              Meu Perfil
            </button>
            <IoIosArrowDown
              color="white"
              onClick={() => setCollapseLogout((prev) => !prev)}
            />
          </MyProfile>
          <Divider $collapse={collapseLogout && bar} />
          <LogoutBtn $collapse={collapseLogout && bar}>Deslogar</LogoutBtn>
        </MenuProfile>
      );

    const firstName = user?.name?.split(' ')?.[0];
    const nameLengthLimit = 10;

    const isLessThanEqualLimit = firstName?.length <= nameLengthLimit;
    return (
      <>
        <Link to="/perfil" onClick={() => setBar(false)}>
          {isLessThanEqualLimit ? `Olá, ${firstName}!` : 'Meu Perfil'}
        </Link>
        <LogoutBtn $collapse={collapseLogout}>Deslogar</LogoutBtn>
      </>
    );
  })();
  return (
    <Content>
      <InternContainer>
        <Logo />
        <Menu>
          <Nav $bar={bar}>
            <Link to="/login" onClick={closeHeader}>
              Login
            </Link>
            <Link to="/u" onClick={closeHeader}>
              NotFound
            </Link>
            <InvertItems>
              {user ? (
                <Welcome>{welcomeSectionComponent}</Welcome>
              ) : (
                <ButtonLogin
                  backgroundColor={theme.colors.backgroundGrey}
                  backgroundColor800={theme.colors.midGreen}
                  borderRadius="2rem"
                  minWidth="15rem"
                  color800={theme.colors.white}
                  borderColor="transparent"
                  hoverBackgroundColor={theme.colors.midGreen}
                  hoverBackgroundColor800={theme.colors.midGreen}
                  hoverColor800="white"
                  hoverBorderColor800={theme.colors.midGreen}
                  $collapse={bar}
                  onClick={() => {
                    closeHeader();
                    navigate('/login');
                  }}
                >
                  Login
                </ButtonLogin>
              )}
            </InvertItems>
          </Nav>
          <Bar $bar={bar} onClick={() => setBar((prev) => !prev)}>
            <span />
          </Bar>
        </Menu>
      </InternContainer>
    </Content>
  );
}
