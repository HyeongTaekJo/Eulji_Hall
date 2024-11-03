import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsIcon from '@mui/icons-material/Directions';
import ChatIcon from '@mui/icons-material/Chat';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';

const ReservationCard = ({ 
  daysAgo, 
  title, 
  affiliation, 
  rank, 
  name, 
  contact, 
  tableType, 
  peopleCount, 
  menu, 
  date, 
  time 
}) => {
  return (
    <Card 
      style={{ 
        width: '450px', 
        height: '300px', 
        border: '1px solid #1976d2', 
        borderRadius: '8px', 
        margin: '16px auto', 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}
    >
      {/* Centered "days ago" label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
        <Typography variant="caption" style={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: '8px', padding: '4px 8px', fontSize: '0.9rem' }}>
          {daysAgo}일전
        </Typography>
        
      </div>
      
      {/* Centered title */}
      <CardContent style={{ padding: 0, textAlign: 'center', marginBottom: '8px' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{title}</Typography>
      </CardContent>

      {/* Center-aligned content */}
      <CardContent style={{ padding: '0 16px', textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary" style={{ fontSize: '1rem' }}>
          소속: {affiliation} | 계급: {rank} | 성명: {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ fontSize: '1rem' }}>
          연락처: {contact}
        </Typography>
        <Typography variant="body2" style={{ marginTop: '4px', fontSize: '1rem' }}>
          {tableType} 예약입니다. 인원 수: {peopleCount}
        </Typography>
        <Typography variant="body2" style={{ marginTop: '4px', fontSize: '1rem' }}>
          메뉴: {menu.join(', ')}
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ fontSize: '1rem' }}>
          예약일자: {date} | 예약시간: {time}
        </Typography>

        {/* Center-aligned icons */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
         
          <IconButton size="small"><EditIcon /></IconButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
