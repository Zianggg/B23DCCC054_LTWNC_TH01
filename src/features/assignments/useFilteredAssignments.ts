import { useMemo } from 'react'
import { useAppSelector } from '../../app/hooks'
import { filterAssignments, getNearestOpenAssignment } from '../../types'

export function useFilteredAssignments() {
  const items = useAppSelector((state) => state.assignments.items)
  const filter = useAppSelector((state) => state.assignments.filter)

  const visible = useMemo(() => filterAssignments(items, filter), [items, filter])

  const counts = useMemo(
    () => ({
      all: items.length,
      incomplete: filterAssignments(items, 'incomplete').length,
      overdue: filterAssignments(items, 'overdue').length,
      completed: filterAssignments(items, 'completed').length,
    }),
    [items],
  )

  const nearest = useMemo(() => getNearestOpenAssignment(items), [items])

  return { visible, counts, filter, total: items.length, nearest }
}
