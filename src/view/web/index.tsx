import { createRoot } from "react-dom/client";
// @ts-ignore
import "./main.css";
import { AppRouter } from "./router";

const root = createRoot(document.getElementById("root")!);
root.render(<AppRouter />);
