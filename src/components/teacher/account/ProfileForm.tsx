import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Camera, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useChangeUserImage,
  useUpdateUserAndTeacherAccount,
} from '@/hooks/api/useUser'
import type {
  Gender,
  TeacherAccount,
  UpdateUserAndTeacherPayload,
} from '@/models/user.interface'

interface ProfileFormProps {
  account: TeacherAccount
  showAvatar?: boolean
}

interface ProfileFields {
  first_name: string
  last_name: string
  gender: Gender
  bio: string
  school_name: string
}

function fieldsFromAccount(account: TeacherAccount): ProfileFields {
  return {
    first_name: account.first_name ?? '',
    last_name: account.last_name ?? '',
    gender: account.gender ?? 'OTHER',
    bio: account.bio ?? '',
    school_name: account.teacher?.school_name ?? '',
  }
}

function apiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as {
      response?: { data?: { message?: string; errors?: Record<string, string[]> } }
    }).response
    const validationMessage = response?.data?.errors
      ? Object.values(response.data.errors).flat()[0]
      : undefined
    return validationMessage || response?.data?.message || fallback
  }
  return fallback
}

export function ProfileForm({ account, showAvatar = true }: ProfileFormProps) {
  const [fields, setFields] = useState<ProfileFields>(() => fieldsFromAccount(account))
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFields, string>>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const updateProfile = useUpdateUserAndTeacherAccount()
  const changeImage = useChangeUserImage()

  useEffect(() => {
    setFields(fieldsFromAccount(account))
  }, [account])

  const fullName = [account.first_name, account.last_name].filter(Boolean).join(' ')
  const initials = `${account.first_name?.[0] ?? ''}${account.last_name?.[0] ?? ''}`.toUpperCase() || '?'

  const setField = <K extends keyof ProfileFields>(key: K, value: ProfileFields[K]) => {
    setFields(current => ({ ...current, [key]: value }))
    setErrors(current => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!fields.first_name.trim()) nextErrors.first_name = 'First name is required.'
    if (!fields.last_name.trim()) nextErrors.last_name = 'Last name is required.'
    if (!fields.school_name.trim()) nextErrors.school_name = 'School name is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const payload: UpdateUserAndTeacherPayload = {
      first_name: fields.first_name.trim(),
      last_name: fields.last_name.trim(),
      gender: fields.gender,
      bio: fields.bio.trim(),
      school_name: fields.school_name.trim(),
    }

    updateProfile.mutate(payload, {
      onSuccess: () => toast.success('Profile updated successfully.'),
      onError: error => toast.error(apiErrorMessage(error, 'Could not update your profile.')),
    })
  }

  const handleImage = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file.')
      return
    }
    changeImage.mutate(file, {
      onSuccess: () => toast.success('Profile image updated successfully.'),
      onError: error => toast.error(apiErrorMessage(error, 'Could not update your profile image.')),
      onSettled: () => {
        if (fileInputRef.current) fileInputRef.current.value = ''
      },
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {showAvatar && (
        <div className="flex flex-col gap-4 rounded-md border border-border bg-muted/20 p-4 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 ring-2 ring-background">
            <AvatarImage src={account.avatar_url ?? undefined} alt={fullName} />
            <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">Profile image</p>
            <p className="mb-3 text-xs text-muted-foreground">Choose an image to update your avatar.</p>
            <input
              ref={fileInputRef}
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={event => handleImage(event.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              disabled={changeImage.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {changeImage.isPending ? <Loader2 className="animate-spin" /> : <Camera />}
              {changeImage.isPending ? 'Uploading…' : 'Change image'}
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First Name" error={errors.first_name}>
          <Input
            value={fields.first_name}
            onChange={event => setField('first_name', event.target.value)}
            aria-invalid={Boolean(errors.first_name)}
          />
        </Field>
        <Field label="Last Name" error={errors.last_name}>
          <Input
            value={fields.last_name}
            onChange={event => setField('last_name', event.target.value)}
            aria-invalid={Boolean(errors.last_name)}
          />
        </Field>
        <Field label="Gender">
          <Select value={fields.gender} onValueChange={value => setField('gender', value as Gender)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="School Name" error={errors.school_name}>
          <Input
            value={fields.school_name}
            onChange={event => setField('school_name', event.target.value)}
            aria-invalid={Boolean(errors.school_name)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Bio">
            <Textarea
              rows={4}
              value={fields.bio}
              onChange={event => setField('bio', event.target.value)}
              placeholder="Tell students a little about yourself"
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateProfile.isPending || changeImage.isPending}>
          {updateProfile.isPending ? <Loader2 className="animate-spin" /> : <Save />}
          {updateProfile.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium">
      {label}
      {children}
      {error && <span className="text-xs font-normal text-destructive">{error}</span>}
    </label>
  )
}
