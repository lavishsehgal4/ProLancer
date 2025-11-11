import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import CategoryDetail from "../pages/CategoryDetail/CategoryDetail";

// Create router with routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Wrapper with Navbar + Footer
    children: [
      {
        index: true, // Default route for "/"
        element: <Home />,
      },
      {
        path: "categories/:categoryName",
        element: <CategoryDetail />,
      },
    ],
  },
]);

export default router;
