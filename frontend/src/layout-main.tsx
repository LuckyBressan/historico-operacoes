import { Outlet } from "react-router";
import Navbar from "./components/navbar";

export default function LayoutMain() {
  return (
    <div
      className="
        min-h-screen max-w-screen
        bg-background flex flex-col gap-3
      "
    >
        <Navbar />
        <main className="container mx-auto px-6 py-8">
          <Outlet />
        </main>
    </div>
  );
}
