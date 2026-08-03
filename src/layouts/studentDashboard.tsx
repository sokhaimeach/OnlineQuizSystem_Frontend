import {
  BookOpenCheck,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useLogout } from "@/hooks/api/useAuth";
import { useStudentAccount } from "@/hooks/api/useUser";
import { cn } from "@/lib/utils";

const links = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/assignments", label: "Assignments", icon: BookOpenCheck },
  { to: "/student/classes", label: "My Classes", icon: GraduationCap },

  { to: "/student/account", label: "Account", icon: User },
];

function StudentShell() {
  const { theme, toggleTheme } = useTheme();
  const account = useStudentAccount().data;
  const logout = useLogout();
  const navigate = useNavigate();
  const name =
    [account?.first_name, account?.last_name].filter(Boolean).join(" ") ||
    "Student";
  const initials =
    `${account?.first_name?.[0] ?? "S"}${account?.last_name?.[0] ?? ""}`.toUpperCase();
  const nav = (mobile = false) =>
    links.map(({ to, label, icon: Icon }) => {
      const item = (
        <NavLink
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      );
      return mobile ? (
        <SheetClose asChild key={to}>
          {item}
        </SheetClose>
      ) : (
        <span key={to}>{item}</span>
      );
    });

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <NavLink
            to="/student/dashboard"
            className="flex items-center gap-2 font-bold"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <BookOpenCheck className="size-5" />
            </span>
            <span>QuizClass</span>
          </NavLink>
          <nav className="ml-6 hidden items-center gap-1 md:flex">{nav()}</nav>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="size-8">
                    <AvatarImage src={account?.avatar_url ?? undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-32 truncate text-sm sm:block">
                    {name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <p>{name}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">
                    {account?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/student/account")}>
                  <User /> Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/student/settings")}>
                  <Settings /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => logout.mutate()}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Student menu</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-1.5 px-4">{nav(true)}</nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <ThemeProvider>
      <StudentShell />
    </ThemeProvider>
  );
}
