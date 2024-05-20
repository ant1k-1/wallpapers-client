import { combineReducers } from "redux";
import { configureStore } from '@reduxjs/toolkit';
import agreementReducer from "./reducers/agreement";
import userReducer from "./reducers/UserSlice";

const rootReducer = combineReducers({
    agreement: agreementReducer,
    user: userReducer,
});

export const store = configureStore({ reducer: rootReducer });