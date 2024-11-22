import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Divider } from '@mui/material';
import dayjs from 'dayjs';

const CalendarPage = () => {
  // 현재 날짜 상태
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // 각 날짜에 표시할 데이터를 저장하는 객체 (예시)
  const [data, setData] = useState({
    '2024-11-22': ['이벤트 1', '이벤트 2'],
    '2024-11-23': ['이벤트 3'],
    '2024-11-25': ['이벤트 4', '이벤트 5'],
  });

  // 날짜 선택 핸들러
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // 해당 날짜의 데이터를 가져오는 함수
  const getDataForDate = (date) => {
    return data[date] || [];
  };

  // 월 첫날을 기준으로 시작하는 캘린더 생성
  const startOfMonth = selectedDate.startOf('month');
  const endOfMonth = selectedDate.endOf('month');

  // 월에 해당하는 날짜들 배열
  const daysInMonth = [];
  for (let i = startOfMonth.date(); i <= endOfMonth.date(); i++) {
    const currentDate = dayjs(selectedDate).date(i).format('YYYY-MM-DD');
    daysInMonth.push(currentDate);
  }

  // 월을 시작하는 첫 번째 날짜의 요일을 계산
  const startDayOfWeek = startOfMonth.day();

  return (
    <Box sx={{ padding: 3 }}>
      {/* 캘린더 헤더 */}
      <Typography variant="h4" gutterBottom align="center">
        캘린더 - {selectedDate.format('YYYY년 MMMM')}
      </Typography>
      
      {/* 주차 헤더 (일, 월, 화, 수, 목, 금, 토) */}
      <Grid container spacing={2} sx={{ marginBottom: 1 }}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <Grid item xs={1} key={index} align="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'gray' }}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* 날짜 그리드 */}
      <Grid container spacing={2}>
        {/* 이전 달 빈 공간 */}
        {[...Array(startDayOfWeek)].map((_, index) => (
          <Grid item xs={1} key={index}></Grid>
        ))}
        
        {/* 날짜들 */}
        {daysInMonth.map((day, index) => (
          <Grid item xs={1.7} key={index}>
            <Paper
              sx={{
                padding: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: selectedDate.isSame(dayjs(day), 'day') ? 'lightblue' : 'white',
                borderRadius: 1,
                boxShadow: 3,
                transition: 'background-color 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'lightyellow',
                },
                height: '100%',
              }}
              onClick={() => setSelectedDate(dayjs(day))}
            >
              <Typography variant="body2" align="center" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                {dayjs(day).format('DD')}
              </Typography>
              {/* 해당 날짜의 데이터 표시 */}
              <Box sx={{ marginTop: 1, textAlign: 'center' }}>
                {getDataForDate(day).map((event, index) => (
                  <Button
                    key={index}
                    sx={{
                      fontSize: '10px',
                      marginBottom: 0.5,
                      padding: '2px 6px',
                      backgroundColor: 'lightgray',
                      '&:hover': {
                        backgroundColor: 'lightblue',
                      },
                    }}
                  >
                    {event}
                  </Button>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CalendarPage;
