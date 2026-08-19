import { SidebarTrigger } from "./ui/sidebar";

export default function Navbar() {
  return (
    <nav className="p-2 flex items-center justify-left border-b border-primary-background bg-primary-foreground sticky top-0 z-50">
      <SidebarTrigger className="cursor-pointer" />
    </nav>
  );
}
