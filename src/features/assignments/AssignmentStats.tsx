import { formatDeadlineLabel, getDeadlineInfo, type Assignment, type AssignmentFilter } from '../../types'

interface AssignmentStatsProps {
  counts: {
    all: number
    incomplete: number
    overdue: number
    completed: number
  }
  nearest?: Assignment
  loading?: boolean
  onSelect: (filter: AssignmentFilter) => void
}

export function AssignmentStats({ counts, nearest, loading = false, onSelect }: AssignmentStatsProps) {
  const onTime = Math.max(counts.incomplete - counts.overdue, 0)
  const percent = counts.all === 0 ? 0 : Math.round((counts.completed / counts.all) * 100)
  const nearestInfo = nearest ? getDeadlineInfo(nearest.dueDate) : null

  const segments = [
    { key: 'completed' as const, label: 'Đã hoàn thành', value: counts.completed, tone: 'is-done' },
    { key: 'incomplete' as const, label: 'Còn hạn', value: onTime, tone: 'is-open' },
    { key: 'overdue' as const, label: 'Quá hạn', value: counts.overdue, tone: 'is-late' },
  ]

  return (
    <section className="summary" aria-label="Thống kê bài tập">
      <div className="summary__figure">
        <p className="summary__percent">
          {loading ? '—' : percent}
          <span>%</span>
        </p>
        <p className="summary__caption">
          {loading ? 'đang tải dữ liệu' : `hoàn thành, ${counts.completed}/${counts.all} bài`}
        </p>
      </div>

      <div className="summary__chart">
        <div className="summary__bar">
          {counts.all === 0 ? (
            <span className="summary__seg is-empty" />
          ) : (
            segments.map((segment) =>
              segment.value > 0 ? (
                <button
                  key={segment.key}
                  type="button"
                  className={`summary__seg ${segment.tone}`}
                  style={{ flexGrow: segment.value }}
                  title={`${segment.label}: ${segment.value}`}
                  onClick={() => onSelect(segment.key)}
                >
                  <span className="visually-hidden">
                    Lọc {segment.label}, {segment.value} bài
                  </span>
                </button>
              ) : null,
            )
          )}
        </div>

        <ul className="summary__legend">
          {segments.map((segment) => (
            <li key={segment.key}>
              <button type="button" className="summary__legend-btn" onClick={() => onSelect(segment.key)}>
                <i className={`summary__dot ${segment.tone}`} aria-hidden="true" />
                {segment.label}
                <strong>{segment.value}</strong>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={`summary__next ${loading ? 'is-idle' : nearestInfo ? `is-${nearestInfo.kind}` : 'is-clear'}`}>
        <p className="summary__next-label">Hạn gần nhất</p>
        {loading ? (
          <p className="summary__next-title">Đang tải…</p>
        ) : nearest && nearestInfo ? (
          <>
            <p className="summary__next-title">{nearest.title}</p>
            <p className="summary__next-meta">
              {nearest.course} — {formatDeadlineLabel(nearestInfo)}
            </p>
          </>
        ) : (
          <p className="summary__next-title">Không còn bài chưa hoàn thành</p>
        )}
      </div>
    </section>
  )
}
