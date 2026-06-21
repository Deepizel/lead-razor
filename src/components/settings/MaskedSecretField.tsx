import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MASKED_SECRET_PLACEHOLDER } from '@/lib/map-email-identity'

interface MaskedSecretFieldProps {
  id: string
  label: string
  configured: boolean
  changing: boolean
  onStartChange: () => void
  onCancelChange: () => void
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  autoComplete?: string
}

/** Password / API key with masked placeholder when already configured on the server */
export function MaskedSecretField({
  id,
  label,
  configured,
  changing,
  onStartChange,
  onCancelChange,
  value,
  onChange,
  disabled,
  placeholder = 'Enter new value',
  autoComplete = 'off',
}: MaskedSecretFieldProps) {
  const showMasked = configured && !changing

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {configured && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-0 text-xs"
            disabled={disabled}
            onClick={showMasked ? onStartChange : onCancelChange}
          >
            {showMasked ? 'Change' : 'Cancel'}
          </Button>
        )}
      </div>
      {showMasked ? (
        <Input
          id={id}
          type="text"
          readOnly
          value={MASKED_SECRET_PLACEHOLDER}
          className="font-mono text-muted-foreground"
          disabled={disabled}
          aria-label={`${label} (configured)`}
        />
      ) : (
        <Input
          id={id}
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={configured ? placeholder : undefined}
          autoComplete={autoComplete}
        />
      )}
    </div>
  )
}
