import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'

export default function SettingsProfileTab() {
  const user = useAuthStore((s) => s.user)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your signed-in account details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-1">
          <p className="text-xs font-medium text-muted-foreground">Email</p>
          <p>{user?.email ?? '—'}</p>
        </div>
        <div className="grid gap-1">
          <p className="text-xs font-medium text-muted-foreground">Email verified</p>
          <p>{user?.emailVerified ? 'Yes' : 'No'}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Profile editing (name, password) will be available in a future update.
        </p>
      </CardContent>
    </Card>
  )
}
