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

import Search from '../Search';
import { visuallyHidden } from '@mui/utils';
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

export default function DynamicTable({ columnNames, rows }: { columnNames: string[]; rows: any[] }) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(columnNames[0]);
  const [searchText, setSearchText] = React.useState('');

  const handleRequestSort = (event: React.MouseEvent<unknown>, columnName: string) => {
    const isAsc = orderBy === columnName && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnName);
  };

  const includesSearchText = (row: any) => {
    for (let col of columnNames) {
      if (row[col].toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
    }
    return false;
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
        {exportButton()}
      </Box>

      <TableContainer sx={{ overflowY: 'scroll', maxHeight: '400px' }}>
        <StyledTable aria-labelledby="tableTitle">
          <TableHeader columnNames={columnNames} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {rows
              .slice()
              .sort(getComparator(order, orderBy))
              .filter((row) => searchText == '' || includesSearchText(row))
              .map((row, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i} sx={{ padding: '0 10px' }}>
                    {columnNames.map((columnName, j) => {
                      return (
                        <StyledCell key={columnName + i + j}>
                          <Box display="flex" flexDirection="column" alignItems="center" sx={{ float: 'left' }}>
                            {addIconIfNeeded(columnName, row[columnName])}
                            <Typography
                              overflow="hidden"
                              title={row[columnName]}
                              color="#414857"
                              fontSize="12px"
                              fontWeight="600"
                              maxWidth="100%"
                              textOverflow="ellipsis"
                            >
                              {row[columnName]}
                            </Typography>
                          </Box>
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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
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

interface TableHeaderProps {
  columnNames: string[];
  onRequestSort: (event: React.MouseEvent<unknown>, columnId: string) => void;
  order: Order;
  orderBy: string;
}

function TableHeader(props: TableHeaderProps) {
  const { columnNames, order, orderBy, onRequestSort } = props;
  const createSortHandler = (columnId: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, columnId);
  };

  return (
    <TableHead>
      <TableRow>
        {columnNames.map((columnName) => (
          <TableCell
            align="left"
            key={columnName}
            sortDirection={orderBy === columnName ? order : false}
            sx={{ backgroundColor: 'transparent' }}
          >
            <TableSortLabel
              active={orderBy === columnName}
              direction={orderBy === columnName ? order : 'asc'}
              onClick={createSortHandler(columnName)}
            >
              <StyledTableHeadline variant="subtitle2">{splitCamelCase(columnName)}</StyledTableHeadline>
              {orderBy === columnName ? (
                <span style={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
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
