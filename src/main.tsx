import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { TagsProvider } from "./assets/services/tags/tagsService";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
