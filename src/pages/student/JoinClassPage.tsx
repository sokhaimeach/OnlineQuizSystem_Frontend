import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Home,
  Loader2,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useClassInfo,
  useJoinClass,
  useJoinedClasses,
} from "@/hooks/api/useStudent";
import { getStoredRole } from "@/utils/authRole";
import { getAccessToken } from "@/utils/tokenStorage";

export function JoinClassPage() {
  const { classId = "" } = useParams();
  const navigate = useNavigate();
  const classInfo = useClassInfo(classId);
  const joinedClasses = useJoinedClasses();
  const join = useJoinClass();
  const isStudent = Boolean(getAccessToken() && getStoredRole() === "STUDENT");
  const autoJoinRan = useRef(false);

  const alreadyJoined =
    joinedClasses.data?.some((c) => c.id === classId) ?? false;

  // Redirect unauthenticated users to registration
  const redirectCheckDone = useRef(false);
  useEffect(() => {
    if (
      !isStudent &&
      !classInfo.isLoading &&
      !classInfo.isError &&
      !redirectCheckDone.current
    ) {
      redirectCheckDone.current = true;
      navigate(`/student/register?classId=${encodeURIComponent(classId)}`, {
        replace: true,
      });
    }
  }, [isStudent, classInfo.isLoading, classInfo.isError, classId, navigate]);

  // Auto-join when authenticated and not already joined
  useEffect(() => {
    if (
      isStudent &&
      !classInfo.isLoading &&
      !classInfo.isError &&
      !joinedClasses.isLoading &&
      !alreadyJoined &&
      !autoJoinRan.current
    ) {
      autoJoinRan.current = true;
      join.mutate(classId, {
        onSuccess: () => {
          navigate(`/student/join/${classId}/success`, { replace: true });
        },
      });
    }
  }, [
    isStudent,
    classInfo,
    joinedClasses,
    alreadyJoined,
    classId,
    join,
    navigate,
  ]);

  // Redirect already joined students to success page
  useEffect(() => {
    if (
      isStudent &&
      !classInfo.isLoading &&
      !joinedClasses.isLoading &&
      alreadyJoined &&
      !redirectCheckDone.current
    ) {
      redirectCheckDone.current = true;
      navigate(`/student/join/${classId}/success`, { replace: true });
    }
  }, [isStudent, classInfo, joinedClasses, alreadyJoined, classId, navigate]);

  if (!classId) {
    return (
      <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <GraduationCap className="size-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Invalid invitation link</CardTitle>
            <CardDescription className="text-base">
              This class invitation link is not valid. Please check the link or
              ask your teacher for a new one.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => navigate("/login")}>
              <Home /> Go home
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (!isStudent && !classInfo.isLoading && !classInfo.isError) {
    return null;
  }

  if (classInfo.isLoading || joinedClasses.isLoading || join.isPending) {
    return (
      <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center gap-3 p-8">
            <Loader2 className="animate-spin text-primary" />
            <div>
              <p className="font-semibold">
                {join.isPending
                  ? "Joining class…"
                  : "Loading class information…"}
              </p>
              <p className="text-sm text-muted-foreground">
                {join.isPending
                  ? "Please wait while we add you to the class."
                  : "Please wait a moment."}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (classInfo.isError) {
    return (
      <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <GraduationCap className="size-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Invitation link invalid</CardTitle>
            <CardDescription className="text-base">
              This class invitation link is invalid or has expired. Please ask
              your teacher for a new link.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/student/dashboard")}
            >
              <Home /> Go to dashboard
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const teacherName = classInfo.data?.teacher?.user
    ? [
        classInfo.data.teacher.user.first_name,
        classInfo.data.teacher.user.last_name,
      ]
        .filter(Boolean)
        .join(" ")
    : "Your teacher";

  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
            style={{ backgroundColor: classInfo.data?.color || "#4f46e5" }}
          >
            {classInfo.data?.class_name?.slice(0, 2).toUpperCase() || "CL"}
          </div>
          <CardTitle className="text-xl">
            {classInfo.data?.class_name || "Class"}
          </CardTitle>
          {classInfo.data?.description && (
            <CardDescription className="mt-1 text-sm">
              {classInfo.data.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4 text-center">
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="size-4" />
              Taught by{" "}
              <span className="font-medium text-foreground">{teacherName}</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button
            className="w-full"
            size="lg"
            disabled={join.isPending}
            onClick={() =>
              join.mutate(classId, {
                onSuccess: () => {
                  navigate(`/student/join/${classId}/success`, {
                    replace: true,
                  });
                },
              })
            }
          >
            {join.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2 />
            )}
            {join.isPending ? "Joining class…" : "Join Class"}
          </Button>
          {join.isError && (
            <p className="text-sm text-destructive">
              {join.error instanceof Error
                ? join.error.message
                : "Could not join the class. Please try again."}
            </p>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
