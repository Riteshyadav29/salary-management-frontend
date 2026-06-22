import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SalaryListComponent } from './components/salary-list/salary-list.component';
import { SalaryFormComponent } from './components/salary-form/salary-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'salaries', component: SalaryListComponent, canActivate: [AuthGuard] },
  { path: 'salaries/new', component: SalaryFormComponent, canActivate: [AuthGuard] },
  { path: 'salaries/edit/:id', component: SalaryFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}