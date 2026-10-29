import { NavLink } from "react-router";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-lg font-black tracking-tight text-white">inkly</p>
          <p className="mt-1 text-sm text-slate-400">A thoughtful home for your next idea.</p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <NavLink to="/" className="transition hover:text-white">Home</NavLink>
          <NavLink to="/register" className="transition hover:text-white">Join the community</NavLink>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} Inkly. Made for meaningful stories.</div>
    </footer>
  );
}

export default Footer;
