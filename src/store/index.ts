//1.引入configureStore
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import logger from 'redux-logger'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import chat from './modules/chatReducer'

// 持久化配置
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['chat']
}

// 合并模块
const reducers = combineReducers({
  chat
})

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // 避免由于使用 Immutable.js 而引发的序列化检查错误
    }).concat(logger),
  devTools: true
})

const persistor = persistStore(store)

export { store, persistor }

export type RootState = ReturnType<typeof reducers>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
