import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/Home";
import CategoryDetail from "../pages/CategoryDetail/CategoryDetail";
import SignUpChoice from "../pages/Auth/SignUpChoice/SignUpChoice";
import SignUpForm from "../pages/Auth/SignUpForm/SignUpForm";

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
  // Auth Layout Routes (NO Navbar/Footer - Clean auth pages)
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "signup",
        element: <SignUpChoice />, // Choose client or freelancer
      },
      {
        path: "signup/client",
        element: <SignUpForm />, // Client signup form
      },
      {
        path: "signup/freelancer",
        element: <SignUpForm />, // Freelancer signup form (same component)
      },
      // {
      //   path: 'login',
      //   element: <Login /> // Login page (create next)
      // },
    ],
  },
]);

export default router;
