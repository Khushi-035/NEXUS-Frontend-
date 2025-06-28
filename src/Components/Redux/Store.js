// redux import
import { configureStore } from "@reduxjs/toolkit";
// reducers from Slice page
import UserReducer from '../Features/UserAuth/UserSlice';
import empReducer from '../Features/EmpDetails/EmpSlice';

// for maintaining the states after reload
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persistUser = {
    key: "root",
    storage
}

// passing reducers to persist
const reducer1 = persistReducer(persistUser, UserReducer)
const reducer2 = persistReducer(persistUser, empReducer)

// passing reducers to store
export default configureStore({
    reducer: {
        user: reducer1,
        empdetails: reducer2
    },
});