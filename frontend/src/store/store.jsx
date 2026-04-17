import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddlware) => {
        return getDefaultMiddlware().concat(api.middleware);  // ← Added return
    }
}); 

