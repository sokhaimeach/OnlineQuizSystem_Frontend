import { useState, type FormEvent } from 'react'
import { KeyRound, Loader2, Moon, Settings, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { ProfileForm } from '@/components/teacher/account/ProfileForm'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { useChangePassword } from '@/hooks/api/useAuth'
import { useUser } from '@/hooks/api/useUser'
import type { ChangePasswordPayload } from '@/models/auth.interface'

const emptyPasswordForm: ChangePasswordPayload = {
  old_password: '',
  new_password: '',
  confirm_password: '',
}

function errorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const data = (error as {
      response?: { data?: { message?: string; errors?: Record<string, string[]> } }
    }).response?.data
    return (data?.errors && Object.values(data.errors).flat()[0]) || data?.message || fallback
  }
  return fallback
}

export function TeacherSettingsView() {
  const accountQuery = useUser()
  const { theme, setTheme } = useTheme()
  const changePassword = useChangePassword()
  const [passwords, setPasswords] = useState<ChangePasswordPayload>(emptyPasswordForm)
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof ChangePasswordPayload, string>>>({})

  const setPassword = (key: keyof ChangePasswordPayload, value: string) => {
    setPasswords(current => ({ ...current, [key]: value }))
    setPasswordErrors(current => ({ ...current, [key]: undefined }))
  }

  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors: typeof passwordErrors = {}
    if (!passwords.old_password) errors.old_password = 'Current password is required.'
    if (!passwords.new_password) errors.new_password = 'New password is required.'
    if (!passwords.confirm_password) errors.confirm_password = 'Please confirm your new password.'
    if (
      passwords.new_password &&
      passwords.confirm_password &&
      passwords.new_password !== passwords.confirm_password
    ) {
      errors.confirm_password = 'New passwords do not match.'
    }
    setPasswordErrors(errors)
    if (Object.keys(errors).length) return

    changePassword.mutate(passwords, {
      onSuccess: () => {
        setPasswords(emptyPasswordForm)
        setPasswordErrors({})
        toast.success('Password changed successfully.')
      },
      onError: error => toast.error(errorMessage(error, 'Could not change your password.')),
    })
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader
        title="Account Settings"
        description="Manage your teacher profile, password, and appearance"
        icon={Settings}
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update the information shown on your teacher account.</CardDescription>
        </CardHeader>
        <CardContent>
          {accountQuery.isLoading ? (
            <ProfileFormSkeleton />
          ) : accountQuery.isError || !accountQuery.data ? (
            <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">Your profile could not be loaded.</p>
              <Button type="button" variant="outline" onClick={() => void accountQuery.refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <ProfileForm account={accountQuery.data} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2"><KeyRound className="size-4" /> Change Password</CardTitle>
          <CardDescription>Use a strong password that you do not reuse elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submitPassword} noValidate>
            <PasswordField
              label="Current Password"
              value={passwords.old_password}
              error={passwordErrors.old_password}
              onChange={value => setPassword('old_password', value)}
              autoComplete="current-password"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <PasswordField
                label="New Password"
                value={passwords.new_password}
                error={passwordErrors.new_password}
                onChange={value => setPassword('new_password', value)}
                autoComplete="new-password"
              />
              <PasswordField
                label="Confirm New Password"
                value={passwords.confirm_password}
                error={passwordErrors.confirm_password}
                onChange={value => setPassword('confirm_password', value)}
                autoComplete="new-password"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending && <Loader2 className="animate-spin" />}
                {changePassword.isPending ? 'Changing…' : 'Change password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Theme changes are applied immediately and saved on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-md border p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                {theme === 'dark' ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </div>
              <div>
                <p className="font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark appearance.</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Toggle dark mode"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative h-6 w-11 shrink-0 rounded-full bg-muted ring-1 ring-border transition-colors aria-checked:bg-primary"
            >
              <span
                className={cn(
                  'absolute left-0.5 top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform',
                  theme === 'dark' && 'translate-x-5',
                )}
              />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PasswordField({
  label,
  value,
  error,
  onChange,
  autoComplete,
}: {
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  autoComplete: string
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium">
      {label}
      <Input
        type="password"
        value={value}
        onChange={event => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="text-xs font-normal text-destructive">{error}</span>}
    </label>
  )
}

function ProfileFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)}
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
