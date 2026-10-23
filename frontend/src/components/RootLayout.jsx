import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../store/AuthStore";

function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div>
      <Header />
      <main className="min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;