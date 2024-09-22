import "@mui/material/styles/styled";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import authReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

// create store with persisted reducer
const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Render the app to the root element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Provide the Redux store to the app */}
    <Provider store={store}>
      {/* Persist the Redux store to local storage */}
      <PersistGate loading={null} persistor={persistStore(store)}>
        {/* Render the App component */}
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
