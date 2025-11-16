import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Inferencia from "./pages/Inferencia";
import "./App.css"; // si no tienes App.css, puedes borrar esta línea

const KMC_BLUE = "#2e75b6";

const navLinkClasses = ({ isActive }) =>
  [
    "px-3 py-1.5 rounded-md text-sm transition-colors",
    isActive
      ? "bg-[#2e75b6] text-white font-medium"
      : "text-slate-700 hover:text-slate-900",
  ].join(" ");

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar superior común a todas las páginas */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: KMC_BLUE }}
            />
            <div className="flex flex-col">
              <span className="text-[11px] tracking-[0.18em] uppercase text-slate-500 font-medium">
                Proyecto Madre Canguro · 20 años
              </span>
              <span className="text-sm font-semibold text-slate-900">
                Análisis estructural y radiomics T1
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <NavLink to="/" className={navLinkClasses} end>
              Inicio / Dashboard
            </NavLink>
            <NavLink to="/inferencia" className={navLinkClasses}>
              Inferencia
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Contenido enrutado */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inferencia" element={<Inferencia />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
