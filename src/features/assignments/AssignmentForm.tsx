import { useState, type FormEvent } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { useForm } from '../../shared/hooks/useForm'
import { PRIORITY_LABELS, isPriority, type CreateAssignmentDto, type Priority } from '../../types'
import { addAssignment } from './assignmentsSlice'

const INITIAL_FORM: CreateAssignmentDto = {
  course: '',
  title: '',
  dueDate: '',
  priority: 'medium',
}

type FormErrors = Partial<Record<keyof CreateAssignmentDto, string>>

interface AssignmentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AssignmentForm({ onSuccess, onCancel }: AssignmentFormProps) {
  const dispatch = useAppDispatch()
  const { values, setField, reset } = useForm<CreateAssignmentDto>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!values.course.trim()) next.course = 'Nhập tên môn học.'
    if (!values.title.trim()) next.title = 'Nhập tên bài tập.'
    if (!values.dueDate) next.dueDate = 'Chọn hạn nộp.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    dispatch(
      addAssignment({
        course: values.course.trim(),
        title: values.title.trim(),
        dueDate: values.dueDate,
        priority: values.priority,
      }),
    )
    reset()
    setErrors({})
    onSuccess?.()
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <header className="form__head">
        <h2 id="add-form-title">Thêm bài tập</h2>
        <p>Bài tập mới sẽ nằm ở đầu danh sách và được tính vào thống kê.</p>
      </header>

      <label className="field">
        <span className="field__label">Môn học</span>
        <input
          type="text"
          name="course"
          placeholder="Lập trình web nâng cao"
          aria-invalid={Boolean(errors.course)}
          value={values.course}
          onChange={(e) => setField('course', e.target.value)}
        />
        {errors.course ? <small className="field__error">{errors.course}</small> : null}
      </label>

      <label className="field">
        <span className="field__label">Tên bài tập</span>
        <input
          type="text"
          name="title"
          placeholder="Bài thực hành 01"
          aria-invalid={Boolean(errors.title)}
          value={values.title}
          onChange={(e) => setField('title', e.target.value)}
        />
        {errors.title ? <small className="field__error">{errors.title}</small> : null}
      </label>

      <div className="form__row">
        <label className="field">
          <span className="field__label">Hạn nộp</span>
          <input
            type="date"
            name="dueDate"
            aria-invalid={Boolean(errors.dueDate)}
            value={values.dueDate}
            onChange={(e) => setField('dueDate', e.target.value)}
          />
          {errors.dueDate ? <small className="field__error">{errors.dueDate}</small> : null}
        </label>

        <label className="field">
          <span className="field__label">Mức ưu tiên</span>
          <select
            name="priority"
            value={values.priority}
            onChange={(e) => {
              if (isPriority(e.target.value)) {
                setField('priority', e.target.value as Priority)
              }
            }}
          >
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map((key) => (
              <option key={key} value={key}>
                {PRIORITY_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form__actions">
        {onCancel ? (
          <button type="button" className="btn btn--quiet" onClick={onCancel}>
            Hủy
          </button>
        ) : null}
        <button type="submit" className="btn btn--primary">
          Thêm bài tập
        </button>
      </div>
    </form>
  )
}
