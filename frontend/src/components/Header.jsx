import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/AuthStore";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const profilePath = user?.role === "AUTHOR" ? "/author-profile" : "/user-profile";
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}` || "U";

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8" aria-label="Main navigation">
        <NavLink to="/" end className="flex shrink-0 items-center gap-2.5" aria-label="Inkly home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-200" aria-hidden="true">
            ✦
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-slate-950 sm:block">inkly</span>
        </NavLink>

        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to={profilePath} className={linkClass}>
                <span className="hidden sm:inline">My space</span>
                <span className="sm:hidden">Space</span>
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                Log out
              </button>
              <NavLink to={profilePath} className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white" aria-label="Open profile">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="" className="h-full w-full rounded-full object-cover" />
                ) : initials}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <NavLink to="/register" className="ml-1 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700">
                Start writing
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
