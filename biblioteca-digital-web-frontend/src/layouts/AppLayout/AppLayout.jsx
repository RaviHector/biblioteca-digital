import { useEffect } from "react";

import { Outlet, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { Container, Content } from "./Styles";
import { AddToast, Header } from "../../components/common";
import { useRefreshToken } from "../../hooks/query/sessions";
import { PropagateLoader } from "react-spinners";

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll page to top when it is opened
  }, [pathname]);
  const { isLoading } = useRefreshToken();


   return isLoading ? (
    <PropagateLoader color="#38bdf8" />
  ) : (
    <Container>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <AddToast />
    </Container>
  );
}
