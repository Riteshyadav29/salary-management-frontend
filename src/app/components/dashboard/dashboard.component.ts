import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Salary } from '../../models/salary.model';
import { SalaryService } from '../../services/salary.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  salaries: Salary[] = [];
  loading = true;

  constructor(
    private salaryService: SalaryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadSalaries();
  }

  loadSalaries(): void {
    this.salaryService.getSalaries().subscribe({
      next: (data) => {
        console.log('Dashboard - Salaries loaded:', data);
        this.salaries = data.content || data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard - Failed to load salaries:', err);
        this.loading = false;
      }
    });
  }

  getTotalSalaries(): number {
    return this.salaries.length;
  }

  getTotalAmount(): number {
    return this.salaries.reduce((sum, s) => sum + (s.netSalary || 0), 0);
  }

  getAverageSalary(): number {
    if (this.salaries.length === 0) return 0;
    return this.getTotalAmount() / this.salaries.length;
  }

  getTotalBonus(): number {
    return this.salaries.reduce((sum, s) => sum + (s.bonus || 0), 0);
  }

  getTotalDeductions(): number {
    return this.salaries.reduce((sum, s) => sum + (s.deductions || 0), 0);
  }

  getHighestSalary(): Salary | undefined {
    return this.salaries.reduce((max, s) => 
      (!max || (s.netSalary || 0) > (max.netSalary || 0)) ? s : max, undefined as Salary | undefined);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getTopEarners(): Salary[] {
    return [...this.salaries]
      .sort((a, b) => (b.netSalary || 0) - (a.netSalary || 0))
      .slice(0, 5);
  }
}