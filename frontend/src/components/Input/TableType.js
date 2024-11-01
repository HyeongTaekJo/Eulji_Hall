import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box } from '@mui/material';

export default function TableType() {
  return (
    <Box>
      <FormControl component="fieldset" style={{ marginTop: '0px' }}>
        {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel value="hall" control={<Radio />} label="홀" />
          <FormControlLabel value="room" control={<Radio />} label="룸" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}