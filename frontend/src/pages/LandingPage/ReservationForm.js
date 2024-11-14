import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { createReservation } from '../../store/reservationThunks';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for date picker


const FormContainer = styled.div`
  max-width: 700px;
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;

  @media (max-width: 768px) {
    max-width: 500px;
  }

  @media (max-width: 576px) {
    max-width: 100%;
    padding: 15px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SmallInput = styled(Input)`
  flex-grow: 1;
  margin-right: 5px;
  
  @media (max-width: 576px) {
    width: auto;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

// 날짜 선택기 스타일
const CustomDatePicker = styled.input`
  padding: 10px 15px;
 
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 130px;
  background-color: #fff;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  height: 35px;
  
  &:focus {
    border-color: #007bff;
    background-color: #e9f7ff; /* 포커스 시 배경색 변경 */
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 포커스 시 그림자 추가 */
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0.8;
    cursor: pointer; /* 캘린더 아이콘 커서 */
  }
`;

const TableButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const TableButton = styled.button`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${({ selected }) => (selected ? '#007bff' : '#f8f9fa')};
  color: ${({ selected }) => (selected ? '#fff' : '#007bff')};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ selected }) => (selected ? '#0056b3' : '#e9f7ff')};
  }
`;

const MenuButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const MenuButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${({ selected }) => (selected ? '#007bff' : '#f8f9fa')};
  color: ${({ selected }) => (selected ? '#fff' : '#007bff')};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ selected }) => (selected ? '#0056b3' : '#e9f7ff')};
  }
`;



const generateTimeOptions = () => {
  const times = [];
  let currentHour = 10;
  let currentMinute = 0;

  while (currentHour < 22 || (currentHour === 22 && currentMinute === 0)) {
    const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    times.push(timeString);

    currentMinute += 30;
    if (currentMinute === 60) {
      currentMinute = 0;
      currentHour += 1;
    }
  }

  return times;
};

const ReservationForm = () => {
  const { register, handleSubmit, control, formState: { errors }, reset, setValue,watch,trigger  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const watchMenu = watch("menu", []); // "menu" 필드를 watch하여 선택된 메뉴 확인


  const today = new Date();
  const watchTableType = watch("tableType", "");

  const handleDateChange = (date) => {
    if (date) {
      // 선택된 날짜에서 시간을 제거하고, 날짜만 설정 (시간을 00:00:00으로 설정)
      const newDate = (new Date(date));
      newDate.setHours(0, 0, 0, 0);  // 시간 부분을 00:00:00으로 설정
      setValue('reservationDate', newDate); // 날짜 상태 업데이트
    }
  };

  const onSubmit = ({ affiliation, rank, name, contact1, contact2, contact3, tableType, peopleCount, menu, reservationDate, reservationTime }) => {
    const fullContact = `${contact1}-${contact2}-${contact3}`;

     // 예약일자를 'yyyy-MM-dd' 형식으로 변환
    let formattedDate = '';
    if (reservationDate) {
      const newDate = new Date(reservationDate);
      newDate.setDate(newDate.getDate() + 1); // +1일을 추가
      formattedDate = newDate.toISOString().split('T')[0]; // 'yyyy-MM-dd' 형식으로 변환
    }

      // menu가 문자열인 경우, 쉼표(,)를 기준으로 나누어 배열로 변환
      let processedMenu = [];
      if (typeof menu === 'string') {
        processedMenu = menu.split(',').map(item => item.trim()); // 쉼표로 나누고 공백 제거
      } else if (Array.isArray(menu)) {
        processedMenu = menu; // 이미 배열이라면 그대로 사용
      }

  
    let body = {
      affiliation,
      rank,
      name,
      contact: fullContact,
      tableType,
      peopleCount,
      menu: processedMenu, // 배열로 변환된 메뉴
      date: formattedDate,
      time: reservationTime,
      status: '예약'
    };
  
    dispatch(createReservation(body))
      .then(() => {
        reset({
          affiliation: '',
          rank: '',
          name: '',
          contact1: '',
          contact2: '',
          contact3: '',
          tableType: '',
          peopleCount: '',
          menu: [],
          reservationDate: null,  // 날짜 필드는 null로 리셋
          reservationTime: ''
        });
      })
      .catch((error) => {
        toast.error('예약 실패. 다시 시도해 주세요.');
      });
  };


  
  const handleMenuClick = (menuItem, e) => {
    e.preventDefault(); // 폼 제출을 막음
  
    const currentMenu = watchMenu.includes(menuItem)
      ? watchMenu.filter(item => item !== menuItem) // 이미 선택된 항목은 제거
      : [...watchMenu, menuItem]; // 선택되지 않은 항목은 추가
  
    setValue("menu", currentMenu); // "menu" 필드 값 업데이트
  
    trigger('menu'); // 유효성 검사 트리거
  };

  
  return (
    <FormContainer>
      <Title>예약 시스템</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Label>소속:</Label>
        <Input {...register('affiliation', { required: '소속을 입력해주세요' })} placeholder="Ex: 24연대" />
        {errors.affiliation && <ErrorMessage>{errors.affiliation.message}</ErrorMessage>}

        <Label>계급:</Label>
        <Input {...register('rank', { required: '계급을 입력해주세요' })} placeholder="Ex: 하사" />
        {errors.rank && <ErrorMessage>{errors.rank.message}</ErrorMessage>}

        <Label>성명:</Label>
        <Input {...register('name', { required: '성명을 입력해주세요' })} placeholder="Ex: 홍길동" />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

        <Label>연락처:</Label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <SmallInput {...register('contact1', { required: '연락처를 입력해주세요', pattern: { value: /^\d{3}$/, message: '숫자 3개를 입력해주세요' } })} maxLength="3" placeholder="010" />
          <SmallInput {...register('contact2', { required: '연락처를 입력해주세요', pattern: { value: /^\d{4}$/, message: '숫자 4개를 입력해주세요' } })} maxLength="4" placeholder="1234" />
          <SmallInput {...register('contact3', { required: '연락처를 입력해주세요', pattern: { value: /^\d{4}$/, message: '숫자 4개를 입력해주세요' } })} maxLength="4" placeholder="5678" />
        </div>
        {(errors.contact1 || errors.contact2 || errors.contact3) && (
          <ErrorMessage>
            {errors.contact1?.message || errors.contact2?.message || errors.contact3?.message || '연락처를 모두 입력해주세요.'}
          </ErrorMessage>
        )}

        <Label>테이블 선택:</Label>
        <TableButtonGroup>
          <TableButton
            type="button"
            selected={watchTableType === "홀"}
            onClick={() => {
              setValue("tableType", "홀");
              trigger('tableType');  // 유효성 검사 트리거
            }}
            {...register('tableType', { required: '테이블을 선택해주세요' })}
          >
            홀
          </TableButton>
          <TableButton
            type="button"
            selected={watchTableType === "룸"}
            onClick={() => {
              setValue("tableType", "룸");
              trigger('tableType');  // 유효성 검사 트리거
            }}
            {...register('tableType', { required: '테이블을 선택해주세요' })}
          >
            룸
          </TableButton>
        </TableButtonGroup>
        {errors.tableType && <ErrorMessage>{errors.tableType.message}</ErrorMessage>}

        <Label>인원 수:</Label>
        <Select {...register('peopleCount', { required: '인원 수를 선택해주세요' })}>
          <option value="">선택...</option>
          {[...Array(20)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}명</option>
          ))}
        </Select>
        {errors.peopleCount && <ErrorMessage>{errors.peopleCount.message}</ErrorMessage>}

        <Label>메뉴:</Label>
        <MenuButtonGroup>
          {["돼지고기", "소고기", "회"].map((menuItem) => (
            <MenuButton
              key={menuItem}
              selected={watchMenu.includes(menuItem)} // Check if the menu item is selected
              onClick={(e) => handleMenuClick(menuItem, e)} // Handle click to toggle selection
              {...register('menu', { required: '메뉴를 선택해주세요' })} // register 사용
            >
              {menuItem}
            </MenuButton>
          ))}
        </MenuButtonGroup>
        {errors.menu && <ErrorMessage>{errors.menu.message}</ErrorMessage>}

        <Label>예약일자:</Label>
        <Controller
          name="reservationDate" // 필드 이름
          control={control} // react-hook-form의 control 객체
          defaultValue={null} // 기본값은 null로 설정 (초기값 없음)
          rules={{ required: '예약일자를 선택해주세요' }} // 필수 입력 규칙 추가
          render={({ field }) => (
            <DatePicker
            {...register("reservationDate", { required: '예약일자를 선택해주세요' })} // register로 필드 연결
              selected={field.value} // DatePicker에 선택된 값 전달
              onChange={(date) => {
                field.onChange(date); // react-hook-form의 상태 업데이트
                handleDateChange(date); // 추가적인 날짜 처리
              }}
              minDate={new Date(today)} // 오늘 이후 날짜만 선택 가능
              dateFormat="yyyy-MM-dd" // 날짜 형식
              placeholderText="날짜 선택"
              customInput={<CustomDatePicker {...field} />} // 커스텀 클래스 적용
            />
          )}
        />
        {errors.reservationDate && <ErrorMessage>{errors.reservationDate.message}</ErrorMessage>}


        <Label>예약시간:</Label>
        <Select {...register('reservationTime', { required: '예약시간을 선택해주세요' })}>
          <option value="">-- 선택하세요 --</option>
          {generateTimeOptions().map((time, index) => (
            <option key={index} value={time}>{time}</option>
          ))}
        </Select>
        {errors.reservationTime && <ErrorMessage>{errors.reservationTime.message}</ErrorMessage>}

        <Button type="submit">예약하기</Button>
      </form>
    </FormContainer>
  );
};

export default ReservationForm;
