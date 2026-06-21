import { useState } from 'react'
import { WaitlistApproveDialog } from '@/components/admin/WaitlistApproveDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useApproveUser,
  useAdminUsers,
  useDeactivateUser,
} from '@/hooks/useAdmin'
import {
  useAdminWaitlist,
  useApproveWaitlistEntry,
  useRejectWaitlistEntry,
} from '@/hooks/useWaitlist'
import { hasApiBaseUrl } from '@/lib/api-client'
import { resolveWaitlistUser } from '@/lib/resolve-waitlist-user'
import type { AdminUser, WaitlistEntry } from '@/types/waitlist'

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === 'active'
      ? 'default'
      : status === 'rejected' || status === 'deactivated'
        ? 'destructive'
        : 'secondary'
  return <Badge variant={variant}>{status}</Badge>
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function WaitlistTable({
  entries,
  users,
  isLoading,
  onRequestApprove,
  onReject,
  onDeactivateUser,
  pendingWaitlistId,
  pendingUserId,
}: {
  entries: WaitlistEntry[]
  users: AdminUser[]
  isLoading: boolean
  onRequestApprove: (entry: WaitlistEntry) => void
  onReject: (id: string) => void
  onDeactivateUser: (userId: string) => void
  pendingWaitlistId: string | null
  pendingUserId: string | null
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No waitlist applications yet.</p>
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const linkedUser = resolveWaitlistUser(entry, users)
            const canDeactivate =
              entry.status === 'active' &&
              linkedUser != null &&
              linkedUser.role !== 'admin' &&
              (linkedUser.status === 'active' || linkedUser.status === 'pending')
            const waitlistBusy = pendingWaitlistId === entry.id
            const userBusy = linkedUser != null && pendingUserId === linkedUser.id

            return (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  {entry.firstName} {entry.lastName}
                </TableCell>
                <TableCell>{entry.email}</TableCell>
                <TableCell className="max-w-48 truncate">{entry.businessIndustry}</TableCell>
                <TableCell>
                  <StatusBadge status={entry.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(entry.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  {entry.status === 'pending' ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        disabled={waitlistBusy || userBusy}
                        onClick={() => onRequestApprove(entry)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={waitlistBusy || userBusy}
                        onClick={() => onReject(entry.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : entry.status === 'active' && canDeactivate && linkedUser ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={userBusy || waitlistBusy}
                      onClick={() => onDeactivateUser(linkedUser.id)}
                    >
                      Deactivate
                    </Button>
                  ) : entry.status === 'active' && linkedUser?.status === 'deactivated' ? (
                    <span className="text-xs text-muted-foreground">Account deactivated</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function UsersTable({
  users,
  isLoading,
  onApprove,
  onDeactivate,
  pendingId,
}: {
  users: AdminUser[]
  isLoading: boolean
  onApprove: (id: string) => void
  onDeactivate: (id: string) => void
  pendingId: string | null
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No users found.</p>
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName || user.lastName
                  ? `${user.firstName} ${user.lastName}`.trim()
                  : '—'}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>{user.role}</Badge>
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="text-right">
                {user.status === 'deactivated' ? (
                  <Button
                    size="sm"
                    disabled={pendingId === user.id}
                    onClick={() => onApprove(user.id)}
                  >
                    Approve
                  </Button>
                ) : user.status === 'pending' ? (
                  <Button
                    size="sm"
                    disabled={pendingId === user.id}
                    onClick={() => onApprove(user.id)}
                  >
                    Activate
                  </Button>
                ) : user.status === 'active' && user.role !== 'admin' ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={pendingId === user.id}
                    onClick={() => onDeactivate(user.id)}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function AdminUsersPage() {
  const [tab, setTab] = useState('waitlist')
  const [approveEntry, setApproveEntry] = useState<WaitlistEntry | null>(null)
  const waitlistQuery = useAdminWaitlist()
  const usersQuery = useAdminUsers()
  const approveWaitlist = useApproveWaitlistEntry()
  const rejectWaitlist = useRejectWaitlistEntry()
  const approveUser = useApproveUser()
  const deactivateUser = useDeactivateUser()

  const waitlistPendingId =
    approveWaitlist.isPending || rejectWaitlist.isPending
      ? (approveWaitlist.variables ?? rejectWaitlist.variables ?? null)
      : null

  const usersPendingId =
    approveUser.isPending || deactivateUser.isPending
      ? (approveUser.variables ?? deactivateUser.variables ?? null)
      : null

  const allUsers = usersQuery.data ?? []

  if (!hasApiBaseUrl()) {
    return (
      <p className="text-sm text-destructive">
        Configure VITE_API_BASE_URL to manage users and the waitlist.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Review waitlist applications and manage user access.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          <TabsTrigger value="users">All users</TabsTrigger>
        </TabsList>

        <TabsContent value="waitlist" className="mt-4">
          <WaitlistTable
            entries={waitlistQuery.data ?? []}
            users={allUsers}
            isLoading={waitlistQuery.isLoading}
            onRequestApprove={setApproveEntry}
            onReject={(id) => rejectWaitlist.mutate(id)}
            onDeactivateUser={(userId) => deactivateUser.mutate(userId)}
            pendingWaitlistId={waitlistPendingId}
            pendingUserId={usersPendingId}
          />
        </TabsContent>

        <WaitlistApproveDialog
          entry={approveEntry}
          open={approveEntry != null}
          approve={approveWaitlist}
          onOpenChange={(open) => {
            if (!open) setApproveEntry(null)
          }}
        />

        <TabsContent value="users" className="mt-4">
          <UsersTable
            users={allUsers}
            isLoading={usersQuery.isLoading}
            onApprove={(id) => approveUser.mutate(id)}
            onDeactivate={(id) => deactivateUser.mutate(id)}
            pendingId={usersPendingId}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
