import {
  Calendar,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  School,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentAccount } from "@/hooks/api/useUser";

const fallback = {
  first_name: "Keo",
  last_name: "Mealea",
  email: "mealea@student.edu",
  gender: "FEMALE",
  bio: "Curious learner focused on mathematics and technology.",
  avatar_url: null,
  student: {
    student_code: "STU-2026-0142",
    school_name: "Setec Institute",
    date_of_birth: "2005-08-17",
    phone_number: "+855 12 345 678",
    parent_phone_number: "+855 96 765 4321",
  },
};

export function StudentAccountView() {
  const query = useStudentAccount();
  const account = query.data ?? fallback;
  const navigate = useNavigate();
  if (query.isLoading)
    return (
      <div className="space-y-5">
        <Skeleton className="h-56" />
        <Skeleton className="h-72" />
      </div>
    );
  const name = `${account.first_name} ${account.last_name}`.trim();
  const initials = `${account.first_name?.[0] ?? ""}${account.last_name?.[0] ?? ""}`;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Account</h1>
          <p className="text-muted-foreground">
            Your student profile and contact information.
          </p>
        </div>
        <Button onClick={() => navigate("/student/settings")}>
          <Pencil /> Edit profile
        </Button>
      </div>
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500" />
        <CardContent className="-mt-12">
          <Avatar className="size-24 border-4 border-card">
            <AvatarImage src={account.avatar_url ?? undefined} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="mt-3 text-2xl font-bold">{name}</h2>
          <p className="mt-1 text-muted-foreground">
            {account.bio || "No bio provided."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              Student
            </span>
            <span className="rounded-full bg-muted px-3 py-1">
              {account.student?.student_code ?? "Student code unavailable"}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Info icon={Mail} label="Email" value={account.email} />
          <Info
            icon={School}
            label="School"
            value={account.student?.school_name}
          />
          <Info icon={UserRound} label="Gender" value={account.gender} />
          <Info
            icon={Calendar}
            label="Date of birth"
            value={account.student?.date_of_birth}
          />
          <Info
            icon={Phone}
            label="Phone number"
            value={account.student?.phone_number}
          />
          <Info
            icon={ShieldCheck}
            label="Parent phone"
            value={account.student?.parent_phone_number}
          />
          <Info
            icon={GraduationCap}
            label="Student code"
            value={account.student?.student_code}
          />
        </CardContent>
      </Card>
    </div>
  );
}
function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3 rounded-lg border p-3">
      <span className="rounded-md bg-primary/10 p-2 text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}
