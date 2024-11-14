const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// 예약 생성
router.post('/create', async (req, res, next) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    return res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// 예약 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const reservations = await Reservation.find({}).sort({ date: -1 }); // 날짜 기준 내림차순 정렬
    //console.log('reservations-->', reservations);
    return res.json(reservations);
  } catch (error) {
    next(error);
  }
});

// 특정 예약 조회
router.get('/:id', async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "예약을 찾을 수 없습니다." });
    }
    return res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// 예약 수정
router.put('/:id', async (req, res, next) => {
  try {
    const updateData = req.body; // req.body에서 모든 데이터를 받아옴
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData, // 받은 데이터를 그대로 업데이트
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: "예약을 찾을 수 없습니다." });
    }
    return res.json({ message: "예약이 성공적으로 수정되었습니다.", reservation });
  } catch (error) {
    next(error);
  }
});

// 예약 삭제
router.delete('/:id', async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "예약을 찾을 수 없습니다." });
    }
    return res.json({ message: "예약이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
});

// 예약 목록 조회 (이름과 연락처로 필터링)
router.post('/search', async (req, res, next) => {  // GET -> POST
  const { searchName, searchContact } = req.body;  // req.query -> req.body
  // console.log('searchName', searchName);
  // console.log('searchContact', searchContact);
  try {
    // 이름과 연락처로 예약을 필터링
    const query = {};
    if (searchName) query.name = { $regex: searchName, $options: 'i' }; // 이름 필터링
    if (searchContact) query.contact = { $regex: searchContact, $options: 'i' }; // 연락처 필터링

    const reservations = await Reservation.find(query).sort({ date: 1 }); // 날짜 기준 오름차순 정렬
    return res.json(reservations);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
