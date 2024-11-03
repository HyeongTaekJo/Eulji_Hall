import ReservationCard from "./Sections/ReservationCard";
import React from 'react';
import SelectTab from "./Sections/SelectTab";

const reservations = [
  {
    daysAgo: 1,
    title: "예약 내역",
    affiliation: "24연대",
    rank: "하사",
    name: "홍길동",
    contact: "010-1234-5678",
    tableType: "홀",
    peopleCount: 3,
    menu: ["돼지고기", "소고기"],
    date: "2024-11-05",
    time: "9:00"
  },
  // ... more reservations
];

const ReservationListPage = () => (
  <div>
    <SelectTab/>
    {reservations.map((reservation, index) => (
      <ReservationCard key={index} {...reservation} />
    ))}
  </div>
);

export default ReservationListPage;
