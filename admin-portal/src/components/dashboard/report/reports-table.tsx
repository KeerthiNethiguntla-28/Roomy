'use client';

import * as React from 'react';
import { Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { CheckFat as CheckIcon } from '@phosphor-icons/react/dist/ssr/CheckFat';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import dayjs from 'dayjs';

import { type Report } from '@/types/report';
import { makeRequest } from '@/lib/services/base-api';
import { statusColors } from '@/styles/theme/color-schemes';

import ReportModal from './report-modal';
import { ReportsFilters } from './reports-filters';

function applyPagination(rows: Report[], page: number, rowsPerPage: number): Report[] {
  return rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
}

export function ReportsTable(): React.JSX.Element {
  const [reports, setReports] = React.useState([] as Report[]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [count, setCount] = React.useState(0);
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null); // State for selected posts
  const [shouldRefetch, setShouldRefetch] = React.useState(false);

  const fetchPendingReports = async () => {
    const res = await makeRequest<Report[]>('reports/all-reports', { status: 'pending' }, 'GET');
    setReports(res);
    setCount(res.length); // Update the count with the total number of reports
    setShouldRefetch(false); // Reset shouldRefetch to false
  };

  React.useEffect(() => {
    void fetchPendingReports();
  }, [page, rowsPerPage, shouldRefetch]);

  const paginatedReports = applyPagination(reports, page, rowsPerPage);

  const rowIds = React.useMemo(() => {
    return paginatedReports.map((report) => report._id);
  }, [paginatedReports]);

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const approveReport = async (reportId: string) => {
    await makeRequest(`reports/${reportId}/handle`, {}, 'PUT', true, { status: 'approved' });
    setShouldRefetch(true);
  };

  const openReportModal = (post: Report) => {
    setSelectedReport(post);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  const searchReports = async ({ searchQuery, filterStatus, searchCriteria }: { searchQuery: string; filterStatus: string; searchCriteria: string }) => {
    const res = await makeRequest<Report[]>(
      'reports/all-reports',
      { [searchCriteria]: searchQuery, status: filterStatus },
      'GET'
    );
    setReports(res);
    setCount(res.length); // Update the count with the total number of reports
  };

  return (
    <>
      <ReportsFilters searchReports={searchReports} />
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Post ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Flagged by</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReports.map((row) => {
                return (
                  <TableRow hover key={row._id} selected={rowIds.includes(row._id)}>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Typography variant="subtitle2">{row.post._id}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={statusColors[row.status]}
                        label={row.status === 'pending' ? 'Pending' : 'Approved'}
                      />
                    </TableCell>
                    <TableCell>{row.user.email}</TableCell>
                    <TableCell>
                      <Chip color="primary" label={dayjs(row.createdAt).format('MMM D, YYYY')} size="small" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {row.status === 'pending' && (
                          <Button
                            color="inherit"
                            startIcon={<CheckIcon fontSize="var(--icon-fontSize-md)" />}
                            onClick={() => approveReport(row._id)}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          color="inherit"
                          startIcon={<EyeIcon fontSize="var(--icon-fontSize-md)" />}
                          onClick={() => {
                            openReportModal(row);
                          }}
                        >
                          View
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={count}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      {selectedReport ? <ReportModal selectedReport={selectedReport} handleCloseModal={handleCloseModal} /> : null}
    </>
  );
}
