import * as React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  styled,
} from '@mui/material';
import criticalSeverity from '../../assets/severityIcons/critical.png';
import highSeverity from '../../assets/severityIcons/high.png';
import mediumSeverity from '../../assets/severityIcons/medium.png';
import lowSeverity from '../../assets/severityIcons/low.png';
import maven from '../../assets/techIcons/maven.png';
import docker from '../../assets/techIcons/docker.png';
import rpm from '../../assets/techIcons/rpm.png';
import generic from '../../assets/techIcons/generic.png';
import npm from '../../assets/techIcons/npm.png';
import python from '../../assets/techIcons/python.png';
import composer from '../../assets/techIcons/composer.png';
import go from '../../assets/techIcons/go.png';
import alpine from '../../assets/techIcons/alpine.png';
import debian from '../../assets/techIcons/debian.png';
import exportcsv from '../../assets/exportcsv.svg';
import Search from '../Search';
import { visuallyHidden } from '@mui/utils';

export type ColumnsDataProps = {
  id: string;
  label?: string;
  maxWidth?: string;
};

export default function DynamicTable({ columnsData, rows }: { columnsData: ColumnsDataProps[]; rows: any[] }) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(columnsData[0].id);
  const [searchText, setSearchText] = React.useState('');

  const includesSearchText = (row: any) => {
    for (let col of columnsData) {
      if (row[col.id] && row[col.id].toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
    }
    return false;
  };

  const createSortHandler = (columnName: string) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === columnName && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnName);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Search searchText={searchText} onSelectChange={(e) => setSearchText(e.target.value)} />
          <Typography onMouseDown={(e) => setSearchText('')} fontSize="12px" color="#556274" sx={{ cursor: 'pointer' }}>
            Clear
          </Typography>
        </Box>
        {
          //exportButton()}
        }
      </Box>

      <TableContainer sx={{ overflow: 'hidden auto', maxHeight: '400px' }}>
        <StyledTable aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {columnsData.map((col) => (
                <TableCell
                  align="left"
                  key={col.id}
                  sortDirection={orderBy === col.id ? order : false}
                  sx={{
                    backgroundColor: 'transparent',
                    padding: '10px',
                    paddingRight: 0,
                    minWidth: '70px',
                    maxWidth: col.maxWidth,
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={createSortHandler(col.id)}
                  >
                    <StyledTableHeadline variant="subtitle2">{splitCamelCase(col.label || col.id)}</StyledTableHeadline>
                    {orderBy === col.id ? (
                      <span style={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .slice()
              .sort(getComparator(order, orderBy))
              .filter((row) => searchText == '' || includesSearchText(row))
              .map((row, i) => {
                return (
                  <TableRow hover role="row" tabIndex={-1} key={i} sx={{ padding: '0 10px' }}>
                    {columnsData.map((col, j) => {
                      return (
                        <StyledCell
                          sx={{ minWidth: '70px', maxWidth: col.maxWidth }}
                          scope="row"
                          role="cell"
                          key={col.id + i + j}
                        >
                          {row[col.id] && (
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              sx={{ float: col.maxWidth ? 'center' : 'left', width: 'inherit' }}
                            >
                              {addIconIfNeeded(col.id, row[col.id])}
                              <StyledTableCellText title={row[col.id]}>{row[col.id]}</StyledTableCellText>
                            </Box>
                          )}
                        </StyledCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  );
}

function addIconIfNeeded(columnName: string, rowItem: string) {
  let icon = '';
  const lowerCasedItem = rowItem.toLowerCase();
  if (columnName == 'Severity') {
    switch (lowerCasedItem) {
      case 'critical':
        icon = criticalSeverity;
        break;
      case 'high':
        icon = highSeverity;
        break;
      case 'medium':
        icon = mediumSeverity;
        break;
      case 'low':
        icon = lowSeverity;
        break;
    }
  } else if (columnName == 'Type') {
    switch (lowerCasedItem) {
      case 'maven':
        icon = maven;
        break;
      case 'docker':
        icon = docker;
        break;
      case 'rpm':
        icon = rpm;
        break;
      case 'generic':
        icon = generic;
        break;
      case 'npm':
        icon = npm;
        break;
      case 'python':
        icon = python;
        break;
      case 'composer':
        icon = composer;
        break;
      case 'go':
        icon = go;
        break;
      case 'alpine':
        icon = alpine;
        break;
      case 'debian':
        icon = debian;
        break;
    }
  }
  return icon && <img src={icon} height="22px" alt={rowItem} />;
}

function splitCamelCase(name: string) {
  return name.replace(/([a-z](?=[A-Z]))/g, '$1 ');
}

function descendingComparator(a: any, b: any, orderBy: string) {
  const aValue: string = a[orderBy];
  const bValue: string = b[orderBy];
  if (orderBy == 'Severity') {
    const sevirityOrder = ['Critical', 'High', 'Medium', 'Low', 'Unknown'];
    if (sevirityOrder.indexOf(bValue) < sevirityOrder.indexOf(aValue)) {
      return -1;
    } else if (sevirityOrder.indexOf(bValue) > sevirityOrder.indexOf(aValue)) {
      return 1;
    }
  } else {
    if (bValue < aValue) {
      return -1;
    }
    if (bValue > aValue) {
      return 1;
    }
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator(order: Order, orderBy: string): (a: any, b: any) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function exportButton() {
  return (
    <Box
      width="28px"
      height="28px"
      bgcolor="#E6E6ED"
      alignItems="center"
      display="flex"
      justifyContent="center"
      borderRadius="3px"
      sx={{ cursor: 'pointer' }}
    >
      <img src={exportcsv} width="18px" height="18px" alt={'export csv'} />
    </Box>
  );
}

const StyledTable = styled(Table)`
  background-color: #e6e6ed;
  min-width: 750;
  border-collapse: separate;
  border-spacing: 0 6px;
  border-radius: 6px;
  padding: 0 10px;
`;

const StyledCell = styled(TableCell)`
  overflow-wrap: anywhere;
  padding: 5px 10px;
  max-width: 100%;
  background-color: #fcfcfe;
  border-right: 1px solid rgba(111, 111, 111, 0.1);
  &:first-of-type {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  &:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const StyledTableHeadline = styled(Typography)`
  color: #8494a9;
  font-weight: 600;
  font-size: 12px;
`;

const StyledTableCellText = styled(Typography)`
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  color: #414857;
  font-size: 12px;
  font-weight: 600;
  max-width: 100%;
`;
