import * as React from 'react';
import Box from '@mui/material/Box';
import {OutlinedInput , Typography} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export type SelectProps = {
  options?: string[]
  onChange?: (event: SelectChangeEvent<any>) => void
}

export default function BasicSelect({
  options,
  onChange
}: SelectProps){
  return (
    <Box sx={{ width: 1 }}>
      <FormControl fullWidth>
        <Select
          fullWidth
          SelectDisplayProps = {{ style: { paddingTop: '10px', paddingBottom: '10px' } }}
          id="demo-simple-select"
          onChange={onChange}
          displayEmpty
          input={<OutlinedInput />}
          MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
          defaultValue=''
        >
          <MenuItem disabled value=''>
            <em>Select</em>
          </MenuItem>
           {options?.map((option, index) => {
          return (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          );
      })}
        </Select>
      </FormControl>
    </Box>
  );
}