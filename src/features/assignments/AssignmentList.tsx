import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { ReloadIcon } from '../../shared/icons'
import { FILTER_LABELS } from '../../types'
import { fetchAssignments } from './assignmentsSlice'
import { AssignmentRow } from './AssignmentRow'
import { useFilteredAssignments } from './useFilteredAssignments'

export function AssignmentList() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.assignments.status)
  const error = useAppSelector((state) => state.assignments.error)
  const { visible, filter } = useFilteredAssignments()

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="state" role="status">
        <p>Đang tải danh sách bài tập…</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="state state--error" role="alert">
        <p>{error ?? 'Không tải được danh sách bài tập.'}</p>
        <button type="button" className="btn btn--primary" onClick={() => void dispatch(fetchAssignments())}>
          <ReloadIcon />
          Tải lại
        </button>
      </div>
    )
  }

  if (visible.length === 0) {
    return (
      <div className="state">
        <p>
          {filter === 'all'
            ? 'Chưa có bài tập nào. Bấm Thêm bài tập để tạo bài đầu tiên.'
            : `Không có bài tập ở mục ${FILTER_LABELS[filter]}. Chọn bộ lọc khác để xem các bài còn lại.`}
        </p>
      </div>
    )
  }

  return (
    <div className="table">
      <div className="table__head" aria-hidden="true">
        <span>Môn học</span>
        <span>Bài tập</span>
        <span>Ưu tiên</span>
        <span>Hạn nộp</span>
        <span>Thời gian</span>
        <span>Thao tác</span>
      </div>
      {visible.map((assignment) => (
        <AssignmentRow key={assignment.id} assignment={assignment} />
      ))}
    </div>
  )
}
