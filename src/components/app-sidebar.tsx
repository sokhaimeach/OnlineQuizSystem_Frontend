import * as React from "react";
import {
  LayoutDashboard,
  School,
  BookOpen,
  PlusCircle,
  BarChart3,
  ChevronRight,
  GraduationCap,
  Edit3,
  ListMinus,
  Loader2,
  MoreHorizontal,
  Plus,
  QrCode,
  Share2,
  Trash2,
  FileBarChart2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavUser } from "@/components/nav-user";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useCreateClass,
  useDeleteClass,
  useGetRecentClasses,
  useUpdateClass,
} from "@/hooks/api/useClass";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCreateSubject,
  useDeleteSubject,
  useGetAllSubjects,
  useUpdateSubject,
} from "@/hooks/api/useSubject";
import type { Subject } from "@/models/subject.interface";
import type { Class, CreateClassPayload } from "@/models/class.interface";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubjectFormDialog } from "@/components/teacher/SubjectFormDialog";
import { ClassDialog } from "@/components/teacher/ClassDialog";
import { ClassShareDialog } from "@/components/teacher/ClassShareDialog";
import { DeleteClassDialog } from "@/components/teacher/DeleteClassDialog";
import { useUser } from "@/hooks/api/useUser";

export type DashboardSection =
  | "dashboard"
  | "classes"
  | "class-detail"
  | "subjects"
  | "subject-detail"
  | "create-quiz"
  | "question-bank"
  | "analytics"
  | "reports"
  | "student-performance"
  | "student-report"
  | "subject-analysis"
  | "subject-report"
  | "class-report"
  | "improvement"
  | "at-risk"
  | "profile"
  | "settings";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
}

function NavItem({
  icon: Icon,
  label,
  section,
  activeSection,
  onNavigate,
}: {
  icon: React.ElementType;
  label: string;
  section: DashboardSection;
  activeSection: DashboardSection;
  onNavigate: (s: DashboardSection) => void;
}) {
  const isActive = activeSection === section;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={label}
        onClick={() => onNavigate(section)}
        className={cn(
          "relative cursor-pointer transition-colors",
          isActive &&
            "text-primary font-medium bg-primary/10 hover:bg-primary/15",
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary" />
        )}
        <Icon
          className={cn(
            "h-4 w-4",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function CollapsibleNav({
  icon: Icon,
  label,
  children,
  defaultOpen = false,
  relatedSections,
  activeSection,
  headerAction,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  relatedSections: DashboardSection[];
  activeSection: DashboardSection;
  headerAction?: React.ReactNode;
}) {
  const isRelatedActive = relatedSections.includes(activeSection);
  return (
    <SidebarMenuItem>
      <Collapsible
        defaultOpen={defaultOpen || isRelatedActive}
        className="group/collapsible"
      >
        <div className="relative">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={label}
              className={cn(
                "cursor-pointer pr-8 transition-colors",
                isRelatedActive && "text-primary font-medium",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isRelatedActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span>{label}</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {headerAction && (
            <div className="absolute right-7 top-1/2 z-10 -translate-y-1/2">
              {headerAction}
            </div>
          )}
        </div>
        <CollapsibleContent>
          <SidebarMenuSub>{children}</SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function SubNavItem({
  label,
  section,
  activeSection,
  onNavigate,
}: {
  label: string;
  section: DashboardSection;
  activeSection: DashboardSection;
  onNavigate: (s: DashboardSection) => void;
}) {
  const isActive = activeSection === section;
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={isActive}
        onClick={() => onNavigate(section)}
        className={cn(
          "cursor-pointer transition-colors",
          isActive && "text-primary font-medium bg-primary/10",
        )}
      >
        <span>{label}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function AppSidebar({
  activeSection,
  onNavigate,
  ...props
}: AppSidebarProps) {
  const navigate = useNavigate();
  const account = useUser().data;
  const user = {
    name:
      [account?.first_name, account?.last_name].filter(Boolean).join(" ") ||
      "Teacher",
    email: account?.email || "",
    avatar: account?.avatar_url || "",
  };
  const location = useLocation();
  const recentClassesQuery = useGetRecentClasses();
  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();
  const deleteClassMutation = useDeleteClass();
  const subjectsQuery = useGetAllSubjects();
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();
  const [subjectDialogOpen, setSubjectDialogOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(
    null,
  );
  const [deletingSubject, setDeletingSubject] = React.useState<Subject | null>(
    null,
  );
  const [subjectError, setSubjectError] = React.useState("");
  const [classDialogOpen, setClassDialogOpen] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<Class | null>(null);
  const [deletingClass, setDeletingClass] = React.useState<Class | null>(null);
  const [sharingClass, setSharingClass] = React.useState<Class | null>(null);
  const [classError, setClassError] = React.useState("");

  const subjects =
    subjectsQuery.data?.pages.flatMap((page) => page.data.subjects) ?? [];
  const recentClasses = recentClassesQuery.data?.slice(0, 5) ?? [];
  const unassignedQuizCount =
    subjectsQuery.data?.pages[0]?.data.unassigned_quiz_count ?? 0;
  const selectedClassId = location.pathname.match(
    /^\/teacher\/classes\/([^/]+)$/,
  )?.[1];
  const selectedSubjectId = location.pathname.match(
    /^\/teacher\/subjects\/([^/]+)$/,
  )?.[1];
  const isSavingClass =
    createClassMutation.isPending || updateClassMutation.isPending;
  const isSavingSubject =
    createSubjectMutation.isPending || updateSubjectMutation.isPending;

  const openClass = (classId: string) => {
    navigate(`/teacher/classes/${classId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSubject = (subjectId: string) => {
    navigate(`/teacher/subjects/${subjectId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCreateClass = () => {
    createClassMutation.reset();
    updateClassMutation.reset();
    setEditingClass(null);
    setClassError("");
    setClassDialogOpen(true);
  };

  const openEditClass = (classItem: Class) => {
    createClassMutation.reset();
    updateClassMutation.reset();
    setEditingClass(classItem);
    setClassError("");
    setClassDialogOpen(true);
  };

  const openDeleteClass = (classItem: Class) => {
    deleteClassMutation.reset();
    setDeletingClass(classItem);
  };

  const submitClass = (payload: CreateClassPayload) => {
    const options = {
      onSuccess: () => {
        setClassDialogOpen(false);
        setEditingClass(null);
        setClassError("");
      },
      onError: () =>
        setClassError("The class could not be saved. Please try again."),
    };

    if (editingClass) {
      updateClassMutation.mutate(
        { classId: editingClass.id, payload },
        options,
      );
    } else {
      createClassMutation.mutate(payload, options);
    }
  };

  const confirmDeleteClass = () => {
    if (!deletingClass) return;
    const classId = deletingClass.id;
    deleteClassMutation.mutate(classId, {
      onSuccess: () => {
        setDeletingClass(null);
        if (selectedClassId === classId) navigate("/teacher/classes");
      },
    });
  };

  const openCreateSubject = () => {
    setEditingSubject(null);
    setSubjectError("");
    setSubjectDialogOpen(true);
  };

  const openEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectError("");
    setSubjectDialogOpen(true);
  };

  const openDeleteSubject = (subject: Subject) => {
    deleteSubjectMutation.reset();
    setDeletingSubject(subject);
  };

  const submitSubject = (payload: {
    subject_name: string;
    description?: string;
  }) => {
    const options = {
      onSuccess: () => {
        setSubjectDialogOpen(false);
        setEditingSubject(null);
        setSubjectError("");
      },
      onError: () =>
        setSubjectError("The subject could not be saved. Please try again."),
    };

    if (editingSubject) {
      updateSubjectMutation.mutate(
        { subjectId: editingSubject.id, payload },
        options,
      );
    } else {
      createSubjectMutation.mutate(payload, options);
    }
  };

  const confirmDeleteSubject = () => {
    if (!deletingSubject) return;
    const subjectId = deletingSubject.id;
    deleteSubjectMutation.mutate(subjectId, {
      onSuccess: () => {
        setDeletingSubject(null);
        if (selectedSubjectId === subjectId)
          navigate("/teacher/subjects/unassigned");
      },
    });
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header — Branded Logo */}
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-default hover:bg-transparent active:bg-transparent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-bold text-sm tracking-tight">
                  QuizFlow
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Teacher Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 px-3 py-1.5">
            Overview
          </SidebarGroupLabel>
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
              relatedSections={["classes", "class-detail"]}
              activeSection={activeSection}
              headerAction={
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  onClick={openCreateClass}
                  aria-label="Create class"
                  title="Create class"
                  className="me-5"
                >
                  <Plus />
                </Button>
              }
            >
              {recentClassesQuery.isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuSubItem key={index}>
                    <Skeleton className="my-1 h-6 w-full" />
                  </SidebarMenuSubItem>
                ))
              ) : recentClassesQuery.isError ? (
                <SidebarMenuSubItem>
                  <p className="px-2 py-1 text-xs text-destructive">
                    Could not load classes.
                  </p>
                </SidebarMenuSubItem>
              ) : (
                recentClasses.map((classItem) => (
                  <SidebarMenuSubItem
                    key={classItem.id}
                    className="group/class flex min-w-0 items-center"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuSubButton
                          isActive={selectedClassId === classItem.id}
                          onClick={() => openClass(classItem.id)}
                          className="min-w-0 flex-1 cursor-pointer pr-1"
                        >
                          <span
                            className="size-2 shrink-0 rounded-full bg-primary"
                            style={
                              classItem.color
                                ? { backgroundColor: classItem.color }
                                : undefined
                            }
                          />
                          <span className="flex-1 truncate">
                            {classItem.class_name}
                          </span>
                          <span className="text-[10px] tabular-nums text-muted-foreground">
                            {classItem.total_student}
                          </span>
                        </SidebarMenuSubButton>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        sideOffset={8}
                        className="block max-w-64"
                      >
                        <p className="font-medium">{classItem.class_name}</p>
                        <p className="mt-1 text-background/80">
                          {classItem.description?.trim() ||
                            "No description provided"}
                        </p>
                        <p className="mt-1">
                          {classItem.total_student}{" "}
                          {classItem.total_student === 1
                            ? "student"
                            : "students"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="ml-0.5 opacity-100 sm:opacity-0 sm:group-hover/class:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                          aria-label={`Actions for ${classItem.class_name}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem
                          onSelect={() => {
                            const url = `${window.location.origin}/student/join/${classItem.id}`;
                            void navigator.clipboard
                              .writeText(url)
                              .then(() =>
                                toast.success("Class join link copied."),
                              );
                          }}
                        >
                          <Share2 /> Copy Join Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => setSharingClass(classItem)}
                        >
                          <QrCode /> Show QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => openEditClass(classItem)}
                        >
                          <Edit3 /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => openDeleteClass(classItem)}
                        >
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuSubItem>
                ))
              )}
              <SubNavItem
                label="View All Classes"
                section="classes"
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
            </CollapsibleNav>

            <CollapsibleNav
              icon={BookOpen}
              label="Subjects"
              relatedSections={["subjects", "subject-detail"]}
              activeSection={activeSection}
              headerAction={
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  onClick={openCreateSubject}
                  aria-label="Create subject"
                  title="Create subject"
                  className="me-5"
                >
                  <Plus />
                </Button>
              }
            >
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  isActive={selectedSubjectId === "unassigned"}
                  onClick={() => openSubject("unassigned")}
                  className="cursor-pointer"
                >
                  <ListMinus />
                  <span className="flex-1">Unassigned Quiz</span>
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {unassignedQuizCount}
                  </span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {subjectsQuery.isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuSubItem key={index}>
                    <Skeleton className="my-1 h-6 w-full" />
                  </SidebarMenuSubItem>
                ))
              ) : subjectsQuery.isError ? (
                <SidebarMenuSubItem>
                  <p className="px-2 py-1 text-xs text-destructive">
                    Could not load subjects.
                  </p>
                </SidebarMenuSubItem>
              ) : (
                subjects.map((subject) => (
                  <SidebarMenuSubItem
                    key={subject.id}
                    className="group/subject flex min-w-0 items-center"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuSubButton
                          isActive={selectedSubjectId === subject.id}
                          onClick={() => openSubject(subject.id)}
                          className="min-w-0 flex-1 cursor-pointer pr-1"
                        >
                          <span className="flex-1 truncate">
                            {subject.subject_name}
                          </span>
                          <span className="text-[10px] tabular-nums text-muted-foreground">
                            {subject.quiz_count}
                          </span>
                        </SidebarMenuSubButton>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        sideOffset={8}
                        className="block max-w-64"
                      >
                        <p className="font-medium">{subject.subject_name}</p>
                        <p className="mt-1 text-background/80">
                          {subject.description?.trim() ||
                            "No description provided"}
                        </p>
                        <p className="mt-1">
                          {subject.quiz_count}{" "}
                          {subject.quiz_count === 1 ? "quiz" : "quizzes"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="ml-0.5 opacity-100 sm:opacity-0 sm:group-hover/subject:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                          aria-label={`Actions for ${subject.subject_name}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem
                          onSelect={() => openEditSubject(subject)}
                        >
                          <Edit3 /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => openDeleteSubject(subject)}
                        >
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuSubItem>
                ))
              )}

              {subjectsQuery.hasNextPage && (
                <SidebarMenuSubItem>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="mt-1 w-full justify-center"
                    disabled={subjectsQuery.isFetchingNextPage}
                    onClick={() => void subjectsQuery.fetchNextPage()}
                  >
                    {subjectsQuery.isFetchingNextPage && (
                      <Loader2 className="animate-spin" />
                    )}
                    {subjectsQuery.isFetchingNextPage
                      ? "Loading…"
                      : "View More"}
                  </Button>
                </SidebarMenuSubItem>
              )}
            </CollapsibleNav>
          </SidebarMenu>
        </SidebarGroup>

        {/* Content */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 px-3 py-1.5">
            Content
          </SidebarGroupLabel>
          <SidebarMenu>
            <NavItem
              icon={PlusCircle}
              label="Create Quiz"
              section="create-quiz"
              activeSection={activeSection}
              onNavigate={onNavigate}
            />
            {/* <NavItem icon={Library} label="Question Bank" section="question-bank" activeSection={activeSection} onNavigate={onNavigate} /> */}
          </SidebarMenu>
        </SidebarGroup>

        {/* Analytics */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 px-3 py-1.5">
            Insights
          </SidebarGroupLabel>
          <SidebarMenu>
            <NavItem
              icon={BarChart3}
              label="Analytics"
              section="analytics"
              activeSection={activeSection}
              onNavigate={onNavigate}
            />
            <CollapsibleNav
              icon={FileBarChart2}
              label="Reports"
              defaultOpen
              relatedSections={[
                "reports",
                "student-performance",
                "student-report",
                "subject-analysis",
                "subject-report",
                "class-report",
                "improvement",
                "at-risk",
              ]}
              activeSection={activeSection}
            >
              <SubNavItem
                label="Overview"
                section="reports"
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
              <SubNavItem
                label="Student Performance"
                section="student-performance"
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
              <SubNavItem
                label="Subject Analysis"
                section="subject-analysis"
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
              <SubNavItem
                label="Class Report"
                section="class-report"
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
              <SubNavItem
                label="Improvement"
                section="improvement"
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
              <SubNavItem
                label="At-Risk Students"
                section="at-risk"
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
            </CollapsibleNav>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — Profile */}
      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />

      <ClassDialog
        open={classDialogOpen}
        classItem={editingClass}
        isSubmitting={isSavingClass}
        error={classError}
        onOpenChange={(open) => {
          if (!isSavingClass) setClassDialogOpen(open);
        }}
        onSubmit={submitClass}
      />

      <DeleteClassDialog
        classItem={deletingClass}
        isDeleting={deleteClassMutation.isPending}
        error={
          deleteClassMutation.isError
            ? "The class could not be deleted. Please try again."
            : undefined
        }
        onOpenChange={(open) => {
          if (!open && !deleteClassMutation.isPending) setDeletingClass(null);
        }}
        onConfirm={confirmDeleteClass}
      />

      <ClassShareDialog
        classItem={sharingClass}
        onClose={() => setSharingClass(null)}
      />

      <SubjectFormDialog
        open={subjectDialogOpen}
        subject={editingSubject}
        isSubmitting={isSavingSubject}
        error={subjectError}
        onOpenChange={(open) => {
          if (!isSavingSubject) setSubjectDialogOpen(open);
        }}
        onSubmit={submitSubject}
      />

      <Dialog
        open={Boolean(deletingSubject)}
        onOpenChange={(open) => !open && setDeletingSubject(null)}
      >
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Delete subject?</DialogTitle>
            <DialogDescription>
              “{deletingSubject?.subject_name}” will be removed. Its quizzes
              will become unassigned.
            </DialogDescription>
          </DialogHeader>
          {deleteSubjectMutation.isError && (
            <p className="text-xs text-destructive">
              The subject could not be deleted. Please try again.
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleteSubjectMutation.isPending}
              onClick={() => setDeletingSubject(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteSubjectMutation.isPending}
              onClick={confirmDeleteSubject}
            >
              {deleteSubjectMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
