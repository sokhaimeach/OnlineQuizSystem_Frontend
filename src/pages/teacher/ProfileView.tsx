import {
  Building2,
  Calendar,
  Edit,
  Mail,
  UserCircle,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { ProfileForm } from "@/components/teacher/account/ProfileForm";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/api/useUser";

export function ProfileView() {
  const navigate = useNavigate();
  const accountQuery = useUser();
  const account = accountQuery.data;

  if (accountQuery.isLoading) {
    return <ProfileSkeleton />;
  }

  if (accountQuery.isError || !account) {
    return (
      <div className="mx-auto max-w-3xl rounded-md border border-destructive/30 bg-card p-6 text-center">
        <p className="text-sm text-destructive">
          Your profile could not be loaded.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => void accountQuery.refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  const fullName =
    [account.first_name, account.last_name].filter(Boolean).join(" ") || "—";
  const initials =
    `${account.first_name?.[0] ?? ""}${account.last_name?.[0] ?? ""}`.toUpperCase() ||
    "?";
  const joinedDate = account.createdAt
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        year: "numeric",
      }).format(new Date(account.createdAt))
    : "—";
  const stats = [
    { label: "Classes Taught", value: account.stats?.classes_taught ?? 0 },
    { label: "Total Students", value: account.stats?.total_students ?? 0 },
    { label: "Quizzes Created", value: account.stats?.quizzes_created ?? 0 },
  ];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        title="My Profile"
        description="View and quickly update your teacher profile"
        icon={UserCircle}
        action={{
          label: "Edit Profile",
          icon: Edit,
          onClick: () => navigate("/teacher/settings"),
        }}
      />

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="relative h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <Avatar className="h-20 w-20 ring-4 ring-card">
              <AvatarImage
                src={account.avatar_url ?? undefined}
                alt={fullName}
              />
              <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <StatusBadge
              variant={account.status === "ACTIVE" ? "success" : "muted"}
              dot
            >
              {account.status} · {account.role}
            </StatusBadge>
          </div>

          <h2 className="text-xl font-bold">{fullName}</h2>
          <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
            {account.bio || "No bio provided"}
          </p>

          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <Info icon={Mail} label="Email" value={account.email || "—"} />
            <Info
              icon={Users}
              label="Gender"
              value={formatGender(account.gender)}
            />
            <Info
              icon={Building2}
              label="School"
              value={account.teacher?.school_name || "—"}
            />
            <Info icon={Calendar} label="Joined" value={joinedDate} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4 border-y border-border py-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Quick Edit</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your avatar, bio, and basic profile information.
          </p>
        </CardHeader>
        <CardContent>
          <ProfileForm account={account} />
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
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted/60 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  );
}

function formatGender(gender: string) {
  return gender.charAt(0) + gender.slice(1).toLowerCase();
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
