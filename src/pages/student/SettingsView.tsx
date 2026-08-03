import {
  Camera,
  KeyRound,
  Loader2,
  Moon,
  Save,
  Settings,
  Sun,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useChangePassword } from "@/hooks/api/useAuth";
import {
  useChangeUserImage,
  useStudentAccount,
  useUpdateStudentAccount,
} from "@/hooks/api/useUser";
import type { ChangePasswordPayload } from "@/models/auth.interface";
import type {
  Gender,
  UpdateUserAndStudentPayload,
} from "@/models/user.interface";

const blank: UpdateUserAndStudentPayload = {
  first_name: "",
  last_name: "",
  gender: "OTHER",
  bio: "",
  date_of_birth: "",
  phone_number: "",
  parent_phone_number: "",
};
const blankPassword: ChangePasswordPayload = {
  old_password: "",
  new_password: "",
  confirm_password: "",
};

export function StudentSettingsView() {
  const account = useStudentAccount();
  const update = useUpdateStudentAccount();
  const image = useChangeUserImage();
  const password = useChangePassword();
  const { theme, setTheme } = useTheme();
  const input = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(blank);
  const [passwords, setPasswords] = useState(blankPassword);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (account.data)
      setForm({
        first_name: account.data.first_name ?? "",
        last_name: account.data.last_name ?? "",
        gender: account.data.gender ?? "OTHER",
        bio: account.data.bio ?? "",
        date_of_birth: account.data.student?.date_of_birth?.slice(0, 10) ?? "",
        phone_number: account.data.student?.phone_number ?? "",
        parent_phone_number: account.data.student?.parent_phone_number ?? "",
      });
  }, [account.data]);

  const set = <K extends keyof UpdateUserAndStudentPayload>(
    key: K,
    value: UpdateUserAndStudentPayload[K],
  ) => setForm((old) => ({ ...old, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim())
      return toast.error("First and last name are required.");
    update.mutate(form, {
      onSuccess: () => toast.success("Profile updated."),
      onError: () => toast.error("Profile could not be updated."),
    });
  };

  const submitPassword = (e: FormEvent) => {
    e.preventDefault();
    if (passwords.new_password.length < 8)
      return toast.error("New password must be at least 8 characters.");
    if (passwords.new_password !== passwords.confirm_password)
      return toast.error("New passwords do not match.");
    password.mutate(passwords, {
      onSuccess: () => {
        toast.success("Password changed.");
        setPasswords(blankPassword);
      },
      onError: () => toast.error("Password could not be changed."),
    });
  };

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Choose an image file.");
    setPreviewUrl(URL.createObjectURL(file));
    image.mutate(file, {
      onSuccess: () => {
        setPreviewUrl(null);
        toast.success("Avatar updated.");
      },
      onError: () => {
        setPreviewUrl(null);
        toast.error("Avatar upload failed.");
      },
    });
  };

  const handleRemoveAvatar = () => {
    // Re-upload an empty/deleted image is backend-dependent;
    // for now just notify the user. A dedicated delete endpoint
    // would be needed for full removal.
    toast.info("To remove your avatar, upload a new image or contact support.");
  };

  const currentSrc = previewUrl ?? account.data?.avatar_url ?? undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Settings className="text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your profile, avatar, password, and appearance.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={submit}>
            <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
              <Avatar className="size-20 shrink-0">
                <AvatarImage src={currentSrc} />
                <AvatarFallback>
                  {account.data?.first_name?.[0] ?? "S"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium">Profile avatar</p>
                <p className="mb-2 text-xs text-muted-foreground">
                  JPG, PNG, or WEBP
                </p>
                <input
                  ref={input}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={image.isPending}
                    onClick={() => input.current?.click()}
                  >
                    {image.isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Camera />
                    )}
                    {image.isPending ? "Uploading…" : "Change"}
                  </Button>
                  {account.data?.avatar_url && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAvatar}
                    >
                      <Trash2 /> Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <Input
                  value={form.first_name}
                  onChange={(e) => set("first_name", e.target.value)}
                />
              </Field>
              <Field label="Last name">
                <Input
                  value={form.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                />
              </Field>
              <Field label="Gender">
                <Select
                  value={form.gender}
                  onValueChange={(v) => set("gender", v as Gender)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date of birth">
                <Input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => set("date_of_birth", e.target.value)}
                />
              </Field>
              <Field label="Phone number">
                <Input
                  value={form.phone_number}
                  onChange={(e) => set("phone_number", e.target.value)}
                />
              </Field>
              <Field label="Parent phone number">
                <Input
                  value={form.parent_phone_number}
                  onChange={(e) => set("parent_phone_number", e.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Bio">
                  <Textarea
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    maxLength={300}
                  />
                </Field>
              </div>
            </div>

            <div className="flex justify-end">
              <Button disabled={update.isPending}>
                {update.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save />
                )}{" "}
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-4" /> Change password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submitPassword}>
            <Field label="Current password">
              <Input
                type="password"
                value={passwords.old_password}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, old_password: e.target.value }))
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password">
                <Input
                  type="password"
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      new_password: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Confirm new password">
                <Input
                  type="password"
                  value={passwords.confirm_password}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      confirm_password: e.target.value,
                    }))
                  }
                />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button disabled={password.isPending}>
                {password.isPending && <Loader2 className="animate-spin" />}
                Change password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-md border p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                {theme === "dark" ? (
                  <Moon className="size-5" />
                ) : (
                  <Sun className="size-5" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark appearance.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              aria-label="Toggle dark mode"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative h-6 w-11 shrink-0 rounded-full bg-muted ring-1 ring-border transition-colors aria-checked:bg-primary"
            >
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
                  theme === "dark" && "translate-x-5",
                )}
              />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
