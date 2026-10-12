import { makeRequest } from '@/lib/services/base-api';
import type { DashboardData } from './page';

export async function fetchData(): Promise<DashboardData> {
  return makeRequest<DashboardData>('dashboard', {}, 'GET');
}
