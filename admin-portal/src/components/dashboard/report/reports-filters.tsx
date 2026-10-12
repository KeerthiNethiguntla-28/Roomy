import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function ReportsFilters({ searchReports }: { searchReports: (params: { searchQuery: string; filterStatus: string; searchCriteria: string }) => void }): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('pending');
  const [searchCriteria, setSearchCriteria] = React.useState('post');

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={3} direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={1} direction="row" alignItems="center" sx={{ width: '50%' }}>
          <Select
            value={searchCriteria}
            onChange={(e) => {
              setSearchCriteria(e.target.value);
              searchReports({ searchQuery, filterStatus, searchCriteria: e.target.value });
            }}
            displayEmpty
            sx={{ minWidth: '150px' }} // Set a minimum width for the select dropdown
          >
            <MenuItem value="userEmail">User Email</MenuItem>
            <MenuItem value="post">Post ID</MenuItem>
          </Select>
          <OutlinedInput
            defaultValue=""
            fullWidth
            placeholder="Search"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchReports({ searchQuery: e.target.value, filterStatus, searchCriteria });
            }}
            sx={{ width: 'calc(100% - 120px)' }} // Calculate width based on select dropdown width
          />
        </Stack>
        <Select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            searchReports({ searchQuery, filterStatus: e.target.value, searchCriteria });
          }}
          displayEmpty
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
        </Select>
      </Stack>
    </Card>
  );
}
