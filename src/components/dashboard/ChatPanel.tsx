import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/stores/uiStore'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const starterMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      'I’m your AI SDR co-pilot. Ask about any lead, scoring logic, or how to prioritize your pipeline today.',
  },
]

const suggestions = [
  'Why is this lead cold?',
  'How can I convert this lead?',
  'Summarize all hot leads',
]

function mockReply(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('cold')) {
    return 'This lead is cold because engagement dropped after the webinar, no decision-maker is on the thread, and the account sits outside your core ICP. Consider a nurture sequence focused on RevOps pain points.'
  }
  if (lower.includes('convert')) {
    return 'To convert: reference their intent signals in the opener, offer a 15-minute fit check with RevOps, and attach a vertical-specific ROI snapshot. The drafted email is a strong starting point — personalize the first line.'
  }
  if (lower.includes('hot') || lower.includes('summarize')) {
    return 'You have 2 hot leads: Sarah Chen (92) at NovaStack AI and James Okonkwo (88) at Vertex Payments. Both show budget timing and strong ICP fit. Prioritize scheduling with James (meeting already booked) and send Sarah the enterprise ROI doc.'
  }
  return 'Based on current pipeline data, I recommend focusing on hot leads with scheduled meetings first, then warming Marcus Webb with case studies. I can draft actions for any lead you name.'
}

export function ChatPanel() {
  const chatOpen = useUiStore((s) => s.chatOpen)
  const setChatOpen = useUiStore((s) => s.setChatOpen)
  const selectedLeadId = useUiStore((s) => s.selectedLeadId)
  const [messages, setMessages] = useState<Message[]>(starterMessages)
  const [input, setInput] = useState('')

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: mockReply(text),
    }
    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
  }

  return (
    <>
      {!chatOpen && (
        <Button
          className="fixed right-4 z-40 size-12 rounded-full shadow-lg bottom-[max(1rem,env(safe-area-inset-bottom))] sm:right-6"
          size="icon-lg"
          onClick={() => setChatOpen(true)}
          aria-label="Open AI agent chat"
        >
          AI
        </Button>
      )}

      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-4 py-3 text-left">
            <SheetTitle>Agent chat</SheetTitle>
            <SheetDescription>
              {selectedLeadId
                ? `Context: lead ${selectedLeadId}`
                : 'Global pipeline context'}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 px-4 py-3">
            <div className="space-y-3 pr-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'max-w-[90%] rounded-lg px-3 py-2 text-xs leading-relaxed',
                    msg.role === 'user'
                      ? 'ml-auto bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground',
                  )}
                >
                  {msg.content}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-3">
            <div className="mb-2 flex flex-wrap gap-1">
              {suggestions.map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="cursor-pointer font-normal"
                  onClick={() => send(s)}
                >
                  {s}
                </Badge>
              ))}
            </div>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <Input
                placeholder="Ask about leads…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" size="sm">
                Send
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
