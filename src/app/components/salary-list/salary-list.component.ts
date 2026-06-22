import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Salary } from '../../models/salary.model';
import { SalaryService } from '../../services/salary.service';

export interface SalaryFilters {
  search?: string;
  minBaseSalary?: number;
  maxBaseSalary?: number;
  minNetSalary?: number;
  maxNetSalary?: number;
}

@Component({
  selector: 'app-salary-list',
  templateUrl: './salary-list.component.html',
  styleUrls: ['./salary-list.component.css']
})
export class SalaryListComponent implements OnInit {
  salaries: Salary[] = [];
  loading = true;
  exporting = false;
  error = '';
  deleteConfirmId: number | null = null;
  filters: SalaryFilters = { search: '' };
  sortBy = 'id';
  sortDir = 'desc';
  
  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 1;
  pageSizeOptions = [5, 10, 25, 50];

  constructor(
    private salaryService: SalaryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalaries();
  }

  loadSalaries(): void {
    this.loading = true;
    console.log('Salary List - Loading salaries with filters:', this.filters);
    this.salaryService.getSalaries(this.filters, this.page, this.size, this.sortBy, this.sortDir).subscribe({
      next: (data) => {
        console.log('Salary List - Data loaded:', data);
        if (data.content) {
          this.salaries = data.content;
          this.totalElements = data.totalElements || 0;
          this.totalPages = data.totalPages || 1;
        } else {
          this.salaries = Array.isArray(data) ? data : [];
          this.totalElements = this.salaries.length;
          this.totalPages = 1;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Salary List - Failed to load salaries:', err);
        this.error = err?.error?.message || 'Failed to load salaries';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadSalaries();
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
  }

  deleteSalary(id: number): void {
    this.salaryService.deleteSalary(id).subscribe({
      next: () => {
        this.salaries = this.salaries.filter(s => s.id !== id);
        this.deleteConfirmId = null;
      },
      error: () => {
        this.error = 'Failed to delete salary record.';
      }
    });
  }

  editSalary(id: number): void {
    this.router.navigate(['/salaries/edit', id]);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  }

  getTotalSalaries(): number {
    return this.salaries.reduce((sum, s) => sum + (s.netSalary || 0), 0);
  }

  getAverageSalary(): number {
    if (this.salaries.length === 0) return 0;
    return this.getTotalSalaries() / this.salaries.length;
  }

  exportCsv(): void {
    this.exporting = true;
    this.salaryService.exportCsv(this.filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `salaries_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.exporting = false;
      },
      error: () => {
        this.error = 'Failed to export CSV.';
        this.exporting = false;
      }
    });
  }

  clearFilters(): void {
    this.filters = { search: '' };
    this.sortBy = 'id';
    this.sortDir = 'desc';
    this.loadSalaries();
  }

  changeSort(field: string): void {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = 'asc';
    }
    this.page = 0;
    this.loadSalaries();
  }

  getSortIndicator(field: string): string {
    if (this.sortBy !== field) return '';
    return this.sortDir === 'asc' ? '▲' : '▼';
  }

  goToPreviousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadSalaries();
    }
  }

  goToNextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadSalaries();
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.size = parseInt(target.value);
    this.page = 0;
    this.loadSalaries();
  }

  getPageStart(): number {
    return this.page * this.size + 1;
  }

  getPageEnd(): number {
    return Math.min((this.page + 1) * this.size, this.totalElements);
  }
}