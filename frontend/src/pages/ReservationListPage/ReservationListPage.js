import ReservationCard from "./Sections/ReservationCard";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservationList, fetchReservations } from "../../store/reservationThunks";
import { Button } from '@mui/material'; // Import the Button component from MUI
import { useLocation } from "react-router-dom";
import styled from "styled-components";


const NoReservationsMessage = styled.div`
  text-align: center;
  margin-top: 50px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #555;
`;

const ReservationListPage = () => {
  const { state } = useLocation(); // Retrieve the state sent from ReservationSearchPage
  const { searchName, searchContact } = state || {};
  const { reservations = [], isLoading = false, error = null } = useSelector((state) => state.reservation || {});
  const [status, setStatus] = useState('reservations'); // 상태 관리
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 reservations
  const [reservationsLength, setReservationsLength] = useState(reservations.length); // 관리할 상태 추가
 
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log('searchContact-> ' + searchContact);
    dispatch(fetchReservationList( { searchName, searchContact })); // 예약 데이터 가져오기
  }, [dispatch, status, reservationsLength]);

  // Handle the "Load More" button click
  const handleLoadMore = () => {
    setVisibleCount(visibleCount + 5); // Show 5 more items
  };

  if (!reservations.length) {
    return (
      <NoReservationsMessage>
        <p>예약이 없습니다.</p>
      </NoReservationsMessage>
    );
  }

  const displayedReservations = reservations.slice(0, visibleCount);

  return (
    <div style={{ margin: '40px 0' }}> {/* Increased top and bottom margin */}
      {/* <SelectTab onTabChange={setStatus} /> */}
      {displayedReservations.map((reservation) => (
        <ReservationCard 
          key={reservation._id} 
          {...reservation} 
          setReservationsLength={setReservationsLength} 
          searchName={searchName}
          searchContact={searchContact}
        />
      ))}

      {/* "Load More" button */}
      {visibleCount < reservations.length && (
        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLoadMore} 
            style={{ 
              padding: '8px 16px', 
              fontSize: '1rem', 
              textTransform: 'none', // Prevent uppercase transformation
              borderRadius: '4px',  // Add some rounded corners
            }}
          >
            더보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReservationListPage;
