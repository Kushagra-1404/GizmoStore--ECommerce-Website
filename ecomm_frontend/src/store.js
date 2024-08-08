import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./features/productSlice";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";

//persit our store
//so that user and products details remain stored in our local storage
//even on refreshing the page or even if we close the page and come back
//so that we don't have to login again
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import {thunk} from "redux-thunk";

//reducers
//combining reducers into one object
const reducer = combineReducers({
    user: userSlice,
    products: productSlice,
    //changing state
    [appApi.reducerPath]: appApi.reducer,
});

const persistConfig = {
    key: "root",
    storage,
    blackList: [appApi.reducerPath, "products"],
};

// persist our store
const persistedReducer = persistReducer(persistConfig, reducer);

// creating the store

const store = configureStore({
    reducer: persistedReducer,
    middleware: ()=>([thunk, appApi.middleware]),
});

export default store;
