/**
 * Buổi 1 — TypeScript nâng cao
 * Bộ type dùng chung: generic, utility types, mapped types, type guard.
 */

/** Constraint cho generic thao tác theo id (slide findById<T extends HasId>). */
export interface HasId {
  id: string
}

export type Priority = 'low' | 'medium' | 'high'

export type AssignmentFilter = 'all' | 'incomplete' | 'overdue' | 'completed'

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface Assignment extends HasId {
  course: string
  title: string
  dueDate: string
  priority: Priority
  completed: boolean
}

/** Form thêm bài: không gửi id và completed — server/store tự sinh. */
export type CreateAssignmentDto = Omit<Assignment, 'id' | 'completed'>

/** Cập nhật từng phần: mọi field đều tuỳ chọn. */
export type UpdateAssignmentDto = Partial<Pick<Assignment, 'title' | 'dueDate' | 'priority' | 'completed' | 'course'>>

export type AssignmentPreview = Pick<Assignment, 'id' | 'title' | 'course' | 'dueDate'>

/** Utility type tự viết bằng mapped type (slide Nullable<T>). */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
}

export const FILTER_LABELS: Record<AssignmentFilter, string> = {
  all: 'Tất cả',
  incomplete: 'Chưa hoàn thành',
  overdue: 'Quá hạn',
  completed: 'Đã hoàn thành',
}

/** Generic bọc mọi API response — chỉ thay T theo dữ liệu. */
export interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

export interface Paginated<T> {
  items: T[]
  page: number
  total: number
}

/** Discriminated union: UI phân nhánh theo kind thay vì so sánh số ngày rải rác. */
export type DeadlineInfo =
  | { kind: 'remaining'; days: number }
  | { kind: 'overdue'; days: number }

export function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}

export function isPriority(value: string): value is Priority {
  return value === 'low' || value === 'medium' || value === 'high'
}

export function isAssignmentFilter(value: string): value is AssignmentFilter {
  return value === 'all' || value === 'incomplete' || value === 'overdue' || value === 'completed'
}

export function isOverdueDeadline(info: DeadlineInfo): info is Extract<DeadlineInfo, { kind: 'overdue' }> {
  return info.kind === 'overdue'
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getDeadlineInfo(dueDate: string, now: Date = new Date()): DeadlineInfo {
  const due = startOfDay(new Date(dueDate))
  const today = startOfDay(now)
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000)
  if (days < 0) {
    return { kind: 'overdue', days: Math.abs(days) }
  }
  return { kind: 'remaining', days }
}

export function formatDeadlineLabel(info: DeadlineInfo): string {
  if (isOverdueDeadline(info)) {
    return `Quá hạn ${info.days} ngày`
  }
  return `Còn ${info.days} ngày`
}

export function isAssignmentOverdue(assignment: Assignment, now: Date = new Date()): boolean {
  return !assignment.completed && getDeadlineInfo(assignment.dueDate, now).kind === 'overdue'
}

export function filterAssignments(
  items: Assignment[],
  filter: AssignmentFilter,
  now: Date = new Date(),
): Assignment[] {
  switch (filter) {
    case 'incomplete':
      return items.filter((item) => !item.completed)
    case 'completed':
      return items.filter((item) => item.completed)
    case 'overdue':
      return items.filter((item) => isAssignmentOverdue(item, now))
    default:
      return items
  }
}

/** Bài chưa xong có hạn nộp sớm nhất — dùng cho dòng cảnh báo đầu trang. */
export function getNearestOpenAssignment(items: Assignment[]): Assignment | undefined {
  return items
    .filter((item) => !item.completed)
    .slice()
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
}
