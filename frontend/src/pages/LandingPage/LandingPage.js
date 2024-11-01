import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextInput from '../../components/Input/TextInput';
import NumberInputBasic from '../../components/Input/NumberInput';
import DateInput from '../../components/Input/DataInput';
import { logoutUser } from '../../store/thunkFunctions';
import TimeInput from '../../components/Input/TimeInput';
import PhoneInput from '../../components/Input/PhoneInput';
import MenuInput from '../../components/Input/MenuInput';
import TableType from '../../components/Input/TableType';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      width: '100%', padding: '20px', boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '600px', width: '100%', border: '1px solid #ddd', padding: '20px',
        borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ textAlign: 'center' }}>예약 시스템</h2>

        <section className="personal-info">
          <h3>예약자 정보:</h3>
          <div className="input-field" style={{ marginBottom: '16px' }}>
            <label>소속:</label>
            <TextInput placeholder="Ex: 24연대" />
          </div>
          <div className="input-field" style={{ marginBottom: '16px' }}>
            <label>계급:</label>
            <TextInput placeholder="Ex: 하사" />
          </div>
          <div className="input-field" style={{ marginBottom: '16px' }}>
            <label>성명:</label>
            <TextInput placeholder="Ex: 홍길동" />
          </div>
          <div className="input-field" style={{ marginBottom: '25px' }}>
            <label>연락처:</label>
            <PhoneInput />
          </div>
          <div className="input-field" style={{ marginBottom: '16px'}}>
            <label>테이블 선택:</label>
            <TableType />
          </div>
          <div className="input-field" style={{ marginBottom: '16px' }}>
            <label>인원 수:</label>
            <NumberInputBasic />
          </div>
          <div className="input-field" style={{ marginBottom: '16px' }}>
            <label>메뉴:</label>
            <MenuInput />
          </div>
          <div className="input-field" style={{ marginBottom: '16px' }}>
            <label>예약일자:</label>
            <DateInput />
          </div>
          <div className="input-field" style={{ marginBottom: '16px' }}>
            <label>예약시간:</label><br/>
            <TimeInput />
          </div>
         
          
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button variant="contained">예약하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
