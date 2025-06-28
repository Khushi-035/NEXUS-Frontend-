import { createSlice } from '@reduxjs/toolkit'

export const empSlice = createSlice({
    name: 'empdetails',
    initialState: {     // init state of the var
        value: null,
    },
    reducers: {
        setEmpName: (state, action) => {
            state.value = action.payload
        },
        rmEmpName: (state) => {
            state.value = null
        }
    },
})

export const { setEmpName, rmEmpName } = empSlice.actions

export const selectEmp = (state) => state.empdetails.value;

export default empSlice.reducer