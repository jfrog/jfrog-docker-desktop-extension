import * as React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  styled,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import criticalSeverity from '../../assets/severityIcons/critical_severity.png';

interface Column {
  id: string;
  label: string;
  maxWidth?: number;
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

interface TableHeadlineProps {
  columnNames: string[];
  onRequestSort: (event: React.MouseEvent<unknown>, columnId: string) => void;
  order: Order;
  orderBy: string;
}

function TableHeadline(props: TableHeadlineProps) {
  const { columnNames, order, orderBy, onRequestSort } = props;
  const createSortHandler = (columnId: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, columnId);
  };

  return (
    <TableHead>
      <TableRow>
        {columnNames.map((columnName) => (
          <TableCell align="center" key={columnName} sortDirection={orderBy === columnName ? order : false}>
            <TableSortLabel
              active={orderBy === columnName}
              direction={orderBy === columnName ? order : 'asc'}
              onClick={createSortHandler(columnName)}
            >
              <Typography
                color="#8494A9"
                variant="subtitle2"
                style={orderBy != columnName ? { marginLeft: '24px' } : {}}
              >
                {splitCamelCase(columnName)}
              </Typography>
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

export default function DynamicTable({ columnNames, rows }: { columnNames: string[]; rows: any[] }) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(columnNames[0]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event: React.MouseEvent<unknown>, columnName: string) => {
    const isAsc = orderBy === columnName && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnName);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{
              backgroundColor: '#E6E6ED',
              minWidth: 750,
              borderCollapse: 'separate',
              borderSpacing: '0 10px',
              padding: '0 10px',
            }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <TableHeadline
              columnNames={columnNames}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {rows
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i} sx={{ padding: '0 10px' }}>
                      {columnNames.map((columnName, j) => {
                        return (
                          <StyledCell key={columnName + i + j} align="center">
                            <Box display="flex" flexDirection="column" alignItems="center">
                              {j == 0 ? <img src={criticalSeverity} height="30px" alt="criticalSeverity" /> : ''}
                              <Typography variant="subtitle2">{row[columnName]}</Typography>
                            </Box>
                          </StyledCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ backgroundColor: '#E6E6ED' }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

const StyledTable = styled(Table)`
  background-color: #e6e6ed;
  min-width: 750;
  border-collapse: separate;
  border-spacing: 0 10px;
  border-radius: 6px;
  padding: 0 10px;
`;

const StyledCell = styled(TableCell)`
  background-color: #fcfcfe;
  border-right: 1px solid rgba(111, 111, 111, 0.2);
  &:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  &:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;
