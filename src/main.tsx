import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { CardBuilder } from "./card-builder/CardBuilder";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="cards" element={<CardBuilder/>}/>
    </Routes>
  </HashRouter>
);
