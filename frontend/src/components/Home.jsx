import { NavLink } from "react-router";

const topics = [
  { label: "Design & creativity", icon: "✦", tone: "bg-amber-50 text-amber-700" },
  { label: "Technology", icon: "◈", tone: "bg-indigo-50 text-indigo-700" },
  { label: "Life & culture", icon: "♡", tone: "bg-rose-50 text-rose-700" },
];

function Home() {
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-white shadow-2xl shadow-slate-200 sm:px-12 sm:py-24 lg:px-20">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-indigo-300">A home for curious minds</p>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Ideas worth sharing deserve a place to land.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Inkly is a calm, welcoming space for essays, experiments, and the stories behind what you make.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <NavLink to="/register" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50">
              Create your account
            </NavLink>
            <NavLink to="/login" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Sign in
            </NavLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl py-16 sm:py-20" aria-labelledby="topics-heading">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Find your people</p>
            <h2 id="topics-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Explore a better feed.</h2>
          </div>
          <span className="hidden text-sm text-slate-500 sm:block">Read. Follow. Make.</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {topics.map((topic) => (
            <div key={topic.label} className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${topic.tone}`}>{topic.icon}</span>
              <h3 className="mt-8 text-lg font-bold text-slate-950">{topic.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Thoughtful perspectives from people building, learning, and living with intention.</p>
              <NavLink to="/register" className="mt-5 inline-block text-sm font-bold text-indigo-600 transition group-hover:text-indigo-800">Browse stories <span aria-hidden="true">→</span></NavLink>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-indigo-100 bg-indigo-50/60 p-7 sm:p-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Your voice matters</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Turn your notes into something people remember.</h2>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">Publish at your own pace, connect with readers, and keep your best work in one beautiful place.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">A</span>
            <div><p className="text-sm font-bold text-slate-900">A quiet thought</p><p className="text-xs text-slate-500">A story in progress</p></div>
          </div>
          <p className="pt-5 text-lg font-semibold leading-7 text-slate-800">“The best ideas become clearer when we give them room.”</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
