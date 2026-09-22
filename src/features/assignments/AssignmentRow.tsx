import { useAppDispatch } from '../../app/hooks'
import { CheckIcon, TrashIcon, UndoIcon } from '../../shared/icons'
import { PRIORITY_LABELS, type Assignment } from '../../types'
import { removeAssignment, toggleComplete } from './assignmentsSlice'
import { useDeadline } from './useDeadline'

interface AssignmentRowProps {
  assignment: Assignment
}

export function AssignmentRow({ assignment }: AssignmentRowProps) {
  const dispatch = useAppDispatch()
  const deadline = useDeadline(assignment.dueDate)
  const due = new Date(assignment.dueDate)
  const late = deadline.kind === 'overdue' && !assignment.completed

  return (
    <article
      className={[
        'row',
        `row--${assignment.priority}`,
        assignment.completed ? 'is-done' : '',
        late ? 'is-late' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="row__cell row__course">
        <span className="row__label">Môn học</span>
        {assignment.course}
      </div>

      <div className="row__cell row__main">
        <span className="row__label">Bài tập</span>
        <h3 className="row__title">{assignment.title}</h3>
        {assignment.completed ? <p className="row__done">Đã hoàn thành</p> : null}
      </div>

      <div className="row__cell row__priority">
        <span className="row__label">Ưu tiên</span>
        <span className="tag">
          <i aria-hidden="true" />
          {PRIORITY_LABELS[assignment.priority]}
        </span>
      </div>

      <div className="row__cell row__due">
        <span className="row__label">Hạn nộp</span>
        <time dateTime={assignment.dueDate}>{due.toLocaleDateString('vi-VN')}</time>
      </div>

      <div className={`row__cell row__countdown is-${assignment.completed ? 'settled' : deadline.kind}`}>
        <span className="row__label">Thời gian</span>
        {deadline.kind === 'overdue' ? (
          <p>
            Quá hạn <strong>{deadline.days}</strong> ngày
          </p>
        ) : (
          <p>
            Còn <strong>{deadline.days}</strong> ngày
          </p>
        )}
      </div>

      <div className="row__cell row__actions">
        <button
          type="button"
          className={`icon-btn ${assignment.completed ? 'icon-btn--undo' : 'icon-btn--done'}`}
          aria-label={assignment.completed ? `Mở lại ${assignment.title}` : `Đánh dấu hoàn thành ${assignment.title}`}
          title={assignment.completed ? 'Mở lại' : 'Đánh dấu hoàn thành'}
          onClick={() => dispatch(toggleComplete(assignment.id))}
        >
          {assignment.completed ? <UndoIcon /> : <CheckIcon />}
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          aria-label={`Xóa ${assignment.title}`}
          title="Xóa"
          onClick={() => dispatch(removeAssignment(assignment.id))}
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  )
}
