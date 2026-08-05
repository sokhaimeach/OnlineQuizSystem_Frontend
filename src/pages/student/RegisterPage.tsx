import {
  AtSign,
  Check,
  Eye,
  EyeOff,
  ImageIcon,
  KeyRound,
  Loader2,
  Lock,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useState, useRef, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRegisterAsStudent } from "@/hooks/api/useAuth";
import type { RegisterAsStudentPayload } from "@/models/auth.interface";
import {
  getPasswordValidationError,
  PASSWORD_REQUIREMENTS,
} from "@/utils/passwordValidation";

type Step = 0 | 1 | 2 | 3;
const STEP_LABELS = [
  "Authentication",
  "Student Information",
  "Profile Picture",
  "Complete",
];

function getPasswordStrength(pw: string): {
  label: string;
  color: string;
  score: number;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = ["Weak", "Fair", "Good", "Strong", "Very strong"];
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-emerald-500",
  ];
  return {
    label: map[score] || "Weak",
    color: colors[score] || "bg-red-500",
    score,
  };
}

const initial: RegisterAsStudentPayload = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  gender: "OTHER",
  bio: "",
  date_of_birth: "",
  phone_number: "",
  parent_phone_number: "",
  image: null,
};

export function StudentRegisterPage() {
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState(initial);
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const register = useRegisterAsStudent();
  const classId = params.get("classId");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const set = <K extends keyof RegisterAsStudentPayload>(
    key: K,
    value: RegisterAsStudentPayload[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const passwordStrength = getPasswordStrength(form.password);

  function validateStep0(): boolean {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return false;
    }
    const passwordError = getPasswordValidationError(form.password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }
    if (!confirm) {
      setError("Please confirm your password.");
      return false;
    }
    if (form.password !== confirm) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  }

  function validateStep1(): boolean {
    if (!form.first_name.trim()) {
      setError("First name is required.");
      return false;
    }
    if (!form.last_name.trim()) {
      setError("Last name is required.");
      return false;
    }
    if (!form.date_of_birth) {
      setError("Date of birth is required.");
      return false;
    }
    return true;
  }

  function handleFileChange(file: File | null) {
    set("image", file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  function removeImage() {
    set("image", null);
    setPreviewUrl(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (step === 0) {
      if (!validateStep0()) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      try {
        await register.mutateAsync({ ...form, class_id: classId || undefined });
        toast.success(
          classId
            ? "Your account has been created and you have joined the class."
            : "Student account created.",
        );
        if (classId) {
          navigate(`/student/join/${classId}/success`, { replace: true });
        } else {
          navigate("/student/account", { replace: true });
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : typeof err === "object" && err !== null && "message" in err
              ? String((err as { message: unknown }).message)
              : "Registration could not be completed.";
        setError(msg);
        setStep(2);
      }
      return;
    }
  }

  function renderStepIndicator() {
    return (
      <div className="mb-8">
        <ol
          className="flex items-center justify-between"
          role="list"
          aria-label="Registration steps"
        >
          {STEP_LABELS.map((label, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isDone || (isActive && i === 3)
                      ? "bg-primary text-primary-foreground"
                      : isActive
                        ? "border-2 border-primary text-primary"
                        : "border-2 border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {i < 3 ? (
                    isDone ? (
                      <Check className="size-4" />
                    ) : (
                      i + 1
                    )
                  ) : isDone ? (
                    <Check className="size-4" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`hidden text-sm sm:inline ${isActive ? "font-medium text-foreground" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      className=""
      eyebrow="Student registration"
      title="Start learning with QuizClass"
      description={
        step === 0
          ? "Create your account credentials to get started."
          : step === 1
            ? "Tell us a bit about yourself."
            : step === 2
              ? "Add a profile picture (optional)."
              : "Setting up your account…"
      }
    >
      {renderStepIndicator()}
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {step === 0 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="reg-email">
                Email address *
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@school.com"
                  className="h-11 pl-10"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-password">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    className="h-11 pl-10 pr-10"
                    type={showPw ? "text" : "password"}
                    minLength={8}
                    maxLength={100}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex h-1.5 w-full gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 rounded-full transition-colors ${
                            i <= passwordStrength.score
                              ? passwordStrength.color
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Strength:{" "}
                      <span className="font-medium">
                        {passwordStrength.label}
                      </span>
                    </p>
                  </div>
                )}
                {form.password.length > 0 &&
                  getPasswordValidationError(form.password) && (
                    <p className="mt-1 text-xs text-destructive">
                      {getPasswordValidationError(form.password)}
                    </p>
                  )}
                <p className="text-xs text-muted-foreground">
                  {PASSWORD_REQUIREMENTS}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-confirm">
                  Confirm password *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-confirm"
                    className="h-11 pl-10"
                    type={showPw ? "text" : "password"}
                    minLength={8}
                    maxLength={100}
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </div>
                {confirm.length > 0 && form.password !== confirm && (
                  <p className="mt-1 text-xs text-destructive">
                    Passwords do not match.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-first">
                  First name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-first"
                    className="h-11 pl-10"
                    value={form.first_name}
                    onChange={(e) => set("first_name", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-last">
                  Last name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-last"
                    className="h-11 pl-10"
                    value={form.last_name}
                    onChange={(e) => set("last_name", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-gender">
                  Gender
                </label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => set("gender", v)}
                >
                  <SelectTrigger id="reg-gender" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-dob">
                  Date of birth *
                </label>
                <Input
                  id="reg-dob"
                  type="date"
                  className="h-11"
                  value={form.date_of_birth}
                  onChange={(e) => set("date_of_birth", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-phone">
                  Phone number
                </label>
                <Input
                  id="reg-phone"
                  className="h-11"
                  value={form.phone_number}
                  onChange={(e) => set("phone_number", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-parent">
                  Parent phone number
                </label>
                <Input
                  id="reg-parent"
                  className="h-11"
                  value={form.parent_phone_number}
                  onChange={(e) => set("parent_phone_number", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="reg-bio">
                Bio
              </label>
              <Textarea
                id="reg-bio"
                maxLength={300}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="A little about your interests and learning goals"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center">
              <div
                className="mx-auto flex size-28 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 bg-muted/30 transition-colors hover:border-primary/50"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/"))
                    handleFileChange(file);
                }}
                role="button"
                tabIndex={0}
                aria-label="Upload profile picture"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    fileInputRef.current?.click();
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="size-28 rounded-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-8 text-muted-foreground" />
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {previewUrl
                  ? "Click to change your photo"
                  : "Click or drag to upload a photo"}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />

            {previewUrl && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={removeImage}
                >
                  <X className="mr-1 size-4" /> Remove photo
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Supported formats: PNG, JPG, GIF. Max size: 5 MB.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {register.isPending
                ? "Creating your account…"
                : "Joining the class…"}
            </p>
          </div>
        )}

        {error && step < 3 && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        {step < 3 && (
          <div className="flex gap-3">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11"
                onClick={() => {
                  setStep((step - 1) as Step);
                  setError("");
                }}
                disabled={register.isPending}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className={`h-11 ${step > 0 ? "flex-1" : "w-full"}`}
              disabled={register.isPending}
            >
              {step < 2 ? (
                <>
                  Continue <span className="ml-1">→</span>
                </>
              ) : (
                <>
                  <UserPlus className="mr-1 size-4" /> Create account
                </>
              )}
            </Button>
          </div>
        )}
      </form>

      {step === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link
            className="font-medium text-primary hover:underline"
            to={
              classId
                ? `/login?redirect=${encodeURIComponent(`/student/join/${classId}`)}`
                : "/login"
            }
          >
            Sign in
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
