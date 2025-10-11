import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AppLayout } from "./layouts";
import { Home, Login, Events, Event } from "./pages";
import useAuthStore from "./stores/auth";

// For the routes that need the user to be logged in
function PrivateRoutes() {
  const auth = useAuthStore((state) => state.auth);
  const { pathname: from } = useLocation();

  return !auth ? <Navigate to="/login" state={{ from }} /> : <Outlet />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="events" element={<Events />} />
        <Route path="event/:_id" element={<Event />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        {/* O que for privado colcoar aqui */}
      </Route>
    </Route>
  )
);
export default function Routes() {
  return <RouterProvider router={router} />;
}
