import { Box, styled, Typography, useTheme, Tooltip } from '@mui/material';
import { useState } from 'react';
import { TechIcons } from '../../assets/techIcons/TechIcons';

const chartColors = ['#fb515b', '#c9d0e3', '#d8ddea', '#e0e3eb'];
const CORE_CIRCLE_SIZE = 35;

export default function CircularChart({ items }: { items: string[] }) {
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const { palette } = useTheme();
  const isDarkMode = palette.mode == 'dark';
  const centerTop = (CORE_CIRCLE_SIZE / 2) * items.length;
  return (
    <Box
      padding="0 10px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      width={1 / 3}
      height={`${(CORE_CIRCLE_SIZE + 30) * items.length}px`}
      position="relative"
    >
      {items?.map((item, index) => {
        const isCoreItem = index == 0;
        return (
          <StyledCircle
            key={index}
            afterHeight={`${15 * (items.length - 1) + index * 25}px`}
            topLine={`${CORE_CIRCLE_SIZE - index + index * 20}px`}
            lineBorderColor={isCoreItem ? '#fb515b' : '#c7cee0'}
            top={`${centerTop}px`}
            sx={{ backgroundColor: chartColors[index >= chartColors.length ? chartColors.length - 1 : index] }}
            width={`${CORE_CIRCLE_SIZE * (index + 1)}px`}
            height={`${CORE_CIRCLE_SIZE * (index + 1)}px`}
            zIndex={1999 - index}
          >
            <StyledCircleTextWrapper top={`${45 + 15 * (items.length - 1) + index * 45}px`}>
              <img
                src={TechIcons[index == items.length - 1 ? 'Docker' : 'Generic']}
                alt=""
                height="24px"
                width="auto"
                style={{ marginRight: '5px' }}
              />
              <Tooltip title={item}>
                <StyledCircleText color={isCoreItem ? '#fb515b' : 'inherit'}>{item}</StyledCircleText>
              </Tooltip>
            </StyledCircleTextWrapper>
          </StyledCircle>
        );
      })}
    </Box>
  );
}

const StyledCircle = styled(Box)<{ topLine: string; afterHeight: string; lineBorderColor: string }>`
  position: absolute;
  left: 50%;
  display: inline-block;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.5s ease-in-out;
  box-shadow: inset 0 0 24px rgb(0 0 0 / 8%);

  &:after {
    content: '';
    position: absolute;
    display: block;
    border-top: 2px solid ${({ lineBorderColor }) => lineBorderColor};
    border-left: 2px solid ${({ lineBorderColor }) => lineBorderColor};
    height: ${({ afterHeight }) => afterHeight};
    width: 36px;
    top: ${({ topLine }) => topLine};
    right: 99%;
    border-radius: 5px 0 0 0;
    transform: skewY(-45deg);
  }
`;

const StyledCircleTextWrapper = styled(Box)`
  left: -43px;
  align-items: center;
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 10000;
  white-space: nowrap;
  transition: all 0.2s;
`;

const StyledCircleText = styled(Typography)`
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
