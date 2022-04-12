import { Select, SelectChangeEvent, MenuItem, FormControl, OutlinedInput, Box } from '@mui/material';

export type SelectProps = {
  options?: string[];
  onChange?: (event: SelectChangeEvent<string>) => void;
};

export default function BasicSelect({ options, onChange }: SelectProps) {
  return (
    <Box sx={{ width: 1 }}>
      <FormControl fullWidth>
        <Select
          fullWidth
          style={{ fontSize: '14px' }}
          SelectDisplayProps={{ style: { paddingTop: '10px', paddingBottom: '10px' } }}
          id="demo-simple-select"
          onChange={onChange}
          displayEmpty
          input={<OutlinedInput />}
          MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
          defaultValue=""
        >
          <MenuItem disabled value="">
            Select
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
