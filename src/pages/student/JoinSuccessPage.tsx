import { BookOpen, CheckCircle2, LayoutDashboard } from "lucide-react";
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
import { useClassInfo } from "@/hooks/api/useStudent";

export function JoinSuccessPage() {
  const { classId = "" } = useParams();
  const navigate = useNavigate();
  const classInfo = useClassInfo(classId);

  const teacherName = classInfo.data?.teacher?.user
    ? [
        classInfo.data.teacher.user.first_name,
        classInfo.data.teacher.user.last_name,
      ]
        .filter(Boolean)
        .join(" ")
    : classInfo.data?.teacher?.school_name || "Your teacher";

  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-10 text-emerald-600" />
          </div>
          <CardTitle className="text-xl">
            You have successfully joined the class.
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="mx-auto flex size-14 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: classInfo.data?.color || "#4f46e5" }}
          >
            {classInfo.data?.class_name?.slice(0, 2).toUpperCase() || "CL"}
          </div>
          <div>
            <p className="text-lg font-semibold">
              {classInfo.data?.class_name || "Class"}
            </p>
            {classInfo.data?.description && (
              <CardDescription className="mt-1">
                {classInfo.data.description}
              </CardDescription>
            )}
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="size-4" />
              Taught by{" "}
              <span className="font-medium text-foreground">{teacherName}</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate("/student/dashboard", { replace: true })}
          >
            <LayoutDashboard /> Go to Student Dashboard
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
