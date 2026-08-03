import { useEffect, useState, type FormEvent } from "react";
import { Check, Copy, KeyRound, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTwoFactorDisable, useTwoFactorEnable, useTwoFactorSetup } from "@/hooks/api/useTwoFactor";
import type { TwoFactorSetupResult } from "@/models/auth.interface";

function errorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const data = (
      error as {
        response?: { data?: { message?: string } };
      }
    ).response?.data;
    return data?.message || fallback;
  }
  return fallback;
}

export function TwoFactorSecurityCard({ enabled }: { enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [step, setStep] = useState<"idle" | "setup">("idle");
  const [setupData, setSetupData] = useState<TwoFactorSetupResult | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [copied, setCopied] = useState(false);

  const [showDisable, setShowDisable] = useState(false);
  const [password, setPassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [formError, setFormError] = useState("");

  const setup = useTwoFactorSetup();
  const enable = useTwoFactorEnable();
  const disable = useTwoFactorDisable();

  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  const startSetup = () => {
    setCode("");
    setCodeError("");
    setup.mutate(undefined, {
      onSuccess: (body) => {
        setSetupData(body.data);
        setStep("setup");
      },
      onError: (error) =>
        toast.error(errorMessage(error, "Could not start setup. Please try again.")),
    });
  };

  const cancelSetup = () => {
    setStep("idle");
    setSetupData(null);
    setCode("");
    setCodeError("");
  };

  const handleEnable = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setCodeError("Enter the 6-digit code shown in your authenticator app.");
      return;
    }
    setCodeError("");
    enable.mutate(code, {
      onSuccess: () => {
        toast.success("Two-factor authentication enabled.");
        setIsEnabled(true);
        setStep("idle");
        setSetupData(null);
        setCode("");
      },
      onError: (error) =>
        setCodeError(errorMessage(error, "Invalid authentication code.")),
    });
  };

  const handleDisable = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      setFormError("Enter your password to confirm.");
      return;
    }
    if (!/^\d{6}$/.test(disableCode)) {
      setFormError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setFormError("");
    disable.mutate(
      { password, code: disableCode },
      {
        onSuccess: () => {
          toast.success("Two-factor authentication disabled.");
          setIsEnabled(false);
          setShowDisable(false);
          setPassword("");
          setDisableCode("");
        },
        onError: (error) =>
          setFormError(
            errorMessage(error, "Could not disable two-factor authentication."),
          ),
      },
    );
  };

  const copyManualKey = async () => {
    if (!setupData) return;
    try {
      await navigator.clipboard.writeText(setupData.manualEntryKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the setup key.");
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="size-4" /> Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security with a time-based code from your
          authenticator app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={
                isEnabled
                  ? "rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400"
                  : "rounded-md bg-muted p-2 text-muted-foreground"
              }
            >
              {isEnabled ? (
                <ShieldCheck className="size-5" />
              ) : (
                <ShieldX className="size-5" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {isEnabled ? "Enabled" : "Disabled"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isEnabled
                  ? "You are protected by a verification code at sign in."
                  : "Add a verification code to keep your account safer."}
              </p>
            </div>
          </div>

          {!isEnabled && step === "idle" && (
            <Button
              onClick={startSetup}
              disabled={setup.isPending}
              className="shrink-0"
            >
              {setup.isPending && <Loader2 className="animate-spin" />}
              {setup.isPending ? "Preparing…" : "Enable 2FA"}
            </Button>
          )}

          {isEnabled && !showDisable && (
            <Button
              variant="outline"
              onClick={() => {
                setFormError("");
                setPassword("");
                setDisableCode("");
                setShowDisable(true);
              }}
              className="shrink-0"
            >
              Disable
            </Button>
          )}
        </div>

        {isEnabled && (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="size-4" /> Two-Factor Authentication Enabled
          </p>
        )}

        {!isEnabled && step === "setup" && setupData && (
          <div className="mt-6 space-y-5 rounded-lg border bg-muted/40 p-4">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="shrink-0 rounded-xl bg-white p-3">
                <img
                  src={setupData.qrCode}
                  alt="Scan this QR code with your authenticator app"
                  className="size-40"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-4">
                <div>
                  <p className="text-sm font-medium">How to set up</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>
                      Install Google Authenticator, Microsoft Authenticator, or
                      Authy on your phone.
                    </li>
                    <li>
                      Scan the QR code, or enter the setup key manually if you
                      cannot scan.
                    </li>
                    <li>
                      Enter the 6-digit code shown in the app below, then click
                      Enable.
                    </li>
                  </ol>
                </div>

                <div>
                  <p className="text-sm font-medium">Manual setup key</p>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-xs tracking-wide break-all">
                      {setupData.manualEntryKey}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Copy setup key"
                      onClick={() => void copyManualKey()}
                    >
                      {copied ? <Check /> : <Copy />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleEnable}>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Verification code
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full text-lg tracking-[0.35em] sm:w-48"
                  aria-invalid={Boolean(codeError)}
                />
              </label>
              {codeError && (
                <p role="alert" className="text-xs text-destructive">
                  {codeError}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  disabled={enable.isPending || code.length !== 6}
                >
                  {enable.isPending && <Loader2 className="animate-spin" />}
                  {enable.isPending ? "Enabling…" : "Enable"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelSetup}
                  disabled={enable.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {isEnabled && showDisable && (
          <form
            className="mt-6 space-y-4 rounded-lg border bg-muted/40 p-4"
            onSubmit={handleDisable}
          >
            <p className="text-sm text-muted-foreground">
              Confirm your password and a current code to turn off two-factor
              authentication.
            </p>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Password
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                aria-invalid={Boolean(formError && !password)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Authenticator code
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                value={disableCode}
                onChange={(event) =>
                  setDisableCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full text-lg tracking-[0.35em] sm:w-48"
                aria-invalid={Boolean(formError)}
              />
            </label>

            {formError && (
              <p role="alert" className="text-xs text-destructive">
                {formError}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                variant="destructive"
                disabled={disable.isPending}
              >
                {disable.isPending && <Loader2 className="animate-spin" />}
                {disable.isPending ? "Disabling…" : "Disable 2FA"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDisable(false);
                  setFormError("");
                }}
                disabled={disable.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
