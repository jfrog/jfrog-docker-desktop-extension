import { Box, styled, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

export type ChartProps = {
  chartName: string;
  chartItems: ChartItemProps[];
};

export type ChartItemProps = {
  color: string;
  value: number;
  icon?: string;
  title?: string | number;
};

export default function PieChartBox({ chartName, chartItems }: ChartProps) {
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const { palette } = useTheme();
  const isDarkMode = palette.mode == 'dark';

  const getItemString = (item: ChartItemProps, index: number) => {
    return (
      <Box
        display="flex"
        alignItems="center"
        marginBottom="6px"
        key={index}
        border={`1px solid ${index == hovered ? item.color : 'transparent'}`}
        borderRadius="6px"
        paddingRight="10px"
      >
        {item.icon ? <img src={item.icon} width="22px" alt={'Critical'} /> : <Box width="22px" />}
        <Typography fontWeight={index == hovered ? 600 : 400} fontSize="12px">
          {`${item.title} : ${item.value}`}
        </Typography>
      </Box>
    );
  };

  return (
    <PieChartWrapper sx={{ backgroundColor: isDarkMode ? '#222e33' : '#e6e6ed' }}>
      <Typography fontWeight="600" fontSize="14px" marginLeft="20px" marginBottom="10px">
        {chartName}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-evenly">
        <PieChart
          rounded
          style={{ height: '130px', width: '130px' }}
          lineWidth={20}
          onMouseOver={(dsds, index) => {
            setHovered(index);
          }}
          onMouseOut={() => {
            setHovered(undefined);
          }}
          label={({ dataIndex }) =>
            dataIndex == 0
              ? // Sum total number of value
                chartItems
                  .map((a) => a.value)
                  .reduce(function (a, b) {
                    return a + b;
                  })
              : undefined
          }
          labelStyle={{
            fill: isDarkMode ? '#fff' : '#000',
          }}
          labelPosition={0}
          data={chartItems}
        />
        <Box>{chartItems.map((item, index) => getItemString(item, index))}</Box>
      </Box>
    </PieChartWrapper>
  );
}

const PieChartWrapper = styled(Box)`
  width: 350px;
  height: 200px;
  flex-direction: column;
  display: flex;
  justify-content: space-evenly;
  padding-bottom: 10px;
  border-radius: 6px;
`;
