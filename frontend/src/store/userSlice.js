import {createSlice} from "@reduxjs/toolkit"
import { authUser, loginUser, logoutUser, registerUser } from "./thunkFunctions";
import { toast } from 'react-toastify';
import { Navigate } from "react-router-dom";

const initialState = {
    userData: {
        id: '',
        email:'',
        name:'',
        role: 0,
        image:'',
    },
    isAuth: false,
    isLoading: false,
    error: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState, //이게 state
    reducers: {},
    extraReducers: (builder) => {
        builder

          //회원가입
          .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(registerUser.fulfilled, (state) => {
            state.isLoading = false;
            toast.info('회원가입을 성공했습니다.');
          })
          .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
          })

          //로그인
          .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(loginUser.fulfilled, (state, action) => { // action에는 비동기로 받은 결과값이 들어있음
            state.isLoading = false;
            state.userData = action.payload;
            state.isAuth = true;
            localStorage.setItem('accessToken', action.payload.accessToken); //자바스크립트 기본기능
            toast.info('로그인을 성공했습니다.');
          })
          .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            toast.error(action.payload);
          })

          //로그인 인증검사
          .addCase(authUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(authUser.fulfilled, (state, action) => { // action에는 비동기로 받은 결과값이 들어있음
            state.isLoading = false;
            state.userData = action.payload;
            state.isAuth = true;
          })
          .addCase(authUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.userData = initialState.userData;
            state.isAuth = false;
            localStorage.removeItem('accessToken');
          })

          //로그아웃
          .addCase(logoutUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(logoutUser.fulfilled, (state, action) => { // action에는 비동기로 받은 결과값이 들어있음
            state.isLoading = false;
            state.userData = initialState.userData;
            state.isAuth = false;
            localStorage.removeItem('accessToken'); //자바스크립트 기본기능
          })
          .addCase(logoutUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isAuth = false;
          })
    }
})

export default userSlice.reducer;