import { useEffect, useState, type FormEvent } from "react";
import { BookOpen, FileQuestion, Settings2, Clock3, Gauge } from "lucide-react";
import { SearchableSelectInput } from "@/components/SearchableSelectInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetSubjectOptions } from "@/hooks/api/useSubject";
import { cn } from "@/lib/utils";
import type { Quiz, UpdateQuizPayload } from "@/models/quiz.interface";

interface EditQuizDialogProps {
  quiz: Quiz | null;
  saving: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: UpdateQuizPayload) => void;
}

function SettingSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-muted/30 p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          checked ? "border-primary bg-primary" : "border-input bg-muted",
        )}
      >
        <span
          className={cn(
            "block size-4 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}

type EditForm = Omit<UpdateQuizPayload, "is_public"> & {
  is_public: boolean;
};

export function EditQuizDialog({
  quiz,
  saving,
  error,
  onOpenChange,
  onSave,
}: EditQuizDialogProps) {
  const { data: subjects = [], isLoading: loadingSubjects } =
    useGetSubjectOptions();
  const [form, setForm] = useState<EditForm | null>(null);

  useEffect(() => {
    if (!quiz) return;
    setForm({
      subject_id: quiz.subject_id,
      title: quiz.title,
      description: quiz.description,
      duration_minutes: quiz.duration_minutes,
      is_public: quiz.is_public,
      status: quiz.status,
      passing_score: quiz.passing_score,
      show_result_immediately: quiz.show_result_immediately,
      show_correct_answers: quiz.show_correct_answers,
      randomize_questions: quiz.randomize_questions,
    });
  }, [quiz]);

  if (!form) return null;

  const setValue = <Key extends keyof EditForm>(
    key: Key,
    value: EditForm[Key],
  ) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (
      !form.title.trim() ||
      form.duration_minutes < 1 ||
      form.passing_score < 0 ||
      form.passing_score > 100
    )
      return;
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      is_public: form.status === "PUBLISHED",
    });
  };

  return (
    <Dialog
      open={Boolean(quiz)}
      onOpenChange={(open) => !saving && onOpenChange(open)}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <form onSubmit={submit} className="grid gap-6">
          <DialogHeader className="pr-6">
            <DialogTitle>Edit quiz</DialogTitle>
            <DialogDescription>
              Update quiz content, scoring, visibility, and student feedback
              settings.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            {/* Quiz Details */}
            <section className="grid content-start gap-5 rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-3 border-b border-border pb-3">
                <div className="rounded-md border border-border bg-muted p-2">
                  <FileQuestion className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Quiz Details</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Set the subject, title, and description.
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Subject</label>
                <SearchableSelectInput
                  options={subjects.map((subject) => ({
                    value: subject.id,
                    label: subject.subject_name,
                  }))}
                  value={form.subject_id ?? undefined}
                  onValueChange={(value) =>
                    setValue("subject_id", value ?? null)
                  }
                  disabled={loadingSubjects || saving}
                  placeholder={
                    loadingSubjects
                      ? "Loading subjects…"
                      : "Search or select a subject"
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Assign this quiz to a subject for organization.
                </p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Quiz title <span className="text-destructive">*</span>
                </label>
                <Input
                  value={form.title}
                  onChange={(event) => setValue("title", event.target.value)}
                  disabled={saving}
                  placeholder="e.g. Chapter 4: Photosynthesis"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(event) =>
                    setValue("description", event.target.value)
                  }
                  disabled={saving}
                  rows={3}
                  className="resize-none"
                  placeholder="Brief overview of the quiz content…"
                />
              </div>
            </section>

            {/* Scoring & Timing */}
            <section className="grid content-start gap-5 rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-3 border-b border-border pb-3">
                <div className="rounded-md border border-border bg-muted p-2">
                  <Settings2 className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">
                    Scoring &amp; Timing
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Configure duration, passing score, and visibility.
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Duration (minutes) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    value={form.duration_minutes}
                    onChange={(event) =>
                      setValue("duration_minutes", Number(event.target.value))
                    }
                    disabled={saving}
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Passing score (%) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Gauge className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={form.passing_score}
                    onChange={(event) =>
                      setValue("passing_score", Number(event.target.value))
                    }
                    disabled={saving}
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setValue("status", value as Quiz["status"])
                  }
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Drafts remain hidden. Published quizzes are available to
                  students.
                </p>
              </div>
            </section>
          </div>

          {/* Feedback Settings */}
          <section className="grid gap-5 rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-3 border-b border-border pb-3">
              <div className="rounded-md border border-border bg-muted p-2">
                <BookOpen className="size-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Feedback Settings</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Control what students see after completing the quiz.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <SettingSwitch
                label="Show results immediately"
                description="Reveal scores after submission."
                checked={form.show_result_immediately}
                onChange={(value) => setValue("show_result_immediately", value)}
              />
              <SettingSwitch
                label="Show correct answers"
                description="Reveal correct options with results."
                checked={form.show_correct_answers}
                onChange={(value) => setValue("show_correct_answers", value)}
              />
              <SettingSwitch
                label="Randomize questions"
                description="Use a different order per attempt."
                checked={form.randomize_questions}
                onChange={(value) => setValue("randomize_questions", value)}
              />
            </div>
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <DialogFooter className="border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                saving || !form.title.trim() || form.duration_minutes < 1
              }
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
