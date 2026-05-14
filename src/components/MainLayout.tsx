import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
