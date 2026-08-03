import { useState, type FormEvent } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LoginPayload } from "@/models/auth.interface";
import { useLogin, useVerify2FALogin } from "@/hooks/api/useAuth";
import { getTemporaryTokenFromAuthPayload, requiresTwoFactor } from "@/utils/authRole";

function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return "Unable to sign in. Please try again.";
  const data = error.response?.data as { message?: string } | undefined;
  return data?.message ?? "The email or password you entered is incorrect.";
}

const Login = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const registered = (location.state as { registered?: boolean } | null)
    ?.registered;
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 2FA step
  const [requires2FA, setRequires2FA] = useState(false);
  const [temporaryToken, setTemporaryToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const requestedRedirect = searchParams.get("redirect");
  const safeRedirect =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : undefined;
  const studentFlow = safeRedirect?.startsWith("/student/") ?? false;
  const sharedClassId = studentFlow
    ? safeRedirect?.split("/").pop()
    : undefined;
  const loginMutation = useLogin(safeRedirect);
  const verifyMutation = useVerify2FALogin(safeRedirect);

  const updateField = (field: keyof LoginPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const data = await loginMutation.mutateAsync(form);
      if (requiresTwoFactor(data)) {
        const token = getTemporaryTokenFromAuthPayload(data);
        if (!token) {
          setError(
            "Two-factor authentication is required but could not be started.",
          );
          return;
        }
        setTemporaryToken(token);
        setVerificationCode("");
        setVerificationError("");
        setRequires2FA(true);
      }
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset2FA = () => {
    setRequires2FA(false);
    setTemporaryToken("");
    setVerificationCode("");
    setVerificationError("");
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(verificationCode)) {
      setVerificationError(
        "Enter the 6-digit code from your authenticator app.",
      );
      return;
    }
    setVerificationError("");
    setIsVerifying(true);
    try {
      await verifyMutation.mutateAsync({
        temporaryToken,
        code: verificationCode,
      });
    } catch (verifyError) {
      const message = axios.isAxiosError(verifyError)
        ? (verifyError.response?.data as { message?: string } | undefined)
            ?.message
        : undefined;
      setVerificationError(message || "Invalid authentication code.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={studentFlow ? "Student portal" : "Teacher portal"}
      title={requires2FA ? "Two-factor authentication" : "Welcome back"}
      description={
        requires2FA
          ? "Open your authenticator app and enter the 6-digit code."
          : studentFlow
            ? "Sign in to continue to the class your teacher shared."
            : "Sign in to manage your classes, quizzes, and student progress."
      }
      className="items-center"
    >
      {requires2FA ? (
        <form className="space-y-5" onSubmit={handleVerify}>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="size-4 text-primary" />
              Enter authentication code
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use Google Authenticator, Microsoft Authenticator, or Authy to
              generate your code.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="verificationCode">
              Authentication code
            </label>
            <Input
              id="verificationCode"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              value={verificationCode}
              onChange={(event) =>
                setVerificationCode(
                  event.target.value.replace(/\D/g, "").slice(0, 6),
                )
              }
              className="h-11 text-center text-lg tracking-[0.35em]"
              required
            />
          </div>

          {verificationError && (
            <p role="alert" className="text-sm text-destructive">
              {verificationError}
            </p>
          )}

          <Button
            className="h-11 w-full"
            type="submit"
            disabled={isVerifying || verificationCode.length !== 6}
          >
            {isVerifying && <LoaderCircle className="animate-spin" />}
            {isVerifying ? "Verifying…" : "Verify"}
          </Button>

          <button
            type="button"
            className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={reset2FA}
          >
            Back to sign in
          </button>
        </form>
      ) : (
        <>
          {registered && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              Your teacher account is ready. You can sign in now.
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="teacher@school.com"
                  className="h-11 pl-10"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-11 px-10"
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button className="h-11 w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="animate-spin" />}
              {isSubmitting
                ? "Signing in…"
                : studentFlow
                  ? "Sign in as student"
                  : "Sign in as teacher"}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            New to QuizClass?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              to={
                sharedClassId
                  ? `/student/register?classId=${encodeURIComponent(sharedClassId)}`
                  : "/register"
              }
            >
              {studentFlow
                ? "Create a student account"
                : "Create a teacher account"}
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default Login;
