import LogRocket from "logrocket";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize LogRocket
LogRocket.init("9ulbok/plant-tracker");

// Capture unhandled errors
window.addEventListener("error", (event) => {
  LogRocket.captureException(event.error);
});

// Capture unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  LogRocket.captureException(event.reason);
});

createRoot(document.getElementById("root")!).render(<App />);
