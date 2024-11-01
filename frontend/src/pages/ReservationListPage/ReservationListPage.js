import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsIcon from '@mui/icons-material/Directions';
import ChatIcon from '@mui/icons-material/Chat';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const ReservationCard = ({ daysAgo, title, date, time, type }) => {
  return (
    <Card 
      style={{ 
        width: '450px', // 가로 크기
        height: '200px', // 세로 크기
        border: '1px solid #1976d2', 
        borderRadius: '8px', 
        margin: '16px auto', // 수직 중앙 정렬을 위해 auto 사용
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' // 카드 내부 중앙 정렬
      }}
    >
      {/* 상단 날짜 표시 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
        <Typography variant="caption" style={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: '8px', padding: '4px 8px' }}>
          {daysAgo}일전
        </Typography>
      </div>
      <CardContent style={{ padding: 0, textAlign: 'center' }}>
        {/* 제목과 날짜 및 시간 */}
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>{title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {date} {time}
        </Typography>
        <Typography variant="body2" style={{ marginTop: '4px' }}>{type} 예약입니다.</Typography>

        {/* 아이콘 버튼들 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <IconButton size="small"><PhoneIcon /></IconButton>
          <IconButton size="small"><DirectionsIcon /></IconButton>
          <IconButton size="small"><ChatIcon /></IconButton>
          <IconButton size="small"><MoreHorizIcon /></IconButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
