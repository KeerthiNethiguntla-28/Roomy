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

import { type Post } from '@/types/post';
import { makeRequest } from '@/lib/services/base-api';
import { statusColors } from '@/styles/theme/color-schemes';

import PostModal from './post-modal';
import { PostsFilters } from './posts-filters';

function applyPagination(rows: Post[], page: number, rowsPerPage: number): Post[] {
  return rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
}

const filterStatusMap: { [key: string]: [string, string] } = {
  'active=false': ['active', 'false'],
  'active=true': ['active', 'true'],
  'approved=false': ['approved', 'false'],
  'approved=true': ['approved', 'true'],
  '': ['', ''],
};

export function PostsTable(): React.JSX.Element {
  const [customers, setCustomers] = React.useState([] as Post[]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [count, setCount] = React.useState(0);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null); // State for selected posts
  const [shouldRefetch, setShouldRefetch] = React.useState(false);

  const fetchCustomers = async () => {
    const res = await makeRequest<Post[]>('posts/all-posts', { approved: 'false' }, 'GET');
    setCustomers(res);
    setCount(res.length); // Update the count with the total number of customers
    setShouldRefetch(false); // Reset shouldRefetch to false
  };

  React.useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, shouldRefetch]);

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  const rowIds = React.useMemo(() => {
    return paginatedCustomers.map((customer) => customer._id);
  }, [paginatedCustomers]);

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const approvePost = async (postId: string) => {
    await makeRequest(`posts/${postId}/approve`, {}, 'PUT');
    setShouldRefetch(true);
  };

  const approveAllPosts = async () => {
    await makeRequest('posts/approve-all', {}, 'POST');
    setShouldRefetch(true);
  };

  const openPostModal = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const searchPosts = async ({
    searchQuery,
    filterStatus,
    searchCriteria,
  }: {
    searchQuery: string;
    filterStatus: string;
    searchCriteria: string;
  }) => {
    const [statusKey, statusValue] = filterStatusMap[filterStatus];

    const res = await makeRequest<Post[]>(
      'posts/all-posts',
      {
        [searchCriteria]: searchQuery,
        ...(statusKey ? { [statusKey]: statusValue } : {}),
      },
      'GET'
    );
    setCustomers(res);
    setCount(res.length);
  };

  return (
    <>
      <PostsFilters onApproveAll={approveAllPosts} searchPosts={searchPosts} />

      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Photos Uploaded</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((row) => {
                return (
                  <TableRow hover key={row._id} selected={rowIds.includes(row._id)}>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Typography variant="subtitle2">{row.title}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={statusColors[row.approved ? 'approved' : 'pending']}
                        label={row.approved ? 'Approved' : 'Pending'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip color={statusColors[row.active ? 'active' : 'inactive']} label={row.active ? 'Active' : 'Inactive'} size="small" />
                    </TableCell>
                    <TableCell>{row?.photos?.length}</TableCell>
                    <TableCell>{row.user.email}</TableCell>
                    <TableCell>
                      <Chip color="primary" label={dayjs(row.createdAt).format('MMM D, YYYY')} size="small" />
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {!row.approved && row.active && (
                          <Button
                            color="inherit"
                            startIcon={<CheckIcon fontSize="var(--icon-fontSize-md)" />}
                            onClick={(e) => {
                              approvePost(row._id);
                            }}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          color="inherit"
                          startIcon={<EyeIcon fontSize="var(--icon-fontSize-md)" />}
                          onClick={() => {
                            openPostModal(row);
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

      {/* Modal for displaying post details */}
      {selectedPost ? <PostModal selectedPost={selectedPost} handleCloseModal={handleCloseModal} /> : null}
    </>
  );
}
