import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Header/Navbar";
import Footer from "../components/common/Footer/Footer";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="main-content">
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
