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
      'Agent chat is not connected to a backend yet. When an agent API is available, you can ask about leads, scoring, and pipeline priorities here.',
  },
]

const suggestions = [
  'Why is this lead cold?',
  'How can I convert this lead?',
  'Summarize hot leads',
]

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
      content:
        'Agent responses require a chat API endpoint. Use lead detail pages for snapshot reasoning and email actions in the meantime.',
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
