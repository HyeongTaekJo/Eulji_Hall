import React, { useEffect } from 'react'
import axiosInstance from '../../utils/axios';
import { logoutUser } from '../../store/thunkFunctions';
import {  useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';

const LandingPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()) 
    .then(() => { //여기가 끝나고 navigate 실행
      navigate('/login');
    })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center' , alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>시작 페이지</h2>

      <button onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  )
}

export default LandingPage
