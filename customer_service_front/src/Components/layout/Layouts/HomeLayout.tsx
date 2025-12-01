import { Outlet } from "react-router-dom";
import { Footer } from "../../footer";
import { NavigationBar } from "../NavigationBar/NavigationBar";

export function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-tas-bg-page">
      <NavigationBar />
      <main className="flex-grow pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
