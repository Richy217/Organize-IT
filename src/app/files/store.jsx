import { configureStore } from '@reduxjs/toolkit'
import filesReducer from './filesSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, filesReducer)

// export default configureStore({
//   reducer: {
//     fileArray: filesReducer
//   }
// })

export const store = configureStore({
  reducer: {
    fileArray: persistedReducer
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)