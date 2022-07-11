import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useState, ChangeEventHandler } from 'react';

export default function Search({
  searchText,
  disabled,
  onSelectChange,
}: {
  searchText: string;
  disabled?: boolean;
  onSelectChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <StyledSearch sx={{ width: '150px' }}>
      <SearchIconWrapper>
        <SearchIcon sx={{ height: '15px' }} />
      </SearchIconWrapper>
      <StyledInputBase
        disabled={disabled}
        value={searchText}
        onChange={onSelectChange}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
      />
    </StyledSearch>
  );
}

const StyledSearch = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
  margin: '10px 0',
  marginRight: '10px',
}));

const SearchIconWrapper = styled('div')(() => ({
  padding: '5px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  fontSize: '12px',
  border: theme.palette.mode == 'light' ? '1px solid #C9D0E3' : '1px solid #555D61',
  borderRadius: '4px',
  width: '100%',
  paddingLeft: `25px`,
  transition: theme.transitions.create('width'),
}));
