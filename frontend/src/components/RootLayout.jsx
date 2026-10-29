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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 pt-6 sm:px-8 sm:pt-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;