# Angular Frontend - Salary Management System

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 18+ (`npm install -g @angular/cli`)

## Installation

```bash
cd "Angular Frontend"
npm install
```

## Development

Run the backend Spring Boot app first (on port 8080), then start the Angular dev server:

```bash
npm start
```

Navigate to `http://localhost:4200`. The app will automatically reload on file changes.

## API Proxy

The Angular dev server proxies `/api` requests to `http://localhost:8080` (Spring Boot backend). Configure in `src/proxy.conf.json`.

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/           # Navigation bar
│   │   ├── salary-list/      # Salary list table view
│   │   └── salary-form/      # Add/Edit salary form
│   ├── models/
│   │   └── salary.model.ts   # Salary interface
│   ├── services/
│   │   └── salary.service.ts # HTTP API service
│   ├── app-routing.module.ts # Routes configuration
│   ├── app.module.ts         # Main module
│   └── app.component.*       # Root component
├── environments/
│   ├── environment.ts       # Dev environment
│   └── environment.prod.ts   # Production environment
└── styles.css               # Global styles
```

## Routes

| URL | Component | Description |
|-----|-----------|-------------|
| `/salaries` | SalaryListComponent | List all salaries |
| `/salaries/new` | SalaryFormComponent | Add new salary |
| `/salaries/edit/:id` | SalaryFormComponent | Edit existing salary |

## Features

- **List View**: Display all salaries in a responsive table
- **Add Employee**: Form to create new salary records
- **Edit Employee**: Pre-filled form to update existing records
- **Delete**: Confirmation before deleting records
- **Auto-calculation**: Net salary = Base + Bonus - Deductions
- **Responsive Design**: Works on desktop and mobile
