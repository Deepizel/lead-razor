import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Search01Icon,
  Tick02Icon,
  Add01Icon,
  Cancel01Icon,
  Loading01Icon,
} from '@hugeicons/core-free-icons'
import { useCategories, useCreateCategory } from '@/hooks/useCategories'
import { cn } from '@/lib/utils'

interface CategorySelectProps {
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

interface PanelPosition {
  top: number
  left: number
  width: number
  maxHeight: number
}

function getPanelPosition(trigger: HTMLElement): PanelPosition {
  const rect = trigger.getBoundingClientRect()
  const viewportPadding = 8
  const gap = 6
  const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
  const spaceAbove = rect.top - viewportPadding
  const preferredMaxHeight = 280
  const openBelow = spaceBelow >= 160 || spaceBelow >= spaceAbove
  const maxHeight = Math.min(
    preferredMaxHeight,
    openBelow ? spaceBelow - gap : spaceAbove - gap,
  )

  return {
    top: openBelow ? rect.bottom + gap : rect.top - gap - maxHeight,
    left: rect.left,
    width: rect.width,
    maxHeight: Math.max(maxHeight, 120),
  }
}

export function CategorySelect({ value, onValueChange, disabled }: CategorySelectProps) {
  const { data: categories = [], isLoading, isError, error: fetchError } = useCategories()
  const createMutation = useCreateCategory()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null)

  const [newName, setNewName] = useState('')
  const [newOffering, setNewOffering] = useState('')
  const [newStatement, setNewStatement] = useState('')
  const [creationError, setCreationError] = useState<string | null>(null)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const offeringInputRef = useRef<HTMLTextAreaElement>(null)

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === value)
  }, [categories, value])

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const query = searchQuery.toLowerCase()
    return categories.filter((c) => c.name.toLowerCase().includes(query))
  }, [categories, searchQuery])

  const syncPanelPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    setPanelPosition(getPanelPosition(trigger))
  }, [])

  useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredCategories])

  useEffect(() => {
    if (!isOpen) {
      setPanelPosition(null)
      return
    }

    syncPanelPosition()
    window.addEventListener('resize', syncPanelPosition)
    window.addEventListener('scroll', syncPanelPosition, true)

    return () => {
      window.removeEventListener('resize', syncPanelPosition)
      window.removeEventListener('scroll', syncPanelPosition, true)
    }
  }, [isOpen, syncPanelPosition])

  useEffect(() => {
    if (isOpen && !isCreating) {
      const timer = window.setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
      return () => window.clearTimeout(timer)
    }
  }, [isOpen, isCreating])

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const openDropdown = () => {
    if (disabled) return
    setSearchQuery('')
    setIsCreating(false)
    setNewName('')
    setNewOffering('')
    setNewStatement('')
    setCreationError(null)
    setIsOpen(true)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown()
      return
    }
    openDropdown()
  }

  const handleSelect = (categoryId: string) => {
    onValueChange(categoryId)
    closeDropdown()
  }

  const initiateCategoryCreation = () => {
    setNewName(searchQuery.trim() || 'Custom Category')
    setNewOffering('')
    setNewStatement('')
    setCreationError(null)
    setIsCreating(true)
    window.setTimeout(() => {
      offeringInputRef.current?.focus()
    }, 0)
  }

  const handleCreateCategory = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCreationError(null)

    const name = newName.trim()
    const offering = newOffering.trim()
    const statement = newStatement.trim()

    if (!name || !offering || !statement) {
      setCreationError('All fields (Name, Offering, Statement) are required.')
      return
    }

    try {
      const newCat = await createMutation.mutateAsync({
        name,
        offering,
        statement,
      })

      if (newCat?.id) {
        onValueChange(newCat.id)
      }
      closeDropdown()
    } catch (err) {
      setCreationError(err instanceof Error ? err.message : 'Failed to create category.')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        openDropdown()
      }
      return
    }

    if (isCreating) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsCreating(false)
        searchInputRef.current?.focus()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (filteredCategories.length > 0) {
          const hasCreateOption = searchQuery.trim().length > 0
          const maxCount = filteredCategories.length + (hasCreateOption ? 1 : 0)
          setHighlightedIndex((prev) => (prev + 1) % maxCount)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (filteredCategories.length > 0) {
          const hasCreateOption = searchQuery.trim().length > 0
          const maxCount = filteredCategories.length + (hasCreateOption ? 1 : 0)
          setHighlightedIndex((prev) => (prev - 1 + maxCount) % maxCount)
        }
        break
      case 'Enter':
        e.preventDefault()
        {
          const hasCreateOption = searchQuery.trim().length > 0
          if (highlightedIndex === filteredCategories.length && hasCreateOption) {
            initiateCategoryCreation()
          } else if (filteredCategories[highlightedIndex]) {
            handleSelect(filteredCategories[highlightedIndex].id)
          }
        }
        break
      case 'Escape':
        e.preventDefault()
        closeDropdown()
        break
      case 'Tab':
        closeDropdown()
        break
    }
  }

  const panel = isOpen && panelPosition
    ? createPortal(
        <div
          ref={panelRef}
          role="listbox"
          aria-label="Categories"
          className={cn(
            'fixed z-[100] rounded-lg border border-border/80 bg-popover/95 p-1 shadow-lg backdrop-blur-md',
            'duration-150 animate-in fade-in-0 slide-in-from-top-2',
          )}
          style={{
            top: panelPosition.top,
            left: panelPosition.left,
            width: panelPosition.width,
            maxHeight: panelPosition.maxHeight,
          }}
          onKeyDown={handleKeyDown}
        >
          {!isCreating ? (
            <div className="flex max-h-[inherit] flex-col overflow-hidden">
              <div className="flex items-center gap-1.5 border-b border-border/40 px-2 py-1.5">
                <HugeiconsIcon
                  icon={Search01Icon}
                  strokeWidth={2}
                  className="size-3.5 text-muted-foreground"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-0 bg-transparent p-0 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2.5} className="size-3" />
                  </button>
                )}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto py-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4 text-xs text-muted-foreground">
                    <HugeiconsIcon icon={Loading01Icon} className="mr-1.5 size-4 animate-spin" />
                    Loading categories...
                  </div>
                ) : isError ? (
                  <div className="px-2.5 py-2 text-xs text-destructive">
                    {fetchError instanceof Error ? fetchError.message : 'Error loading categories.'}
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="px-2.5 py-3 text-center text-xs text-muted-foreground">
                    No matching categories found.
                  </div>
                ) : (
                  filteredCategories.map((category, index) => {
                    const isSelected = category.id === value
                    const isHighlighted = index === highlightedIndex

                    return (
                      <button
                        key={category.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(category.id)}
                        className={cn(
                          'relative flex w-full cursor-pointer select-none items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs outline-none transition-colors',
                          isHighlighted
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted/80',
                          isSelected && !isHighlighted && 'bg-accent/30 font-medium text-foreground',
                        )}
                      >
                        <span className="truncate pr-4">{category.name}</span>
                        {isSelected && (
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            strokeWidth={2.5}
                            className={cn(
                              'size-3.5 shrink-0',
                              isHighlighted ? 'text-primary-foreground' : 'text-primary',
                            )}
                          />
                        )}
                      </button>
                    )
                  })
                )}
              </div>

              {searchQuery.trim().length > 0 && (
                <div className="border-t border-border/40 p-1">
                  <button
                    type="button"
                    onClick={initiateCategoryCreation}
                    className={cn(
                      'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-medium text-primary transition-colors hover:bg-primary/10',
                      highlightedIndex === filteredCategories.length &&
                        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                    )}
                  >
                    <HugeiconsIcon icon={Add01Icon} strokeWidth={2.5} className="size-3.5" />
                    <span className="truncate">Create category "{searchQuery.trim()}"</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex max-h-[inherit] flex-col gap-2 overflow-y-auto p-2.5 duration-200 animate-in fade-in-0 slide-in-from-right-3">
              <div className="mb-1 flex items-center justify-between border-b border-border/40 pb-2">
                <span className="max-w-[200px] truncate text-xs font-semibold text-foreground">
                  New Category: {newName}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5 py-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Offering <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    ref={offeringInputRef}
                    required
                    rows={2}
                    value={newOffering}
                    onChange={(e) => setNewOffering(e.target.value)}
                    placeholder="What your business sells (e.g. Enterprise SaaS platform for HR onboarding)"
                    className={cn(
                      'w-full resize-none rounded-md border border-input bg-transparent px-2.5 py-1.5 text-xs transition-all outline-none',
                      'placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring',
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Ideal Fit Statement <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newStatement}
                    onChange={(e) => setNewStatement(e.target.value)}
                    placeholder="What a good-fit lead looks like (e.g. Mid-sized technology companies in North America with 100-500 employees)"
                    className={cn(
                      'w-full resize-none rounded-md border border-input bg-transparent px-2.5 py-1.5 text-xs transition-all outline-none',
                      'placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring',
                    )}
                  />
                </div>
              </div>

              {creationError && (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-2 py-1.5 text-[10px] leading-tight text-destructive">
                  {creationError}
                </div>
              )}

              <div className="mt-1 flex justify-end gap-1.5 border-t border-border/40 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(false)}
                  disabled={createMutation.isPending}
                  className="h-7 px-2.5 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={createMutation.isPending || !newOffering.trim() || !newStatement.trim()}
                  onClick={(e) => void handleCreateCategory(e)}
                  className="h-7 bg-primary px-2.5 text-xs text-primary-foreground hover:bg-primary/90"
                >
                  {createMutation.isPending ? (
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={Loading01Icon} strokeWidth={2} className="size-3 animate-spin" />
                      Saving…
                    </div>
                  ) : (
                    'Create & Select'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>,
        document.body,
      )
    : null

  return (
    <div className="w-full">
      <button
        ref={triggerRef}
        id="create-lead-category"
        type="button"
        disabled={disabled || isLoading}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-left text-xs transition-all outline-none select-none',
          'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isOpen && 'border-ring bg-input/20 ring-2 ring-ring/30',
        )}
      >
        <span className={cn('block truncate', !selectedCategory && 'text-muted-foreground')}>
          {selectedCategory ? selectedCategory.name : 'Select category'}
        </span>
        <HugeiconsIcon
          icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
          strokeWidth={2}
          className="size-3.5 shrink-0 text-muted-foreground transition-transform"
        />
      </button>

      {panel}
    </div>
  )
}
