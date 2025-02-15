import { createSlice } from "@reduxjs/toolkit";

// appApi //that will communicate with redux
//as well as our backend
import appApi from "../services/appApi";


const initialState = null;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        //will set user to initialState 
        logout: () => initialState,
        //will add notification in user state
        addNotification: (state, action) => {
            //unshift means pushing from the front of the array
            state.notifications.unshift(action.payload);
        },
        resetNotifications: (state) => {
            state.notifications.forEach((obj) => {
                obj.status = "read";
            });
        },
    },
    //it will match our app api and listen to events
    extraReducers: (builder) => {
        //setting the new user as payload //assigning payload data to 'user' state
        builder.addMatcher(appApi.endpoints.signup.matchFulfilled, (_, { payload }) => payload);
        builder.addMatcher(appApi.endpoints.login.matchFulfilled, (_, { payload }) => payload);
        builder.addMatcher(appApi.endpoints.addToCart.matchFulfilled, (_, { payload }) => payload);
        builder.addMatcher(appApi.endpoints.removeFromCart.matchFulfilled, (_, { payload }) => payload);
        builder.addMatcher(appApi.endpoints.increaseCartProduct.matchFulfilled, (_, { payload }) => payload);
        builder.addMatcher(appApi.endpoints.decreaseCartProduct.matchFulfilled, (_, { payload }) => payload);
        builder.addMatcher(appApi.endpoints.createOrder.matchFulfilled, (_, { payload }) => payload);
    },
});
//action creators are generated for each reducer functions
export const { logout, addNotification, resetNotifications } = userSlice.actions;
export default userSlice.reducer;
