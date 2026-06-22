export interface Salary {
  id?: number;
  employeeName: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary?: number;
}

export interface SalaryFilters {
  search?: string;
  minBaseSalary?: number;
  maxBaseSalary?: number;
  minNetSalary?: number;
  maxNetSalary?: number;
}

export type SalarySortBy = 'id' | 'employeeName' | 'baseSalary' | 'netSalary';
export type SortDirection = 'asc' | 'desc';

export interface SalaryListQuery extends SalaryFilters {
  page?: number;
  size?: number;
  sortBy?: SalarySortBy;
  sortDir?: SortDirection;
}

export interface PagedApiResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
