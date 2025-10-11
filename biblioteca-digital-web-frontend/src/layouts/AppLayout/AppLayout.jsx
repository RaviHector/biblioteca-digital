import { useEffect, useState } from "react";

import { Outlet, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { Container } from "./Styles";
import { AddToast, Header } from "../../components/common";

export default function AppLayout() {
  // eslint-disable-next-line no-unused-vars
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const { pathname } = useLocation();
  const timeToShowLoading = 2000; // milliseconds

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll page to top when it is opened
  }, [pathname]);

  useEffect(() => {
    const loadingTimer = setTimeout(
      () => setIsLoadingScreen(false),
      timeToShowLoading
    );

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <Container>
      <Header />
      <Outlet />
      <AddToast />
    </Container>
  );
}
