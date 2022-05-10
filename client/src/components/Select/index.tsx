import {
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  OutlinedInput,
  Box,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useState } from 'react';

export type SelectProps = {
  options?: any[];
  onChange: (selected: string | null) => void;
};

export default function BasicSelect({ options, onChange }: SelectProps) {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  return (
    <Box sx={{ width: 1 }}>
      <FormControl fullWidth>
        <Autocomplete
          value={value}
          onChange={(event: any, newValue: string | null) => {
            onChange(newValue);
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          id="controllable-states-demo"
          options={options ? [...options] : []}
          size="small"
          sx={{ maxHeight: 400 }}
          renderInput={(params) => <TextField {...params} InputLabelProps={{ disabled: true }} placeholder="Select" />}
        />
      </FormControl>
    </Box>
  );
}
