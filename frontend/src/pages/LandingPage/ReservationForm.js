import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { createReservation, fetchReservations } from '../../store/reservationThunks';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';  // date-fns의 한국어 로케일을 임포트
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


  @media (max-width: 576px) {
    max-width: 330px;
  width: 100%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;

  @media (max-width: 576px) {
    font-size: 1.25rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-top: 10px;
  font-size: 1rem;

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const SmallInput = styled(Input)`
  flex-grow: 1;
  margin-right: 5px;

  @media (max-width: 576px) {
      font-size: 0.9rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

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
    background-color: #e9f7ff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0.8;
    cursor: pointer;
  }

  @media (max-width: 576px) {
    width: 100%;
    font-size: 0.9rem;
  }
`;

const TableButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
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

  @media (max-width: 576px) {
    flex: 1 1 48%;
    font-size: 0.9rem;
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

  @media (max-width: 576px) {
    flex: 1; /* 모바일 화면에서도 버튼이 한 줄로 나타나도록 설정 */
    font-size: 0.8rem;
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
  const { reservations = [],  } = useSelector((state) => state.reservation || {});
  const { register, handleSubmit, control, formState: { errors }, reset, setValue,watch,trigger ,setError,clearErrors } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const watchMenu = watch("menu", []); 

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

  // const excludedDates = [
  //   new Date(2024, 10, 18), // 2024-11-18
  //   new Date(2024, 10, 19), // 2024-11-19
  //   new Date(2024, 10, 20), // 2024-11-20
  // ];

  

  const hallLimit = 8;
  const roomLimit = 6;

  // 각 필드 값들 별도로 상태 관리
  const [tableType, setTableType] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [peopleCount, setPeopleCount] = useState('');

  //예약마감된 일자
  const [excludedDates, setExcludedDates] = useState([]);

  // 실시간 예약가능 상황
  const [hallAvailableCount, setHallAvailableCount] = useState(hallLimit);
  const [roomAvailableCount, setRoomAvailableCount] = useState(roomLimit);

  // watch로 필드 값 추적
  const formValues = watch(); // watch로 전체 값 추적

  // watch로 추적된 값이 바뀔 때마다 상태 업데이트
  useEffect(() => {
    setTableType(formValues.tableType);
    setReservationDate(formValues.reservationDate);
    setPeopleCount(formValues.peopleCount);
  }, [formValues]);

  // fullInfo 값을 계산하는 useEffect
  useEffect(() => {
    // fullInfo 형식으로 출력
    console.log(`Table: ${tableType}, Date: ${reservationDate}, People: ${peopleCount}`);
  }, [tableType, reservationDate, peopleCount]);

  useEffect(() => {
    // 오늘 날짜를 YYYY-MM-DD 형식으로 구하기
    const today = new Date();
    
    // 로컬 시간 기준으로 날짜 포맷팅
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // startDate로 오늘 날짜 전달
    dispatch(fetchReservations({ startDate: formattedDate })).then(() => {
      // 성공적인 호출 후 추가 작업
    });
  }, [dispatch]);

  const data = reservations;

  const groupByDateWithCounts = (data) => {
     // 먼저 예약 데이터를 집계
    const result = data.reduce((result, reservation) => {
    const { date, tableType, peopleCount } = reservation;
    const formattedDate = new Date(date).toISOString().split("T")[0];
      // 날짜 키가 없으면 초기화
      if (!result[formattedDate]) {
        result[formattedDate] = {
          홀: { remaining: hallLimit, booked: 0 }, // 남은 예약 수량과 예약된 수량 초기화
          룸: { remaining: roomLimit, booked: 0 }, // 남은 예약 수량과 예약된 수량 초기화
        };
      }

      // 테이블 유형에 따라 값 업데이트
      if (tableType === "홀" || tableType === "룸") {
        result[formattedDate][tableType].booked += 1;
        result[formattedDate][tableType].remaining -= 1;
      }
  
      return result;
    }, {});

    // 리듀스가 끝난 후 남은 인원 수량 계산
    for (const date in result) {
      if (result[date].홀) {
        // 홀의 경우, 예약된 수량을 4명씩 계산하여 남은 인원 수량 계산
        result[date].홀.remainingPeople = (hallLimit - result[date].홀.booked) * 4;
      }

      if (result[date].룸) {
        // 룸의 경우, 예약된 수량을 8명씩 계산하여 남은 인원 수량 계산
        result[date].룸.remainingPeople = (roomLimit - result[date].룸.booked) * 8;
      }

      // // 남은 인원 수량이 0 이하인 경우 해당 날짜를 제거
      // if (
      //   (result[date].홀 && result[date].홀.remainingPeople <= 0) ||
      //   (result[date].룸 && result[date].룸.remainingPeople <= 0)
      // ) {
      //   delete result[date]; // 결과에서 해당 날짜를 삭제
      // }
    }
    
    return result;
  };

  // //예약마감된 날짜로 만들기
  useEffect(() => {
    // 결과 생성
    const result = groupByDateWithCounts(data);
    //console.log('result-> ' + JSON.stringify(result, null, 2));
  
    // 객체를 배열 형식으로 변환 (옵션)
    const formattedResult = Object.entries(result).map(([date, data]) => ({
      date,
      ...data,
    }));
    //console.log('formattedResult-> ' + JSON.stringify(formattedResult, null, 2));
  
    // 날짜를 new Date() 형식으로 변환
    const newExcludedDates = formattedResult.map((item) => {
      const { date, 홀, 룸 } = item;  // 홀과 룸을 분리
  
      // tableType에 맞는 데이터만 필터링
      let filteredDate = null;
  
      // tableType에 따라서 분기 처리
      if (tableType === "홀") {
        if (홀.remaining <= 0 || 홀.remainingPeople < peopleCount) {
          filteredDate = date;  // 조건에 맞으면 해당 일자를 제외
        }
      } else if (tableType === "룸") {
        if (룸.remaining <= 0 || 룸.remainingPeople < peopleCount) {
          filteredDate = date;  // 조건에 맞으면 해당 일자를 제외
        }
      }
      // 만약 filteredDate가 설정되었으면, 그 날짜를 new Date() 형식으로 변환
      if (filteredDate) {
        let newDate = new Date(filteredDate);

        // Date 객체로 변환된 date를 'new Date("yyyy-mm-dd")' 형식으로 변환
        return new Date(`${newDate.toISOString().split("T")[0]}`);
      }
  
      return null;  // 조건에 맞지 않으면 null을 반환하여 제외
    }).filter((date) => date !== null);  // null을 제외한 날짜만 포함
  
    // 상태 업데이트
    setExcludedDates(newExcludedDates);
    console.log('excludedDates-> ' + excludedDates);
  }, [data, peopleCount, tableType, reservationDate]); 
 
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
      status: '예약',
     
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
        <Select
          {...register('peopleCount', { 
            required: '인원 수를 선택해주세요',
          })}
          disabled={!watch("tableType")}  // 테이블을 선택하기 전에는 비활성화
        >
          <option value="">선택...</option>
          {[...Array(30)].map((_, i) => (
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
          name="reservationDate"
          control={control}
          defaultValue={null}
          rules={{
            required: '예약일자를 선택해주세요',
          }}
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value}
              onChange={(date) => {
                field.onChange(date); // 상태 업데이트
                handleDateChange(date); // 추가 처리
              }}
              disabled={!watch("tableType") || !watch("peopleCount")} // 테이블과 인원 선택 여부에 따라 활성화 제어
              minDate={new Date(today)}
              dateFormat="yyyy-MM-dd"
              placeholderText="날짜 선택"
              customInput={<CustomDatePicker />}
              excludeDates={excludedDates}
              locale={ko}
              
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
