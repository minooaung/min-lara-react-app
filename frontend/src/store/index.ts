import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./auth";
import notiReducer from "./notification";
import { RootState } from "./types";

const store = configureStore({
  reducer: { auth: authReducer, notification: notiReducer },
});

export type AppDispatch = typeof store.dispatch;

// Export hooks that can be reused throughout app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store; 