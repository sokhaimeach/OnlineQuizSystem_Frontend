import * as React from 'react'
import {
  LayoutDashboard, School, BookOpen, PlusCircle, Library,
  ClipboardList, BarChart3, UserCircle,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { NavUser } from '@/components/nav-user'
import { cn } from '@/lib/utils'

export type DashboardSection =
  | 'dashboard'
  | 'classes'
  | 'class-detail'
  | 'subjects'
  | 'subject-detail'
  | 'create-quiz'
  | 'question-bank'
  | 'assignments-active'
  | 'assignments-scheduled'
  | 'assignments-completed'
  | 'analytics'
  | 'profile'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection: DashboardSection
  onNavigate: (section: DashboardSection) => void
}

const user = {
  name: 'Jane Doe',
  email: 'jane.doe@school.edu',
  avatar: '/avatars/teacher.jpg',
}

function NavItem({
  icon: Icon,
  label,
  section,
  activeSection,
  onNavigate,
}: {
  icon: React.ElementType
  label: string
  section: DashboardSection
  activeSection: DashboardSection
  onNavigate: (s: DashboardSection) => void
}) {
  const isActive = activeSection === section
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={label}
        onClick={() => onNavigate(section)}
        className={cn(
          'relative cursor-pointer transition-colors',
          isActive && 'text-primary font-medium bg-primary/10 hover:bg-primary/15',
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary" />
        )}
        <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function CollapsibleNav({
  icon: Icon,
  label,
  children,
  defaultOpen = false,
  relatedSections,
  activeSection,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
  relatedSections: DashboardSection[]
  activeSection: DashboardSection
}) {
  const isRelatedActive = relatedSections.includes(activeSection)
  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen={defaultOpen || isRelatedActive} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={label}
            className={cn(
              'cursor-pointer transition-colors',
              isRelatedActive && 'text-primary font-medium',
            )}
          >
            <Icon className={cn('h-4 w-4', isRelatedActive ? 'text-primary' : 'text-muted-foreground')} />
            <span>{label}</span>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>{children}</SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

function SubNavItem({
  label,
  section,
  activeSection,
  onNavigate,
}: {
  label: string
  section: DashboardSection
  activeSection: DashboardSection
  onNavigate: (s: DashboardSection) => void
}) {
  const isActive = activeSection === section
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={isActive}
        onClick={() => onNavigate(section)}
        className={cn(
          'cursor-pointer transition-colors',
          isActive && 'text-primary font-medium bg-primary/10',
        )}
      >
        <span>{label}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

export function AppSidebar({ activeSection, onNavigate, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header — Branded Logo */}
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-default hover:bg-transparent active:bg-transparent">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-bold text-sm tracking-tight">QuizFlow</span>
                <span className="truncate text-xs text-muted-foreground">Teacher Portal</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarMenu>
            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              section="dashboard"
              activeSection={activeSection}
              onNavigate={onNavigate}
            />
          </SidebarMenu>
        </SidebarGroup>

        {/* Teaching */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 px-3 py-1.5">
            Teaching
          </SidebarGroupLabel>
          <SidebarMenu>
            <CollapsibleNav
              icon={School}
              label="Classes"
              defaultOpen
              relatedSections={['classes', 'class-detail']}
              activeSection={activeSection}
            >
              <SubNavItem label="Class 10-A · Science" section="class-detail" activeSection={activeSection} onNavigate={onNavigate} />
              <SubNavItem label="Class 9-B · Math" section="class-detail" activeSection={activeSection} onNavigate={onNavigate} />
              <SubNavItem label="View All Classes" section="classes" activeSection={activeSection} onNavigate={onNavigate} />
            </CollapsibleNav>

            <CollapsibleNav
              icon={BookOpen}
              label="Subjects"
              relatedSections={['subjects', 'subject-detail']}
              activeSection={activeSection}
            >
              <SubNavItem label="Mathematics" section="subject-detail" activeSection={activeSection} onNavigate={onNavigate} />
              <SubNavItem label="Physics" section="subject-detail" activeSection={activeSection} onNavigate={onNavigate} />
              <SubNavItem label="View All Subjects" section="subjects" activeSection={activeSection} onNavigate={onNavigate} />
            </CollapsibleNav>
          </SidebarMenu>
        </SidebarGroup>

        {/* Content */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 px-3 py-1.5">
            Content
          </SidebarGroupLabel>
          <SidebarMenu>
            <NavItem icon={PlusCircle} label="Create Quiz" section="create-quiz" activeSection={activeSection} onNavigate={onNavigate} />
            <NavItem icon={Library} label="Question Bank" section="question-bank" activeSection={activeSection} onNavigate={onNavigate} />
          </SidebarMenu>
        </SidebarGroup>

        {/* Assignments */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 px-3 py-1.5">
            Assignments
          </SidebarGroupLabel>
          <SidebarMenu>
            <CollapsibleNav
              icon={ClipboardList}
              label="Assignments"
              defaultOpen
              relatedSections={['assignments-active', 'assignments-scheduled', 'assignments-completed']}
              activeSection={activeSection}
            >
              <SubNavItem label="Active" section="assignments-active" activeSection={activeSection} onNavigate={onNavigate} />
              <SubNavItem label="Scheduled" section="assignments-scheduled" activeSection={activeSection} onNavigate={onNavigate} />
              <SubNavItem label="Completed" section="assignments-completed" activeSection={activeSection} onNavigate={onNavigate} />
            </CollapsibleNav>
          </SidebarMenu>
        </SidebarGroup>

        {/* Analytics */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 px-3 py-1.5">
            Insights
          </SidebarGroupLabel>
          <SidebarMenu>
            <NavItem icon={BarChart3} label="Analytics" section="analytics" activeSection={activeSection} onNavigate={onNavigate} />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — Profile */}
      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="My Profile"
              onClick={() => onNavigate('profile')}
              className={cn(
                'cursor-pointer transition-colors',
                activeSection === 'profile' && 'text-primary font-medium bg-primary/10',
              )}
            >
              <UserCircle className={cn('h-4 w-4', activeSection === 'profile' ? 'text-primary' : 'text-muted-foreground')} />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
