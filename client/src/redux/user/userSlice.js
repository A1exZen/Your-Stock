import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	currentUser: null,
	error: null,
	loading: false
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		loginStart: (state) => {
			state.loading = true
			state.error = null
		},
		loginSuccess: (state, action) => {
			state.currentUser = action.payload
			state.loading = false
			state.error = null
		},
		loginFailure: (state, action) => {
			state.loading = false
			state.error = action.payload
		},
		updateStart: (state) =>{
			state.loading = true
			state.error = null
		},
		updateSuccess: (state, action) =>{
			state.loading = false
			state.currentUser = action.payload
			state.error  = null
		},
		updateFailure: (state, action) => {
			state.loading = false
			state.error = action.payload
		},
		deleteStart: (state) =>{
			state.loading = true
			state.error = null
		},
		deleteSuccess: (state) =>{
			state.loading = false
			state.currentUser = null
			state.error  = null
		},
		deleteFailure: (state, action) => {
			state.loading = false
			state.error = action.payload
		},
		signOutSuccess: (state) => {
			state.currentUser = null
			state.error = null
			state.loading = false
		}
	}
})

export const { loginStart, loginSuccess, loginFailure, updateStart, updateSuccess, updateFailure, deleteStart, deleteFailure, deleteSuccess, signOutSuccess } = userSlice.actions;

export default userSlice.reducer