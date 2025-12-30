import { createBrowserRouter } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import NotFoundPage from "./pages/NotFoundPage";
import RouteError from "./components/RouteError";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatPage />,
    errorElement: <RouteError />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <RouteError />,
  },
]);

export default router;
