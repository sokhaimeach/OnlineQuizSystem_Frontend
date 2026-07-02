import { useEffect, useRef, useState, type FormEvent } from 'react'
import axios from 'axios'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  School,
  UploadCloud,
  UserRound,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { RegisterPayload } from '@/models/auth.interface'
import { useRegisterAsTeacher } from '@/hooks/api/useAuth'

const steps = ['Authentication', 'User info', 'Profile image']

const initialForm: RegisterPayload = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  gender: 'OTHER',
  bio: '',
  school_name: '',
  image: null,
}

function RequiredMark() {
  return <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>
}

function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return 'Unable to create your account. Please try again.'
  const data = error.response?.data as { message?: string } | undefined
  return data?.message ?? 'Registration failed. Please review your details and try again.'
}

const Register = () => {

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<RegisterPayload>(initialForm)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const stepProgress = ((step + 1) / steps.length) * 100

  const registerAsTeacherMutation = useRegisterAsTeacher()

  useEffect(() => {
    if (!form.image) {
      setImagePreview('')
      return
    }

    const previewUrl = URL.createObjectURL(form.image)
    setImagePreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [form.image])

  const updateField = <Key extends keyof RegisterPayload>(field: Key, value: RegisterPayload[Key]) => {
    setForm(current => ({ ...current, [field]: value }))
    setError('')
  }

  // validate form
  const validateStep = (stepIndex: number) => {
    if (stepIndex === 0) {
      if (!form.email.trim()) return 'Email address is required.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.'
      if (form.password.length < 8) return 'Password must be at least 8 characters.'
      if (!confirmPassword) return 'Please confirm your password.'
      if (form.password !== confirmPassword) return 'Your passwords do not match.'
    }

    if (stepIndex === 1) {
      if (!form.first_name.trim()) return 'First name is required.'
      if (!form.last_name.trim()) return 'Last name is required.'
    }

    return ''
  }

  const goNext = () => {
    const validationError = validateStep(step)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setStep(current => Math.min(steps.length - 1, current + 1))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (step < steps.length - 1) {
      goNext()
      return
    }

    const validationError = [0, 1].map(validateStep).find(Boolean)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError('')
    try {
      await registerAsTeacherMutation.mutateAsync(form)
    } catch (registerError) {
      setError(getErrorMessage(registerError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeImage = () => {
    updateField('image', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <AuthLayout
      eyebrow="Teacher registration"
      title="Create your account"
      description="Complete the three short steps to set up your teaching workspace."
      className=""
    >
      <div className="mb-7 rounded-lg border bg-card p-4">
        <div className="mb-3 flex">
          {steps.map((label, index) => (
            <div key={label} className="flex flex-1 items-start">
              <div className="flex min-w-0 flex-col items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`Go to ${label}`}
                  disabled={index > step}
                  onClick={() => {
                    setStep(index)
                    setError('')
                  }}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
                    index < step
                      ? 'bg-primary text-primary-foreground'
                      : index === step
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/15'
                        : 'bg-muted text-muted-foreground',
                  )}
                >
                  {index < step ? <Check className="size-4" /> : index + 1}
                </button>
                <span className={cn(
                  'text-center text-[11px] font-medium sm:text-xs',
                  index === step ? 'text-foreground' : 'text-muted-foreground',
                )}>
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'mx-2 mt-4 h-px flex-1',
                  index < step ? 'bg-primary' : 'bg-border',
                )} />
              )}
            </div>
          ))}
        </div>
        <Progress value={stepProgress} className="h-1" />
      </div>

      <form onSubmit={handleSubmit}>
        {/* step 1 auth  */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold">Authentication details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose the credentials you will use to sign in.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="register-email">
                Email address<RequiredMark />
              </label>
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="teacher@school.com"
                className="h-10"
                value={form.email}
                onChange={event => updateField('email', event.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="register-password">
                  Password<RequiredMark />
                </label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="h-10 pr-9"
                    minLength={8}
                    value={form.password}
                    onChange={event => updateField('password', event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(current => !current)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirm-password">
                  Confirm password<RequiredMark />
                </label>
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  className="h-10"
                  minLength={8}
                  value={confirmPassword}
                  onChange={event => {
                    setConfirmPassword(event.target.value)
                    setError('')
                  }}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* step 2 user info */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold">Tell us about yourself</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This information helps personalize your teacher profile.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="first-name">
                  First name<RequiredMark />
                </label>
                <Input
                  id="first-name"
                  autoComplete="given-name"
                  placeholder="Tola"
                  className="h-10"
                  value={form.first_name}
                  onChange={event => updateField('first_name', event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="last-name">
                  Last name<RequiredMark />
                </label>
                <Input
                  id="last-name"
                  autoComplete="family-name"
                  placeholder="Sok"
                  className="h-10"
                  value={form.last_name}
                  onChange={event => updateField('last_name', event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="school-name">
                  School
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="school-name"
                    autoComplete="organization"
                    placeholder="School name"
                    className="h-10 pl-9"
                    value={form.school_name}
                    onChange={event => updateField('school_name', event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="gender">
                  Gender
                </label>
                <Select value={form.gender} defaultValue='OTHER' onValueChange={value => updateField('gender', value)}>
                  <SelectTrigger id="gender" className="h-10 w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="bio">
                Short bio
              </label>
              <Textarea
                id="bio"
                placeholder="Tell students a little about yourself and what you teach."
                className="min-h-24 resize-none"
                maxLength={300}
                value={form.bio}
                onChange={event => updateField('bio', event.target.value)}
              />
              <p className="text-right text-xs text-muted-foreground">{form.bio.length}/300</p>
            </div>
          </div>
        )}

        {/* last step profile image */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold">Add a profile image</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Optional — help students recognize you in their classroom.
              </p>
            </div>

            <input
              ref={fileInputRef}
              id="profile-image"
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={event => updateField('image', event.target.files?.[0] ?? null)}
            />

            {form.image && imagePreview ? (
              <div className="rounded-xl border bg-muted/30 p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="size-36 rounded-full border-4 border-background object-cover shadow-md"
                    />
                    <button
                      type="button"
                      aria-label="Remove profile image"
                      className="absolute -right-1 -top-1 flex size-8 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-transform hover:scale-105"
                      onClick={removeImage}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <p className="mt-4 max-w-full truncate text-sm font-medium">{form.image.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {(form.image.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus />
                    Choose another image
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="size-6" />
                </span>
                <span className="mt-4 text-sm font-medium">Click to upload an image</span>
                <span className="mt-1 text-xs text-muted-foreground">PNG, JPG, or WEBP</span>
              </button>
            )}
          </div>
        )}

        {error && (
          <p role="alert" className="mt-5 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-7 flex items-center justify-between border-t pt-5">
          <Button
            type="button"
            variant="outline"
            disabled={step === 0 || isSubmitting}
            onClick={() => {
              setStep(current => Math.max(0, current - 1))
              setError('')
            }}
          >
            <ChevronLeft />
            Previous
          </Button>

          {step < steps.length - 1 ? (
            <Button type="submit">
              Next
              <ChevronRight />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" /> : <UserRound />}
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          )}
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-primary hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Register
