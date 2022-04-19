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
import { VulnsColumnData } from '../../pages/Scan';
import exportCsv from '../../assets/csv.png';
import noIssuesIcon from '../../assets/no-issues.png';
import { ContentCopy } from '@mui/icons-material';

export default function DynamicTable({ columnsData, rows }: { columnsData: Array<VulnsColumnData>; rows: any[] }) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(columnsData[0].id);
  const [searchText, setSearchText] = React.useState('');
  const [rowHover, setRowHover] = React.useState(-1);
  const [colHover, setColHover] = React.useState(-1);
  const isEmptyTable = rows.length == 0;

  const getSortOrderIfExists = () => {
    for (let col of columnsData) {
      if (col.id == orderBy) {
        return col.sortOrder;
      }
    }
  };

  const includesSearchText = (row: any) => {
    let found = false;
    for (let col of columnsData) {
      let stringLines: string[] = Array.isArray(row[col.id]) ? row[col.id] : [row[col.id]];
      for (let line of stringLines) {
        if (line.toLowerCase().includes(searchText.toLowerCase())) {
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
    return found;
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
          <Search
            disabled={isEmptyTable}
            searchText={searchText}
            onSelectChange={(e) => setSearchText(e.target.value)}
          />
          <Typography
            onMouseDown={(e) => setSearchText('')}
            fontSize="12px"
            sx={{ cursor: isEmptyTable ? 'default' : 'pointer' }}
          >
            Clear
          </Typography>
        </Box>
        <ExportCsvBox>
          <img src={exportCsv} width="18px" height="18px" alt={'export csv'} />
        </ExportCsvBox>
      </Box>

      <TableContainer sx={{ overflow: 'hidden auto' }}>
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
                    <StyledTableHeadline variant="subtitle2" textTransform="capitalize">
                      {col.label || col.id}
                    </StyledTableHeadline>
                    {orderBy === col.id ? (
                      <span style={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isEmptyTable
              ? noIssuesDetected()
              : rows
                  .slice()
                  .sort(getComparator(order, orderBy, getSortOrderIfExists()))
                  .filter((row) => searchText == '' || includesSearchText(row))
                  .map((row, rowIndex) => {
                    return (
                      <TableRow
                        title={row.summary}
                        onMouseEnter={() => setRowHover(rowIndex)}
                        onMouseLeave={() => setRowHover(-1)}
                        role="row"
                        tabIndex={-1}
                        key={rowIndex}
                        sx={{ padding: '0 10px' }}
                      >
                        {columnsData.map((col, colIndex) => {
                          let isRowHover = rowHover == rowIndex;
                          let isColHover = colHover == colIndex;
                          return (
                            <StyledCell
                              ishover={+isRowHover}
                              sx={{ maxWidth: col.maxWidth }}
                              scope="row"
                              role="cell"
                              key={colIndex}
                              onMouseEnter={() => setColHover(colIndex)}
                              onMouseLeave={() => setColHover(-1)}
                            >
                              {
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  alignItems="center"
                                  width="inherit"
                                  sx={{ float: col.maxWidth ? 'center' : 'left' }}
                                >
                                  {createCell(col, row[col.id], rowIndex, isRowHover && isColHover)}
                                </Box>
                              }
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

function createCell(col: VulnsColumnData, cellItem: string | string[], rowIndex: number, isHover?: boolean) {
  let cellBody: any = [];
  // Add icon if needed
  if (col.iconList && typeof cellItem == 'string' && col.iconList[cellItem]) {
    cellBody.push(<img src={col.iconList[cellItem]} height="22px" alt={cellItem} key={cellItem + rowIndex + col.id} />);
  }
  // Add text lines
  let stringLines = Array.isArray(cellItem) ? cellItem : [cellItem];
  stringLines.forEach((line: string, index: number) => {
    cellBody.push(
      <Box width={!col.maxWidth ? 1 : 'inherit'} textAlign="left" display="flex" alignItems="center" key={index}>
        <StyledTableCellText>{line}</StyledTableCellText>
        {line && col.copyIcon && (
          <CopyIcon onClick={() => navigator.clipboard.writeText(line)} visibility={isHover ? 'visible' : 'hidden'} />
        )}
      </Box>
    );
  });
  return cellBody;
}

function noIssuesDetected() {
  return (
    <TableRow
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <TableCell colSpan={100}>
        <Box alignItems="center" height="300px" display="flex" flexDirection="column" justifyContent="center">
          <img src={noIssuesIcon} width="90px" height="90px" alt={'no issues'} />
          <Typography fontSize="24px" fontWeight="600" textTransform="capitalize">
            The scan was completed successfully
          </Typography>
          <Typography fontSize="18px" fontWeight="600" textTransform="capitalize">
            no issues were detected
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}

function descendingComparator(a: any, b: any, orderBy: string, sortOrder?: string[]) {
  const aValue: string = Array.isArray(a[orderBy]) ? a[orderBy][0] : a[orderBy];
  const bValue: string = Array.isArray(b[orderBy]) ? b[orderBy][0] : b[orderBy];
  if (sortOrder && sortOrder.length > 0) {
    if (sortOrder.indexOf(bValue) < sortOrder.indexOf(aValue)) {
      return -1;
    } else if (sortOrder.indexOf(bValue) > sortOrder.indexOf(aValue)) {
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

function getComparator(order: Order, orderBy: string, sortOrder?: string[]): (a: any, b: any) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy, sortOrder)
    : (a, b) => -descendingComparator(a, b, orderBy, sortOrder);
}

const ExportCsvBox = styled(Box)`
  background-color: #e6e6ed;
  width: 28px;
  height: 28px;
  align-items: center;
  display: flex;
  justify-content: center;
  border-radius: 3px;
  cursor: pointer;
  @media screen and (prefers-color-scheme: dark) {
    background-color: #222e33;
  }
`;

const StyledTable = styled(Table)`
  background-color: #e6e6ed;
  min-width: 750;
  border-collapse: separate;
  border-spacing: 0 6px;
  border-radius: 6px;
  padding: 0 10px;
  @media screen and (prefers-color-scheme: dark) {
    background-color: #222e33;
  }
`;

const StyledCell = styled(TableCell)<{ ishover: number }>`
  overflow-wrap: anywhere;
  padding: 5px 10px;
  min-width: 70px;
  max-width: 100%;
  background-color: ${({ ishover }) => (ishover ? '#f4f4fe' : '#fcfcfe')};
  border-right: 1px solid rgba(111, 111, 111, 0.1);
  &:first-of-type {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  &:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  @media screen and (prefers-color-scheme: dark) {
    background-color: ${({ ishover }) => (ishover ? '#2f3e49' : '#293640')};
  }
`;

const StyledTableHeadline = styled(Typography)`
  color: #8494a9;
  font-weight: 600;
  font-size: 12px;
  @media screen and (prefers-color-scheme: dark) {
    color: #f8fafb;
  }
`;

const StyledTableCellText = styled(Typography)`
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  color: #414857;
  font-size: 12px;
  font-weight: 600;
  max-width: 100%;
  @media screen and (prefers-color-scheme: dark) {
    color: #f8fafb;
  }
`;

const CopyIcon = styled(ContentCopy)`
  margin-left: 5px;
  font-size: 12px;
  fill-opacity: 0.5;
  cursor: pointer;
  &:hover {
    fill-opacity: 1;
  }
`;
