export function AuthMarketingPanel() {
  return (
    <div className="relative hidden flex-1 flex-col justify-between border-r border-border/60 p-10 lg:flex xl:p-14">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          LeadRazor
        </p>
        <h1 className="mt-6 max-w-md text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">
          AI lead qualification that actually ships revenue
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Upload leads, score against your ICP, refresh LLM snapshots, and send
          personalized outreach — all scoped to your account.
        </p>
      </div>
      <ul className="space-y-3 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-violet-500" />
          Multi-tenant categories & leads
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-cyan-500" />
          Per-user email identities for outreach
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Secure JWT access with auto-refresh
        </li>
      </ul>
    </div>
  )
}
