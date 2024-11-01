import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/system';
import { grey, blue } from '@mui/material/colors'; // 색상 정의

const StyledDatePickerRoot = styled('div')(
  ({ theme }) => `
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  border-radius: 8px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  display: grid;
  grid-template-columns: 1fr 40px; // 수정된 버튼 너비
  align-items: center;
  padding: 2px;
  transition: border-color 0.3s;

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus-within {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }
`
);

const StyledInput = styled('input')(
  ({ theme }) => `
  flex: 1;
  font-size: 0.875rem;
  padding: 2px 2px;
  border: none; /* 테두리 없음 */
  background: inherit; /* 배경 색상 유지 */
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  outline: none;
  &::placeholder {
    color: ${theme.palette.mode === 'dark' ? grey[500] : grey[300]};
  }
`
);

const StyledOpenPickerIcon = styled('button')(
  ({ theme }) => `
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: ${blue[400]};
  }
`
);

export default function DateInput() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDatePickerRoot>
        <DatePicker
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(params) => <StyledInput {...params} placeholder="Select a date..." />}
          components={{
            OpenPickerIcon: StyledOpenPickerIcon
          }}
        />
      </StyledDatePickerRoot>
    </LocalizationProvider>
  );
}
