import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

//createAsyncThunk로 만든것은 알아서 extraReducers를 찾아서 결과를 반환한다.


// 예약 생성
export const createReservation = createAsyncThunk(
    'reservation/createReservation',
    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/reservations/create', body);
            return response.data; // action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

// 예약 목록 조회
export const fetchReservations = createAsyncThunk(
    'reservation/fetchReservations',
    async ({ startDate, endDate, statusFilter }, thunkAPI) => {
        try {
            const response = await axiosInstance.get('/reservations', {
                params: { startDate, endDate, statusFilter } // 필터링 파라미터 전달
            });
            return response.data; // 필터링된 예약 목록을 반환
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

// 예약 수정
export const updateReservation = createAsyncThunk(
    'reservation/updateReservation',
    async ({ id, body }, thunkAPI) => {
        try {
            const response = await axiosInstance.put(`/reservations/${id}`, body);
            return response.data; // action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

// 예약 삭제
export const deleteReservation = createAsyncThunk(
    'reservation/deleteReservation',
    async (id, thunkAPI) => {
        try {
            const response = await axiosInstance.delete(`/reservations/${id}`);
            return response.data; // action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

// 이름과 연락처로 예약 리스트를 가져오는 액션
export const fetchReservationList = createAsyncThunk(
    'reservation/fetchReservationList',
    async ({ searchName, searchContact }, thunkAPI) => {
        try {
            //console.log('searchName: ' + searchName);
            const response = await axiosInstance.post('/reservations/search', { searchName, searchContact });  // POST 방식으로 body에 전달
            //console.log('response', response);
            // 서버 응답 상태가 성공적이면 데이터 반환
            if (response.status === 200) {
                return response.data;  // 서버로부터 받은 예약 리스트 데이터
            } else {
                throw new Error('예약 데이터를 가져오는 데 실패했습니다.');
            }
        } catch (err) {
            // 에러 발생 시 에러 메시지 반환
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);