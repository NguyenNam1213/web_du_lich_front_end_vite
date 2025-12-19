import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useUser } from "../../context/UserContext";
export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
}