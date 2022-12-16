import { configureStore } from '@reduxjs/toolkit'
import rootSaga from "./rootSaga"
import rootReducer from './reducers'
import createSagaMiddleware from "@redux-saga/core"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [sagaMiddleware]
})

sagaMiddleware.run(rootSaga)

export const persistStorage = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>

export default store;