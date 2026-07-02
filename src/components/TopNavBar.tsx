import { useState } from 'react'
import {
  Bell, Search, Sun, Moon, ChevronDown,
  User, Settings, LogOut, HelpCircle, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/StatusBadge'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

const notifications = [
  {
    id: 1,
    title: 'New submission received',
    description: 'Alex Johnson submitted "Chapter 5 Quiz"',
    time: '2 min ago',
    unread: true,
    variant: 'primary' as const,
  },
  {
    id: 2,
    title: 'Assignment deadline tomorrow',
    description: '"Algebra Quiz" for Class 10-B is due tomorrow',
    time: '1 hr ago',
    unread: true,
    variant: 'warning' as const,
  },
  {
    id: 3,
    title: 'Quiz published successfully',
    description: '"Physics: Motion" quiz is now live',
    time: '3 hrs ago',
    unread: false,
    variant: 'success' as const,
  },
  {
    id: 4,
    title: 'Overdue: 3 submissions missing',
    description: '"History Quiz" has 3 overdue students',
    time: 'Yesterday',
    unread: false,
    variant: 'danger' as const,
  },
]

interface TopNavBarProps {
  breadcrumb: { label: string; href?: string }[]
}

export function TopNavBar({ breadcrumb }: TopNavBarProps) {
  const { theme, toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-40 flex h-17.5 shrink-0 items-center gap-2 bg-card backdrop-blur-sm border-b border-border px-4 transition-all">
      {/* Left: Trigger + Breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1 h-8 w-8 shrink-0" />
        <Separator orientation="vertical" className="data-[orientation=vertical]:h-4 mr-1 shrink-0" />
        <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground min-w-0">
          {breadcrumb.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1 min-w-0">
              {idx > 0 && <span className="text-border shrink-0">/</span>}
              <span
                className={cn(
                  'truncate',
                  idx === breadcrumb.length - 1
                    ? 'text-foreground font-medium'
                    : 'hover:text-foreground cursor-pointer transition-colors'
                )}
              >
                {item.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div className={cn('relative transition-all duration-200', searchOpen ? 'w-52 sm:w-64' : 'w-8')}>
          {searchOpen ? (
            <div className="flex items-center gap-1">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  autoFocus
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Search classes, quizzes…"
                  className="pl-8 h-8 text-sm bg-muted border-0 focus-visible:ring-1"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => { setSearchOpen(false); setSearchValue('') }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-auto py-0.5 px-2 text-xs text-primary">
                  Mark all read
                </Button>
              )}
            </div>
            <div className="divide-y divide-border">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={cn(
                    'flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors',
                    n.unread && 'bg-primary/5'
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    <span className={cn(
                      'block h-2 w-2 rounded-full mt-1.5',
                      n.unread ? 'bg-primary' : 'bg-transparent'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-muted-foreground">{n.time}</span>
                      <StatusBadge variant={n.variant} className="text-[10px] py-0 px-1.5">{
                        n.variant === 'primary' ? 'New' :
                        n.variant === 'warning' ? 'Due Soon' :
                        n.variant === 'success' ? 'Published' : 'Overdue'
                      }</StatusBadge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-border">
              <Button variant="ghost" className="w-full text-xs h-7 text-primary">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 gap-2 px-2 hover:bg-muted"
              aria-label="User menu"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src="/avatars/teacher.jpg" alt="Teacher" />
                <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium max-w-24 truncate">Jane Doe</span>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-52">
            <DropdownMenuLabel className="pb-1">
              <p className="font-semibold">Jane Doe</p>
              <p className="text-xs text-muted-foreground font-normal">jane.doe@school.edu</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <HelpCircle className="h-4 w-4" /> Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
