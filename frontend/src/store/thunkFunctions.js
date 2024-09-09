import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (body,thunkAPI) => {
        try {
            const response = await axiosInstance.post(
                `/users/register`,
                body
            )
            return response.data;
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

//페이지를 움길때 마다 작동(App.jsx에서 호출)
export const authUser = createAsyncThunk( 
    "user/authUser",
    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.get(
                `/users/auth`,
            )
            return response.data; //action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (body,thunkAPI) => {
        
        try {
            const response = await axiosInstance.post(
                `/users/login`,
                body //email, password가 있음
            )
            return response.data; //action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.post(
                `/users/logout`,
            )
            return response.data; //action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);