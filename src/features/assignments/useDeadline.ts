import { useMemo } from 'react'
import { formatDeadlineLabel, getDeadlineInfo, type DeadlineInfo } from '../../types'

/** Hook nghiệp vụ: tính "Còn X ngày" / "Quá hạn Y ngày" từ hạn nộp. */
export function useDeadline(dueDate: string): DeadlineInfo & { label: string } {
  return useMemo(() => {
    const info = getDeadlineInfo(dueDate)
    return { ...info, label: formatDeadlineLabel(info) }
  }, [dueDate])
}
