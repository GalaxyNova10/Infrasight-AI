// frontend/src/App.jsx
import React from "react";
import Routes from "./Routes";
import Logo from './Logo.png';

function App() {
  return (
    <div>
      <header className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-[#10192A] to-[#1A237E]">
        <img src={Logo} alt="Infrasight AI Logo" className="h-24 w-auto drop-shadow-xl" />
        <span className="mt-4 text-3xl font-bold tracking-wide text-cyan-300 drop-shadow-lg">
          Infrasight AI
        </span>
      </header>
      <Routes />
    </div>
  );
}

export default App;