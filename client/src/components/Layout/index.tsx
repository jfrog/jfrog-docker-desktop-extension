import { FC, useState } from 'react';
import { styled, Box } from '@mui/material';

export const Layout: FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleNavigation = () => setOpen((status) => !status);

  return (
    <LayoutWrapper>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled('div')`
  max-height: 100vh;
`;
