import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { CloseIcon, PlusIcon, ReloadIcon } from '../../shared/icons'
import { AssignmentForm } from './AssignmentForm'
import { AssignmentList } from './AssignmentList'
import { AssignmentStats } from './AssignmentStats'
import { FilterTabs } from './FilterTabs'
import { fetchAssignments, setFilter } from './assignmentsSlice'
import { useFilteredAssignments } from './useFilteredAssignments'

function formatToday() {
  return new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function AssignmentsPage() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.assignments.status)
  const { counts, filter, nearest } = useFilteredAssignments()
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchAssignments())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (!formOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFormOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [formOpen])

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="masthead__intro">
          <h1>Deadline Tracker</h1>
          <p>Theo dõi hạn nộp bài tập của riêng bạn, trước khi đến hạn.</p>
        </div>

        <div className="masthead__side">
          <dl className="masthead__meta">
            <div>
              <dt>Sinh viên</dt>
              <dd>B23DCCC054</dd>
            </div>
            <div>
              <dt>Học phần</dt>
              <dd>Lập trình web nâng cao (RIPT1411)</dd>
            </div>
            <div>
              <dt>Hôm nay</dt>
              <dd>{formatToday()}</dd>
            </div>
          </dl>

          <div className="masthead__actions">
            <button
              type="button"
              className="btn btn--quiet"
              onClick={() => void dispatch(fetchAssignments())}
              disabled={status === 'loading'}
            >
              <ReloadIcon />
              {status === 'loading' ? 'Đang tải' : 'Tải lại'}
            </button>
            <button type="button" className="btn btn--primary" onClick={() => setFormOpen(true)}>
              <PlusIcon />
              Thêm bài tập
            </button>
          </div>
        </div>
      </header>

      <main className="board">
        <AssignmentStats
          counts={counts}
          nearest={nearest}
          loading={status === 'loading' || status === 'idle'}
          onSelect={(next) => dispatch(setFilter(next))}
        />

        <div className="board__toolbar">
          <h2 id="ledger-heading">Danh sách bài tập</h2>
          <FilterTabs value={filter} onChange={(next) => dispatch(setFilter(next))}>
            <FilterTabs.List>
              <FilterTabs.Tab value="all" count={counts.all} />
              <FilterTabs.Tab value="incomplete" count={counts.incomplete} />
              <FilterTabs.Tab value="overdue" count={counts.overdue} />
              <FilterTabs.Tab value="completed" count={counts.completed} />
            </FilterTabs.List>
          </FilterTabs>
        </div>

        <section aria-labelledby="ledger-heading">
          <AssignmentList />
        </section>
      </main>

      {formOpen ? (
        <div className="modal">
          <button type="button" className="modal__backdrop" aria-label="Đóng cửa sổ" onClick={() => setFormOpen(false)} />
          <div className="modal__panel" role="dialog" aria-modal="true" aria-labelledby="add-form-title">
            <button type="button" className="icon-btn modal__close" aria-label="Đóng" onClick={() => setFormOpen(false)}>
              <CloseIcon />
            </button>
            <AssignmentForm onSuccess={() => setFormOpen(false)} onCancel={() => setFormOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
