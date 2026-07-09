import { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  ArrowRight,
  FileQuestion,
  BarChart3,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DashboardSection } from "@/components/app-sidebar";

const allSubjects = [
  {
    id: 1,
    name: "Mathematics",
    classes: 3,
    quizzes: 8,
    avgScore: 79,
    color: "bg-indigo-500",
    initials: "MA",
    trend: +3,
  },
  {
    id: 2,
    name: "Physics",
    classes: 2,
    quizzes: 6,
    avgScore: 85,
    color: "bg-violet-500",
    initials: "PH",
    trend: +5,
  },
  {
    id: 3,
    name: "Chemistry",
    classes: 1,
    quizzes: 4,
    avgScore: 91,
    color: "bg-emerald-500",
    initials: "CH",
    trend: +2,
  },
  {
    id: 4,
    name: "Biology",
    classes: 2,
    quizzes: 5,
    avgScore: 74,
    color: "bg-cyan-500",
    initials: "BI",
    trend: -1,
  },
  {
    id: 5,
    name: "History",
    classes: 2,
    quizzes: 3,
    avgScore: 76,
    color: "bg-amber-500",
    initials: "HI",
    trend: 0,
  },
  {
    id: 6,
    name: "Science",
    classes: 1,
    quizzes: 7,
    avgScore: 84,
    color: "bg-rose-500",
    initials: "SC",
    trend: +4,
  },
];

interface SubjectsViewProps {
  onNavigate: (section: DashboardSection) => void;
}

export function SubjectsView({ onNavigate }: SubjectsViewProps) {
  const [search, setSearch] = useState("");

  const filtered = allSubjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Subjects"
        description={`${allSubjects.length} subjects total`}
        icon={BookOpen}
        action={{ label: "New Subject", icon: Plus, onClick: () => {} }}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="bg-card rounded-md border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <div className={`h-2 ${sub.color}`} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`h-10 w-10 rounded-lg ${sub.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                >
                  {sub.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {sub.classes} classes
                  </p>
                </div>
                <div
                  className={`text-xs font-medium flex items-center gap-0.5 ${sub.trend > 0 ? "text-emerald-600 dark:text-emerald-400" : sub.trend < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                >
                  {sub.trend > 0 ? "↑" : sub.trend < 0 ? "↓" : "–"}
                  {sub.trend !== 0 && `${Math.abs(sub.trend)}%`}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-border mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-muted">
                    <FileQuestion className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {sub.quizzes}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Quizzes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-muted">
                    <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {sub.avgScore}%
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Avg Score
                    </p>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onNavigate("subject-detail")}
                className="w-full gap-1 text-xs text-primary hover:text-primary justify-between"
              >
                View Subject <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
