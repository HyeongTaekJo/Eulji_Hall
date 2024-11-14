import React, { useEffect, useState } from 'react';
import './ReservationListGridPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservations, updateReservation } from '../../store/reservationThunks';
import DatePicker from 'react-datepicker';  // react-datepicker 임포트
import "react-datepicker/dist/react-datepicker.css";  // 스타일 추가
import { FaExclamationCircle } from 'react-icons/fa'; // React Icons 라이브러리

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '20px',
  },
  icon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  text: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
};

const getTodayInKST = () => {
  const kstOffset = 9 * 60 * 60 * 1000; // KST는 UTC+9
  const today = new Date(Date.now() + kstOffset);
  return today.toISOString().split('T')[0];
};

const ReservationListGridPage = () => {
  const dispatch = useDispatch();
  const { reservations = [] } = useSelector((state) => state.reservation || {});
  const [currentPage, setCurrentPage] = useState(0);
  const [startDate, setStartDate] = useState(getTodayInKST()); // 오늘 날짜
  const [endDate, setEndDate] = useState(getTodayInKST()); // 오늘 날짜
  const [statusFilter, setStatusFilter] = useState('예약'); // 초기값은 '예약'
  const [isSaved, setIsSaved] = useState(false); // 저장 상태 추가
  const pageSize = 5;

  const [modifiedReservations, setModifiedReservations] = useState({});
  const statusOptions = ['예약', '완료', '취소', '전체']; // '전체' 추가
  const tableOptions = ['룸', '홀']; // 룸/홀 선택 옵션
  const defaultMenuItems = ['돼지고기', '소고기', '회']; // 기본 메뉴 항목

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) * pageSize < (reservations ? reservations.length : 0) ? prev + 1 : prev);
  };

  useEffect(() => {
    dispatch(fetchReservations({startDate, endDate, statusFilter,isSaved})).then(() => {
    });
  }, [dispatch,startDate,endDate,statusFilter,isSaved]);

  const handleFieldChange = (id, field, value) => {
    setModifiedReservations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
        isModified: true,
      },
    }));
  };

  const handleStatusChange = (id, newValue) => {
    setModifiedReservations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: newValue,
        isModified: true,
      },
    }));
  };

  const handleSave = (id) => {
    const modifiedData = modifiedReservations[id];
    if (!modifiedData || !modifiedData.isModified) return;

    dispatch(updateReservation({ id, body: modifiedData })).then(() => {
      setIsSaved((prev) => !prev); // 저장 상태를 토글하여 useEffect 트리거
    });

    setModifiedReservations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isModified: false,
      },
    }));
  };

  const handleMenuChange = (id, menuItem, isChecked) => {
    setModifiedReservations((prev) => {
      const updatedMenu = prev[id]?.menu || [];
      const newMenu = isChecked
        ? [...updatedMenu, menuItem]
        : updatedMenu.filter((item) => item !== menuItem);

      return {
        ...prev,
        [id]: {
          ...prev[id],
          menu: newMenu,
          isModified: true,
        },
      };
    });
  };

  const renderRows = () => {
    if (!reservations || reservations.length === 0) {
      return (
        <div style={styles.container}>
          <FaExclamationCircle style={styles.icon} />
          <p style={styles.text}>데이터가 없습니다</p>
        </div>
      );
    }

    const start = currentPage * pageSize;
    const end = start + pageSize;

      // 날짜 범위와 상태에 맞는 예약만 필터링
    const filteredReservations = reservations.filter((row) => {
      const reservationDate = new Date(row.date);
      const isWithinDateRange = reservationDate >= new Date(startDate) && reservationDate <= new Date(endDate);
      const matchesStatusFilter = statusFilter === '전체' || row.status === statusFilter;

      return isWithinDateRange && matchesStatusFilter;
    });

    return filteredReservations.slice(start, end).map((row) => {
      const formattedDate = new Date(row.date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\./g, '');

      const modifiedRow = modifiedReservations[row._id] || {};
      const isModified = modifiedRow.isModified;

      const currentMenu = modifiedRow.menu || row.menu || [];

      // 기본 메뉴 항목 (돼지고기, 소고기, 회) + 현재 메뉴 항목
      const allMenuItems = [...new Set([...defaultMenuItems, ...currentMenu])];

      return (
        <div key={`${row._id}-${row.name}`} className="grid-row">
          <div className="grid-cell">
            <input 
              type="text" 
              value={modifiedRow.affiliation || row.affiliation} 
              onChange={(e) => handleFieldChange(row._id, 'affiliation', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white', // 수정 불가능하면 흐릿한 배경
                cursor: row.status !== '예약' ? 'not-allowed' : 'text', // 수정 불가능하면 커서를 막음
                color: row.status !== '예약' ? '#a0a0a0' : 'black' // 수정 불가능하면 글자 색을 흐리게
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="text" 
              value={modifiedRow.rank || row.rank} 
              onChange={(e) => handleFieldChange(row._id, 'rank', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="text" 
              value={modifiedRow.name || row.name} 
              onChange={(e) => handleFieldChange(row._id, 'name', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell" style={{ flex: '0.5' }}>
            <input 
              type="number" 
              value={modifiedRow.peopleCount || row.peopleCount} 
              onChange={(e) => handleFieldChange(row._id, 'peopleCount', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="date" 
              value={modifiedRow.date ? new Date(modifiedRow.date).toISOString().split('T')[0] : row.date ? new Date(row.date).toISOString().split('T')[0] : ''} 
              onChange={(e) => handleFieldChange(row._id, 'date', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              min={new Date().toISOString().split('T')[0]} // 오늘 이후 날짜만 선택 가능
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="time" 
              value={modifiedRow.time || row.time} 
              onChange={(e) => handleFieldChange(row._id, 'time', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <input 
              type="text" 
              value={modifiedRow.contact || row.contact} 
              onChange={(e) => handleFieldChange(row._id, 'contact', e.target.value)}
              className={`edit-input ${isModified ? 'modified' : ''}`}
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'text',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            />
          </div>

          <div className="grid-cell">
            <div className="menu-checkboxes">
              {allMenuItems.map((menuItem) => (
                <label key={menuItem}>
                  <input 
                    type="checkbox" 
                    checked={currentMenu.includes(menuItem)}
                    onChange={(e) => handleMenuChange(row._id, menuItem, e.target.checked)}
                    disabled={row.status !== '예약'}
                    style={{
                      cursor: row.status !== '예약' ? 'not-allowed' : 'pointer',
                    }}
                  />
                  {menuItem}
                </label>
              ))}
            </div>
          </div>

          <div className="grid-cell">
            <select
              value={modifiedRow.tableType || row.tableType}
              onChange={(e) => handleFieldChange(row._id, 'tableType', e.target.value)}
              className="status-select"
              disabled={row.status !== '예약'}
              style={{
                backgroundColor: row.status !== '예약' ? '#f0f0f0' : 'white',
                cursor: row.status !== '예약' ? 'not-allowed' : 'pointer',
                color: row.status !== '예약' ? '#a0a0a0' : 'black'
              }}
            >
              {tableOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="grid-cell">
            <select
              value={modifiedRow.status || row.status}
              onChange={(e) => handleStatusChange(row._id, e.target.value)}
              className="status-select"
            >
              {['예약', '완료', '취소'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="grid-cell">
            <button
              onClick={() => handleSave(row._id)}
              disabled={!isModified}
              className="save-button"
            >
              저장
            </button>
          </div>
        </div>
      );
    });
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(reservations.length / pageSize);

  return (
    <div className="grid-container">
      <div className="date-filter">
        <label>시작일자</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
          className="custom-date-picker"
        />
        <label>종료일자</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
          className="custom-date-picker"
        />
        <label>
          예약 상태
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid-header">
        <div className="grid-cell">소속</div>
        <div className="grid-cell">계급</div>
        <div className="grid-cell">성명</div>
        <div className="grid-cell" style={{ flex: '0.5' }}>인원 수</div>
        <div className="grid-cell">날짜</div>
        <div className="grid-cell">예약시간</div>
        <div className="grid-cell">연락처</div>
        <div className="grid-cell">메뉴</div>
        <div className="grid-cell">룸/홀 선택</div>
        <div className="grid-cell">예약 상태</div>
        <div className="grid-cell">저장</div>
      </div>
      <div className="grid-body">
        {renderRows()}
      </div>
      <div className="grid-footer">
        <button onClick={handlePrevPage} disabled={currentPage === 0}>이전</button>
        <span>{currentPage + 1} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>다음</button>
      </div>
    </div>
  );
};

export default ReservationListGridPage;