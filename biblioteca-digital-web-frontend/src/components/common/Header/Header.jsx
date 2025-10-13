import { useState } from "react";

import { IoIosArrowDown } from "react-icons/io";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import { Bell } from "lucide-react";

import { Logo } from "..";
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
  NotificationButton,
} from "./Styles";
import useAuthStore from "../../../stores/auth";
import { useLogout } from "../../../hooks/query/sessions";
import { useCreateUserByAdmin } from "../../../hooks/query/users";
import { Popup, UserCreateForm } from "../";
import { EmailNotificationModal } from "../../features";
import { toast } from "react-toastify";

export default function Header() {
  // State variables
  const [bar, setBar] = useState(false);
  const [collapseLogout, setCollapseLogout] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openEmailNotification, setOpenEmailNotification] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery({ maxWidth: 900 });

  const closeHeader = () => {
    setBar(false);
    setCollapseLogout(false);
  };
  const user = useAuthStore((state) => state.auth?.user);

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      closeHeader();
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    },
    onError: () => {
      toast.error("Erro ao realizar logout. Tente novamente mais tarde.");
    },
  });

  const { mutate: createUserByAdmin } = useCreateUserByAdmin({
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      setOpenCreateUser(false);
    },
    onError: (err) => toast.error(`Erro ao criar usuário: ${err.message}`),
  });

  const handleCreateUser = (newData) => {
    createUserByAdmin(newData);
  };

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
                navigate("/profile");
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
          {user?.isAdmin && (
            <LogoutBtn 
              onClick={() => setOpenCreateUser(true)} 
              $collapse={collapseLogout && bar}
              style={{ marginBottom: '0.5rem' }}
            >
              Cadastrar Usuário
            </LogoutBtn>
          )}
          <LogoutBtn onClick={logout} $collapse={collapseLogout && bar}>
            Deslogar
          </LogoutBtn>
        </MenuProfile>
      );

    const firstName = user?.name?.split(" ")?.[0];
    const nameLengthLimit = 10;

    const isLessThanEqualLimit = firstName?.length <= nameLengthLimit;
    return (
      <>
        <Link to="/profile" onClick={() => setBar(false)}>
          {isLessThanEqualLimit ? `Olá, ${firstName}!` : "Meu Perfil"}
        </Link>
        {user?.isAdmin && (
          <LogoutBtn 
            onClick={() => setOpenCreateUser(true)} 
            $collapse={collapseLogout}
            style={{ marginRight: '0.5rem' }}
          >
            Cadastrar Usuário
          </LogoutBtn>
        )}
        <LogoutBtn onClick={logout} $collapse={collapseLogout}>
          Deslogar
        </LogoutBtn>
      </>
    );
  })();
  return (
    <Content>
      <InternContainer>
        <Logo />
        <Menu>
          <Nav $bar={bar}>
            {/* Botão de notificação - disponível para todos */}
            <NotificationButton
              onClick={() => {
                setOpenEmailNotification(true);
                closeHeader();
              }}
              title="Cadastrar notificações por email"
            >
              <Bell size={20} />
            </NotificationButton>

            {user && (
              <Link to="/events" onClick={closeHeader}>
                Eventos
              </Link>
            )}
            {user?.isAdmin && (
              <Link to="/adminpage" onClick={closeHeader}>
                Administrador
              </Link>
            )}
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
                    navigate("/login");
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
      
      {/* Popup de criação de usuário */}
      <Popup
        title="Cadastrar Usuário"
        openPopup={openCreateUser}
        setOpenPopup={(v) => {
          setOpenCreateUser(v);
        }}
      >
        <UserCreateForm
          onSave={handleCreateUser}
          onCancel={() => setOpenCreateUser(false)}
        />
      </Popup>

      {/* Modal de notificação por email */}
      <EmailNotificationModal
        isOpen={openEmailNotification}
        onClose={() => setOpenEmailNotification(false)}
      />
    </Content>
  );
}
