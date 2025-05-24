import { Outlet } from "react-router-dom";
import { NavigationBar } from "../NavigationBar/NavigationBar";

export function HomeLayout () {
  return (
    <div>
      <NavigationBar onNavigate={function (sectionId: string): void {
              throw new Error("Function not implemented.");
          } } activeSection={""} isDarkMode={false} toggleDarkMode={function (): void {
              throw new Error("Function not implemented.");
          } } />
      <div >
        <Outlet />
      </div>
    </div>
  )
}