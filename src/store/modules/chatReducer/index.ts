import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

export interface Chat {
  activeKey: string
  conversations: {
    key: string
    label: string
  }[]
  messages: {
    id: string
    message: string
    status: 'local' | 'ai' | 'loading' | 'error'
  }[]
}

const INIT_STATE: Chat = {
  activeKey: nanoid(),
  conversations: [],
  messages: []
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: INIT_STATE,
  reducers: {
    setActiveKey(state, action: PayloadAction<string>) {
      state.activeKey = action.payload
    }
  }
})

export const { setActiveKey } = chatSlice.actions

export default chatSlice.reducer
