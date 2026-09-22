import { createContext, useContext, type ReactNode } from 'react'
import { FILTER_LABELS, type AssignmentFilter } from '../../types'

/**
 * Compound Component (Buổi 2) — cùng pattern Tabs trên slide:
 * FilterTabs + FilterTabs.List + FilterTabs.Tab chia sẻ state qua Context.
 */
interface FilterTabsContextValue {
  value: AssignmentFilter
  setValue: (next: AssignmentFilter) => void
}

const FilterTabsContext = createContext<FilterTabsContextValue | null>(null)

function useFilterTabsContext() {
  const ctx = useContext(FilterTabsContext)
  if (!ctx) {
    throw new Error('FilterTabs.* phải nằm trong <FilterTabs>')
  }
  return ctx
}

interface FilterTabsProps {
  value: AssignmentFilter
  onChange: (next: AssignmentFilter) => void
  children: ReactNode
}

function FilterTabs({ value, onChange, children }: FilterTabsProps) {
  return (
    <FilterTabsContext.Provider value={{ value, setValue: onChange }}>
      <div className="filter-tabs">{children}</div>
    </FilterTabsContext.Provider>
  )
}

function List({ children }: { children: ReactNode }) {
  return (
    <div className="filter-tabs__list" role="tablist" aria-label="Lọc theo trạng thái">
      {children}
    </div>
  )
}

interface TabProps {
  value: AssignmentFilter
  count?: number
  children?: ReactNode
}

function Tab({ value, count, children }: TabProps) {
  const { value: active, setValue } = useFilterTabsContext()
  const selected = active === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={selected ? 'filter-tabs__tab is-active' : 'filter-tabs__tab'}
      onClick={() => setValue(value)}
    >
      <span>{children ?? FILTER_LABELS[value]}</span>
      {typeof count === 'number' ? <em>{count}</em> : null}
    </button>
  )
}

FilterTabs.List = List
FilterTabs.Tab = Tab

export { FilterTabs }
