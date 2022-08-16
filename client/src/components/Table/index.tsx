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
  Collapse,
  Link,
  Tooltip,
  Button,
} from '@mui/material';
import Search from '../Search';
import { visuallyHidden } from '@mui/utils';
import { VulnsColumnData } from '../../pages/Scan';
import noIssuesIcon from '../../assets/no-issues.png';
import { ContentCopy } from '@mui/icons-material';
import { useState } from 'react';
import CircularChart from '../CircularChart';
import exportCsv from '../../assets/csv.png';
import { CSVLink } from 'react-csv';

export default function DynamicTable({ columnsData, rows }: { columnsData: Array<VulnsColumnData>; rows: any[] }) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>(columnsData[0].id);
  const [searchText, setSearchText] = useState('');
  const [rowHover, setRowHover] = useState<number | undefined>(undefined);
  const [rowOpen, setRowOpen] = useState<number | undefined>(undefined);
  const isEmptyTable = rows.length == 0;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const getSortOrderIfExists = () => {
    for (const col of columnsData) {
      if (col.id == orderBy) {
        return col.sortOrder;
      }
    }
  };

  const includesSearchText = (row: any) => {
    let found = false;
    for (const col of columnsData) {
      const stringLines: string[] = Array.isArray(row[col.id]) ? row[col.id] : [row[col.id]];
      for (const line of stringLines) {
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

  const createCell = (col: VulnsColumnData, cellItem: string | string[], rowIndex: number, colIndex: number) => {
    const cellBody: any = [];
    // Add icon if needed
    if (col.iconList && typeof cellItem == 'string' && col.iconList[cellItem]) {
      cellBody.push(
        <img src={col.iconList[cellItem]} height="22px" alt={cellItem} key={cellItem + rowIndex + colIndex} />
      );
    }
    // Add text lines
    const stringLines = Array.isArray(cellItem) ? cellItem : [cellItem];
    stringLines.forEach((line: string, index: number) => {
      cellBody.push(
        <Box
          width={!col.iconList ? 1 : 'inherit'}
          textAlign="left"
          display="flex"
          alignItems="center"
          key={line + index}
        >
          <StyledTableCellText>{line}</StyledTableCellText>
          {line && col.copyIcon && line != 'N/A' && (
            <Tooltip title="Click to Copy" key={'copy tooltip' + index}>
              <CopyIcon
                key={'copy' + index}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigator.clipboard.writeText(line);
                }}
                style={rowHover == rowIndex ? { visibility: 'visible' } : undefined}
              />
            </Tooltip>
          )}
        </Box>
      );
    });
    return (
      <StyledTableCellWrapper
        ishover={+(rowHover == rowIndex)}
        sx={{ maxWidth: col.maxWidth }}
        scope="row"
        role="cell"
        key={rowIndex + colIndex + ''}
      >
        {<StyledCell sx={{ float: col.maxWidth ? 'center' : 'left' }}>{cellBody}</StyledCell>}
      </StyledTableCellWrapper>
    );
  };

  const createHeadCell = (col: VulnsColumnData) => {
    return (
      <StyledTableHeadCellWrapper
        align="left"
        key={col.id}
        sortDirection={orderBy === col.id ? order : false}
        sx={{ maxWidth: col.maxWidth }}
      >
        <TableSortLabel
          active={orderBy === col.id}
          direction={orderBy === col.id ? order : 'asc'}
          onClick={createSortHandler(col.id)}
        >
          <StyledTableHeadCell variant="subtitle2" textTransform="capitalize">
            {col.label || col.id}
          </StyledTableHeadCell>
          {orderBy === col.id && (
            <span style={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
          )}
        </TableSortLabel>
      </StyledTableHeadCellWrapper>
    );
  };

  const createTableButtons = () => {
    return (
      <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <Search
            disabled={isEmptyTable}
            searchText={searchText}
            onSelectChange={(e) => setSearchText(e.target.value)}
          />
          <Typography
            onMouseDown={() => setSearchText('')}
            fontSize="12px"
            sx={{ cursor: isEmptyTable ? 'default' : 'pointer' }}
          >
            Clear
          </Typography>
        </Box>
        <Button
          variant="text"
          sx={{ minWidth: '0', width: 'fit-content', height: '28px' }}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <img src={exportCsv} alt="csv" />
          <CSVLink
            style={{ position: 'absolute', width: '100%', height: '100%', left: 0 }}
            data={rows}
            headers={columnsData.map((col) => ({ label: col.label ?? col.id, key: col.id }))}
          ></CSVLink>
        </Button>
      </Box>
    );
  };

  const filteredRow = searchText == '' ? rows.slice() : rows.slice().filter((row) => includesSearchText(row));
  return (
    <Box sx={{ width: '100%' }}>
      {createTableButtons()}

      <TableContainer sx={{ overflow: 'hidden auto', maxHeight: 'calc(100vh - 430px)' }}>
        <StyledTable aria-label="collapsible table">
          <TableHead>
            <TableRow>{columnsData.map((col) => createHeadCell(col))}</TableRow>
          </TableHead>

          <TableBody>
            {isEmptyTable
              ? noIssuesDetected()
              : filteredRow.sort(getComparator(order, orderBy, getSortOrderIfExists())).map((row, rowIndex) => {
                  const isRowOpen = rowOpen == rowIndex;
                  return (
                    <React.Fragment key={'fragment' + rowIndex}>
                      <TableRow
                        key={'row' + rowIndex}
                        onClick={rowIndex == rowOpen ? () => setRowOpen(undefined) : () => setRowOpen(rowIndex)}
                        onMouseEnter={() => setRowHover(rowIndex)}
                        onMouseLeave={() => setRowHover(undefined)}
                        role="row"
                        tabIndex={-1}
                        sx={{ padding: '0 10px', cursor: 'pointer' }}
                      >
                        {columnsData.map((col, colIndex) => createCell(col, row[col.id], rowIndex, colIndex))}
                      </TableRow>

                      {isRowOpen && (
                        <TableRow role="row" key={'collapse' + rowIndex}>
                          <TableCell
                            colSpan={100}
                            style={{
                              border: isRowOpen ? '1px solid #345b79' : 'none',
                              padding: isRowOpen ? '20px' : '0',
                            }}
                          >
                            <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
                              <Box width="1" display="flex" justifyContent="space-between" maxHeight="250px">
                                <Box paddingRight="20px" display="flex" flexDirection="column" maxWidth={2 / 3}>
                                  <Typography fontWeight="600">Summary:</Typography>
                                  <Box marginBottom="10px" maxHeight="60%" overflow="hidden auto">
                                    <Typography marginRight="10px">{row.summary}</Typography>
                                  </Box>
                                  <Typography fontWeight="600">References:</Typography>
                                  <Box display="flex" flexDirection="column" flex="1" overflow="hidden auto">
                                    {row.references?.map((link: string, index: number) => {
                                      return (
                                        <Link fontSize="13px" key={'link' + index} whiteSpace="nowrap" title={link}>
                                          {link}
                                        </Link>
                                      );
                                    })}
                                  </Box>
                                </Box>
                                <CircularChart
                                  items={
                                    row.impactPaths.length > 0 &&
                                    row.impactPaths[0].length > 0 &&
                                    row.impactPaths[0]
                                      .slice()
                                      .reverse()
                                      .map((path: any) => path.name)
                                  }
                                />
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  );
}

function noIssuesDetected() {
  return (
    <TableRow
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <TableCell colSpan={100}>
        <Box alignItems="center" height="200px" display="flex" flexDirection="column" justifyContent="center">
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

const StyledTable = styled(Table)`
  background-color: #e6e6ed;
  min-width: 750px;
  border-collapse: separate;
  border-spacing: 0 6px;
  border-radius: 6px;
  padding: 0 10px;
  @media screen and (prefers-color-scheme: dark) {
    background-color: #18222b;
  }
`;

const StyledCell = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
`;

const StyledTableCellWrapper = styled(TableCell)<{ ishover: number }>`
  overflow-wrap: anywhere;
  padding: 5px 10px;
  min-width: 70px;
  max-width: 100%;
  background-color: ${({ ishover }) => (ishover ? '#f4f4fe' : '#fcfcfe')};
  border-right: 1px solid rgba(111, 111, 111, 0.1);
  border-bottom: none;
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

const StyledTableHeadCell = styled(Typography)`
  color: #8494a9;
  font-weight: 600;
  font-size: 12px;
  @media screen and (prefers-color-scheme: dark) {
    color: #f8fafb;
  }
`;

const StyledTableHeadCellWrapper = styled(TableCell)`
  background-color: transparent;
  border: 0;
  padding: 10px;
  padding-right: 0;
  min-width: 70px;
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
  visibility: hidden;
  margin-left: 5px;
  font-size: 12px;
  fill-opacity: 0.5;
  cursor: pointer;
  &:hover {
    fill-opacity: 1;
  }
`;
