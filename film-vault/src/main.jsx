import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <FavoritesProvider>
            <App />
        </FavoritesProvider>
    </StrictMode>
);
