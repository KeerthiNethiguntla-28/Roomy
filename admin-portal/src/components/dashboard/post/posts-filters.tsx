import * as React from 'react';
import { Grid, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { SealCheck as UploadIcon } from '@phosphor-icons/react/dist/ssr/SealCheck';

export function PostsFilters({ onApproveAll, searchPosts }: { onApproveAll: () => void; searchPosts: (params: { searchQuery: string; filterStatus: string; searchCriteria: string }) => void }): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('approved=false');
  const [searchCriteria, setSearchCriteria] = React.useState('post');

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    searchPosts({ searchQuery: event.target.value, filterStatus, searchCriteria });
  };

  const handleFilterStatusChange = (event: SelectChangeEvent<string>) => {
    setFilterStatus(event.target.value as string);
    searchPosts({ searchQuery, filterStatus: event.target.value as string, searchCriteria });
  };

  const handleSearchCriteriaChange = (event: SelectChangeEvent<string>) => {
    setSearchCriteria(event.target.value as string);
    searchPosts({ searchQuery, filterStatus, searchCriteria: event.target.value as string });
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={6}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Select
              value={searchCriteria}
              onChange={handleSearchCriteriaChange}
              displayEmpty
              fullWidth
              sx={{ maxWidth: '120px' }}
            >
              <MenuItem value="post">Post ID</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="description">Description</MenuItem>
              <MenuItem value="userEmail">User Email</MenuItem>
            </Select>
            <OutlinedInput
              defaultValue=""
              fullWidth
              placeholder="Search Posts"
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                </InputAdornment>
              }
              onChange={handleSearchQueryChange}
              sx={{ maxWidth: '700px' }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={6} container justifyContent="flex-end" spacing={3}>
          <Grid item>
            <Select value={filterStatus} onChange={handleFilterStatusChange} displayEmpty fullWidth>
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="approved=false">Pending</MenuItem>
              <MenuItem value="approved=true">Approved</MenuItem>
              <MenuItem value="active=true">Active</MenuItem>
              <MenuItem value="active=false">Inactive</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
              onClick={onApproveAll}
              variant="contained"
            >
              Approve All
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
