import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Assignment, AssignmentFilter, AsyncStatus, CreateAssignmentDto } from '../../types'
import { fetchAssignmentsApi } from './assignmentsApi'

interface AssignmentsState {
  items: Assignment[]
  status: AsyncStatus
  error: string | null
  filter: AssignmentFilter
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
}

/** createAsyncThunk<ReturnType, ArgType> — slide Buổi 3. */
export const fetchAssignments = createAsyncThunk<Assignment[], void>(
  'assignments/fetchAll',
  async () => {
    const response = await fetchAssignmentsApi()
    return response.data.items
  },
)

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment(state, action: PayloadAction<CreateAssignmentDto>) {
      const next: Assignment = {
        ...action.payload,
        id: crypto.randomUUID(),
        completed: false,
      }
      state.items.unshift(next)
    },
    toggleComplete(state, action: PayloadAction<string>) {
      const found = state.items.find((item) => item.id === action.payload)
      if (found) {
        found.completed = !found.completed
      }
    },
    removeAssignment(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setFilter(state, action: PayloadAction<AssignmentFilter>) {
      state.filter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Không tải được danh sách bài tập'
      })
  },
})

export const { addAssignment, toggleComplete, removeAssignment, setFilter } = assignmentsSlice.actions
export default assignmentsSlice.reducer
