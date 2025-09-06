import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

import { Outlet } from "react-router-dom";
import '../styles/layout.css';

const Layout = () => {
  const role = localStorage.getItem("role"); // "admin", "coach", or "user"

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1 }}>
        {role === "admin" ? <AdminNavbar /> : <Navbar />}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
