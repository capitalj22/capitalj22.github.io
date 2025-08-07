import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import "./local-fonts.css";
import { CardBuilder } from "./card-builder/CardBuilder";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Tears } from "./tears/tears";

const router = createHashRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "cards",
        element: <CardBuilder />,
      },
      {
        path: "tears",
        element: <Tears />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
