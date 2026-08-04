import {
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/api/useUser";
import { useLogout } from "@/hooks/api/useAuth";
import { toast } from "sonner";

interface TopNavBarProps {
  breadcrumb: { label: string; href?: string }[];
}

export function TopNavBar({ breadcrumb }: TopNavBarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const account = useUser().data;
  const logout = useLogout();
  const user = {
    name:
      [account?.first_name, account?.last_name].filter(Boolean).join(" ") ||
      "Teacher",
    email: account?.email || "",
    avatar: account?.avatar_url || "",
  };
  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-40 flex h-17.5 shrink-0 items-center gap-2 bg-card backdrop-blur-sm border-b border-border px-4 transition-all">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1 h-8 w-8 shrink-0" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4 mr-1 shrink-0"
        />
        <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground min-w-0">
          {breadcrumb.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1 min-w-0">
              {idx > 0 && <span className="text-border shrink-0">/</span>}
              <span
                className={cn(
                  "truncate",
                  idx === breadcrumb.length - 1
                    ? "text-foreground font-medium"
                    : "hover:text-foreground transition-colors",
                )}
                onClick={item.href ? () => navigate(item.href!) : undefined}
                role={item.href ? "link" : undefined}
                tabIndex={item.href ? 0 : undefined}
                onKeyDown={
                  item.href
                    ? (event) => {
                        if (event.key === "Enter") navigate(item.href!);
                      }
                    : undefined
                }
              >
                {item.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 gap-2 px-2 hover:bg-muted"
              aria-label="User menu"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                {user.name}
              </span>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-52">
            <DropdownMenuLabel className="pb-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground font-normal">
                {user.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2"
              onSelect={() => navigate("/teacher/profile")}
            >
              <User className="h-4 w-4" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onSelect={() => navigate("/teacher/settings")}
            >
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              disabled={logout.isPending}
              onSelect={() =>
                logout.mutate(undefined, {
                  onError: () =>
                    toast.error("Could not log out. Please try again."),
                })
              }
            >
              <LogOut className="h-4 w-4" />{" "}
              {logout.isPending ? "Logging out..." : "Log Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
