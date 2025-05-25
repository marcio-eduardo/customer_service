import { Outlet } from "react-router-dom";
import { NavigationBar } from "../NavigationBar/NavigationBar";

export function HomeLayout() {
  return (
    <div>
      <NavigationBar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
