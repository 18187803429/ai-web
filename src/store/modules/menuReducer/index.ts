import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const INIT_STATE = {
  selMenuIdx: 0
}

const userSlice = createSlice({
  name: 'menu',
  initialState: INIT_STATE,
  reducers: {
    setMenuIdx(state, action: PayloadAction<number>) {
      state.selMenuIdx = action.payload
    }
  }
})

export const { setMenuIdx } = userSlice.actions

export default userSlice.reducer
