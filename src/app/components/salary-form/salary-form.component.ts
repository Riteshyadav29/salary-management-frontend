import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryService } from '../../services/salary.service';
import { Salary } from '../../models/salary.model';

@Component({
  selector: 'app-salary-form',
  templateUrl: './salary-form.component.html',
  styleUrls: ['./salary-form.component.css']
})
export class SalaryFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  salaryId: number | null = null;
  loading = false;
  error = '';
  calculatedNetSalary = 0;

  constructor(
    private fb: FormBuilder,
    private salaryService: SalaryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.salaryId = this.route.snapshot.params['id'];
    if (this.salaryId) {
      this.isEditMode = true;
      this.loadSalary(this.salaryId);
    }
    this.calculateNetSalary();
  }

  initForm(): void {
    this.form = this.fb.group({
      employeeName: ['', [Validators.required, Validators.minLength(2)]],
      baseSalary: [0, [Validators.required, Validators.min(0)]],
      bonus: [0, [Validators.required, Validators.min(0)]],
      deductions: [0, [Validators.required, Validators.min(0)]]
    });

    this.form.valueChanges.subscribe(() => this.calculateNetSalary());
  }

  loadSalary(id: number): void {
    this.loading = true;
    this.salaryService.getSalaryById(id).subscribe({
      next: (salary) => {
        this.form.patchValue(salary);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load salary record.';
        this.loading = false;
      }
    });
  }

  calculateNetSalary(): void {
    const { baseSalary, bonus, deductions } = this.form.value;
    this.calculatedNetSalary = (baseSalary || 0) + (bonus || 0) - (deductions || 0);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const salary: Salary = this.form.value;

    if (this.isEditMode && this.salaryId) {
      this.salaryService.updateSalary(this.salaryId, salary).subscribe({
        next: () => {
          this.router.navigate(['/salaries']);
        },
        error: () => {
          this.error = 'Failed to update salary record.';
          this.loading = false;
        }
      });
    } else {
      this.salaryService.createSalary(salary).subscribe({
        next: () => {
          this.router.navigate(['/salaries']);
        },
        error: () => {
          this.error = 'Failed to create salary record.';
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/salaries']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.form.get(field);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}
