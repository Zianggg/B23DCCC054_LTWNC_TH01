import type { ApiResponse, Assignment, Paginated } from '../../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * API giả lập — khi khởi động app lấy danh sách mẫu.
 * Trả về đúng generic ApiResponse<Paginated<Assignment>> như slide Buổi 1.
 */
const SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    course: 'Lập trình web nâng cao',
    title: 'Bài thực hành 01: Student Deadline Tracker',
    dueDate: '2026-09-25',
    priority: 'high',
    completed: false,
  },
  {
    id: 'asg-02',
    course: 'Cơ sở dữ liệu',
    title: 'Báo cáo nhóm: thiết kế lược đồ quan hệ',
    dueDate: '2026-09-20',
    priority: 'high',
    completed: false,
  },
  {
    id: 'asg-03',
    course: 'Mạng máy tính',
    title: 'Bài lab 03: định tuyến tĩnh',
    dueDate: '2026-09-28',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'asg-04',
    course: 'Toán rời rạc',
    title: 'Bài tập chương 4: quan hệ và hàm',
    dueDate: '2026-09-18',
    priority: 'low',
    completed: true,
  },
  {
    id: 'asg-05',
    course: 'Lập trình web nâng cao',
    title: 'Ôn tập Buổi 3: Redux Toolkit',
    dueDate: '2026-09-22',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'asg-06',
    course: 'Tiếng Anh chuyên ngành',
    title: 'Bài luận 400 từ: đạo văn học thuật',
    dueDate: '2026-10-05',
    priority: 'low',
    completed: false,
  },
]

export async function fetchAssignmentsApi(): Promise<ApiResponse<Paginated<Assignment>>> {
  await delay(650)
  return {
    statusCode: 200,
    message: 'Lấy danh sách bài tập mẫu thành công',
    data: {
      items: SAMPLE_ASSIGNMENTS,
      page: 1,
      total: SAMPLE_ASSIGNMENTS.length,
    },
  }
}
