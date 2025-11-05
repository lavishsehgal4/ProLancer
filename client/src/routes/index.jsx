import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";

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
      // Add more routes here as you build pages
      // {
      //   path: 'jobs',
      //   element: <JobList />
      // },
      // {
      //   path: 'dashboard',
      //   element: <Dashboard />
      // },
    ],
  },
]);

export default router;
