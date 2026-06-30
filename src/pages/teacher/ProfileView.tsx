import { UserCircle, Mail, Building2, Calendar, Edit, Camera } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


const stats = [
  { label: 'Classes Taught', value: '12' },
  { label: 'Total Students', value: '347' },
  { label: 'Quizzes Created', value: '24' },
  { label: 'Avg Class Score', value: '82.4%' },
]

export function ProfileView() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <PageHeader
        title="My Profile"
        description="Manage your account and preferences"
        icon={UserCircle}
        action={{ label: 'Edit Profile', icon: Edit, onClick: () => {} }}
      />

      {/* Profile Card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-card">
                <AvatarImage src="/avatars/teacher.jpg" alt="Jane Doe" />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground font-bold">JD</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-6 w-6 rounded-full shadow border border-border">
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            <StatusBadge variant="success" dot>Active Teacher</StatusBadge>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Jane Doe</h2>
            <p className="text-sm text-muted-foreground">Senior Science & Mathematics Teacher</p>
          </div>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-3 mb-5">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">
              <Mail className="h-3.5 w-3.5" /> jane.doe@school.edu
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">
              <Building2 className="h-3.5 w-3.5" /> Science Department
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">
              <Calendar className="h-3.5 w-3.5" /> Joined Sept 2019
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">First Name</label>
            <Input defaultValue="Jane" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Last Name</label>
            <Input defaultValue="Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <Input type="email" defaultValue="jane.doe@school.edu" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Department</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option>Science Department</option>
              <option>Mathematics Department</option>
              <option>Humanities Department</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Bio</label>
            <textarea
              rows={3}
              defaultValue="Passionate science and mathematics educator with 7+ years of experience in creating engaging learning experiences for students."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Preferences</h3>
        <div className="flex flex-col gap-3">
          {[
            { label: 'Email Notifications', desc: 'Receive email alerts for new submissions and deadlines' },
            { label: 'Auto-grade Quizzes', desc: 'Automatically grade MCQ and True/False questions' },
            { label: 'Weekly Summary Report', desc: 'Get a weekly email digest of class performance' },
          ].map(pref => (
            <label key={pref.label} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-indigo-600 h-4 w-4" />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
