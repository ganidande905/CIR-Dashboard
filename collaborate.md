# Project Structure

```
api/
├── collaborate.md
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
│
├── generated/
│   └── prisma/
│       ├── client.d.ts
│       ├── client.js
│       ├── default.d.ts
│       ├── default.js
│       ├── edge.d.ts
│       ├── edge.js
│       ├── index-browser.js
│       ├── index.d.ts
│       ├── index.js
│       ├── package.json
│       ├── query_compiler_bg.js
│       ├── query_compiler_bg.wasm-base64.js
│       ├── schema.prisma
│       ├── wasm-edge-light-loader.mjs
│       ├── wasm-worker-loader.mjs
│       └── runtime/
│           └── ...
│
├── logs/
│   └── app.log
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       ├── migration_lock.toml
│       └── 20251211055541_init/
│           └── migration.sql
│
├── src/
│   ├── all-exceptions.filter.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   │
│   ├── assignment/
│   │   ├── assignment.controller.spec.ts
│   │   ├── assignment.controller.ts
│   │   ├── assignment.module.ts
│   │   ├── assignment.service.spec.ts
│   │   └── assignment.service.ts
│   │
│   ├── auth/
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   ├── guards/
│   │   │   └── roles.guard.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   └── entity/
│   │       └── auth.entity.ts
│   │
│   ├── comments/
│   │   ├── comments.controller.spec.ts
│   │   ├── comments.controller.ts
│   │   ├── comments.module.ts
│   │   ├── comments.service.spec.ts
│   │   └── comments.service.ts
│   │
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── database.service.spec.ts
│   │   └── database.service.ts
│   │
│   ├── departments/
│   │   ├── departments.controller.spec.ts
│   │   ├── departments.controller.ts
│   │   ├── departments.module.ts
│   │   ├── departments.service.spec.ts
│   │   └── departments.service.ts
│   │
│   ├── employees/
│   │   ├── employees.controller.spec.ts
│   │   ├── employees.controller.ts
│   │   ├── employees.module.ts
│   │   ├── employees.service.spec.ts
│   │   ├── employees.service.ts
│   │   └── dto/
│   │       └── change-password.dto.ts
│   │
│   ├── logger/
│   │   ├── logger.module.ts
│   │   ├── logger.service.spec.ts
│   │   └── logger.service.ts
│   │
│   ├── responsibilities/
│   │   ├── responsibilities.controller.spec.ts
│   │   ├── responsibilities.controller.ts
│   │   ├── responsibilities.module.ts
│   │   ├── responsibilities.service.spec.ts
│   │   └── responsibilities.service.ts
│   │
│   ├── sub-departments/
│   │   ├── sub-departments.controller.spec.ts
│   │   ├── sub-departments.controller.ts
│   │   ├── sub-departments.module.ts
│   │   ├── sub-departments.service.spec.ts
│   │   └── sub-departments.service.ts
│   │
│   ├── users/
│   │   ├── users.controller.spec.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.spec.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   └── work-submission/
│       ├── work-submission.controller.spec.ts
│       ├── work-submission.controller.ts
│       ├── work-submission.module.ts
│       ├── work-submission.service.spec.ts
│       └── work-submission.service.ts
│
└── test/
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

---

## Module Explanations

### 📁 `all-exceptions.filter.ts`
**Global Exception Filter** - Centralized error handling for the entire application.

| Feature | Description |
|---------|-------------|
| Purpose | Catches all unhandled exceptions and formats consistent error responses |
| Handles | `HttpException`, `PrismaClientValidationError`, and generic errors |
| Logging | Integrates with `LoggerService` to log all errors to file |
| Response Format | Returns structured JSON with `statusCode`, `timestamp`, `path`, and `response` |

---

### 📁 `auth/`
**Authentication & Authorization Module** - JWT-based authentication with Role-Based Access Control (RBAC) and Sub-Department isolation.

| File | Description |
|------|-------------|
| `auth.service.ts` | Handles user login by validating email/password against the Employee table. Uses bcrypt for password comparison and issues JWT tokens containing `userId`, `role`, `departmentId`, and `subDepartmentId`. |
| `auth.controller.ts` | Exposes `/auth/login` endpoint for authentication. |
| `auth.module.ts` | NestJS module that configures JWT with secret and expiration settings. |
| `jwt.strategy.ts` | Passport JWT strategy for validating tokens. Extracts user from token payload and returns user object with `id`, `email`, `name`, `role`, `departmentId`, and `subDepartmentId`. |
| `jwt-auth.guard.ts` | Guard to protect routes requiring authentication. |
| `decorators/roles.decorator.ts` | Custom `@Roles()` decorator to define which roles can access specific endpoints. Uses `SetMetadata` to attach role requirements to route handlers. |
| `guards/roles.guard.ts` | Guard that checks if the authenticated user's role matches the required roles defined by `@Roles()` decorator. Works in conjunction with `JwtAuthGuard`. |
| `dto/login.dto.ts` | DTO with validation for email (required, valid format) and password (required, min 6 chars). |
| `entity/auth.entity.ts` | Response entity containing `accessToken`. |

---

### 📁 `comments/`
**Comments Module** - Manages comments on work submissions.

| File | Description |
|------|-------------|
| `comments.service.ts` | CRUD operations for comments. Supports filtering by `submissionId` and `authorId`. Includes submission and author details in responses. |
| `comments.controller.ts` | REST API endpoints for comment management. |
| `comments.module.ts` | NestJS module configuration. |

**Comment Model Fields:**
- `id`, `content`, `isManagerComment`, `createdAt`, `updatedAt`
- Relations: `submission` (WorkSubmission), `author` (Employee)

---

### 📁 `database/`
**Database Module** - Core database connection layer using Prisma ORM.

| File | Description |
|------|-------------|
| `database.service.ts` | Extends `PrismaClient` and handles database connection initialization on module startup (`onModuleInit`). Acts as the central database service injected into all other modules. |
| `database.module.ts` | NestJS module that provides and exports the `DatabaseService` for use across the application. |

---

### 📁 `employees/`
**Employees Module** - Manages employee/staff records with sub-department level access control.

| File | Description |
|------|-------------|
| `employees.service.ts` | Handles CRUD operations for employees. Includes `findAllScoped()` for role-based data access: STAFF sees only themselves, MANAGER sees only their sub-department, ADMIN sees all. Supports `changePassword()` with bcrypt hashing. |
| `employees.controller.ts` | Exposes REST API endpoints for employee management with `@UseGuards(JwtAuthGuard, RolesGuard)`. |
| `employees.module.ts` | NestJS module that registers the controller and service. |
| `dto/change-password.dto.ts` | DTO for password change operations with `currentPassword` and `newPassword` fields. |

**Employee Model Fields:**
- `id`, `email`, `name`, `password`, `role`, `jobTitle`, `isActive`, `createdAt`, `updatedAt`
- Relations: `department`, `subDepartment`, `managedSubDept`, `assignments`, `createdResponsibilities`, `workSubmissions`, `verifiedSubmissions`, `notifications`, `comments`, `createdBy`, `createdEmployees`

**Access Control:**
| Action | ADMIN | MANAGER | STAFF |
|--------|:-----:|:-------:|:-----:|
| View All | All employees | Own sub-dept only | Self only |
| Create | ✅ | ❌ | ❌ |
| Update | ✅ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ |
| Change Password | ✅ | ✅ | ✅ (own) |

---

### 📁 `departments/`
**Departments Module** - Manages organizational departments.

| File | Description |
|------|-------------|
| `departments.service.ts` | CRUD operations for departments with filtering by `DepartmentType`. Each department can have multiple sub-departments and employees. |
| `departments.controller.ts` | REST API endpoints for department management. |
| `departments.module.ts` | NestJS module configuration. |

**Department Model Fields:**
- `id`, `name`, `type`, `description`, `isActive`, `createdAt`, `updatedAt`
- Relations: `subDepartments`, `Employees`

---

### 📁 `sub-departments/`
**Sub-Departments Module** - Manages sub-divisions within departments.

| File | Description |
|------|-------------|
| `sub-departments.service.ts` | CRUD operations for sub-departments with filtering by `SubDepartmentType`. Each sub-department belongs to a parent department and can have a manager and staff members. |
| `sub-departments.controller.ts` | REST API endpoints for sub-department management. |
| `sub-departments.module.ts` | NestJS module configuration. |

**SubDepartment Model Fields:**
- `id`, `name`, `type`, `description`, `isActive`, `createdAt`, `updatedAt`, `departmentId`, `managerId`
- Relations: `department`, `manager`, `staff`, `responsibilities`

---

### 📁 `logger/`
**Logger Module** - Custom logging service with file output.

| File | Description |
|------|-------------|
| `logger.service.ts` | Extends NestJS `ConsoleLogger`. Logs messages to both console and file (`logs/app.log`). Formats entries with timestamp (Asia/Kolkata timezone). |
| `logger.module.ts` | NestJS module configuration. |

**Features:**
- Automatic log directory creation
- Formatted timestamps with date and time
- Supports `log()` and `error()` methods
- Used by `AllExceptionsFilter` for error logging

---

### 📁 `responsibilities/`
**Responsibilities Module** - Manages tasks and responsibilities with sub-department level access control.

| File | Description |
|------|-------------|
| `responsibilities.service.ts` | CRUD operations for responsibilities. Includes `findAllScoped()` for role-based data access: STAFF sees only assigned responsibilities, MANAGER sees only their sub-department, ADMIN sees all. Supports hierarchical sub-responsibilities. |
| `responsibilities.controller.ts` | REST API endpoints for responsibility management with scoped access. |
| `responsibilities.module.ts` | NestJS module configuration. |

**Responsibility Model Fields:**
- `id`, `title`, `description`, `cycle` (monthly format: "YYYY-MM"), `isActive`, `createdAt`, `updatedAt`
- Relations: `subDepartment`, `createdBy`, `assignments`, `parent`, `subResponsibilities`

**Access Control:**
| Action | ADMIN | MANAGER | STAFF |
|--------|:-----:|:-------:|:-----:|
| View | All | Own sub-dept | Assigned only |
| Create | ✅ | ✅ | ❌ |
| Update | ✅ | Own sub-dept | ❌ |
| Delete | ✅ | ❌ | ❌ |

---

### 📁 `assignment/`
**Assignment Module** - Manages the assignment of responsibilities to staff members with sub-department isolation.

| File | Description |
|------|-------------|
| `assignment.service.ts` | CRUD operations for `ResponsibilityAssignment`. Includes `findAllScoped()` for role-based access: STAFF sees only their own assignments, MANAGER sees only their sub-department, ADMIN sees all. |
| `assignment.controller.ts` | REST API endpoints for assignment management with scoped access. |
| `assignment.module.ts` | NestJS module configuration. |

**ResponsibilityAssignment Model Fields:**
- `id`, `status`, `assignedAt`, `dueDate`, `updatedAt`
- Relations: `responsibility`, `staff`, `workSubmission`

**Access Control:**
| Action | ADMIN | MANAGER | STAFF |
|--------|:-----:|:-------:|:-----:|
| View | All | Own sub-dept | Own only |
| Create | ✅ | ✅ (own sub-dept) | ❌ |
| Update | ✅ | Own sub-dept | ❌ |
| Delete | ✅ | ❌ | ❌ |

---

### 📁 `work-submission/`
**Work Submission Module** - Manages staff work submissions with verification workflow and sub-department isolation.

| File | Description |
|------|-------------|
| `work-submission.service.ts` | CRUD operations for work submissions. Includes `findAllScoped()` for role-based access, `createProtected()` to ensure staff can only submit their own work, `updateProtected()` to block verification fields, and `verifySubmission()` for manager/admin verification with sub-department checks. |
| `work-submission.controller.ts` | REST API endpoints including `POST :id/verify` for verification. |
| `work-submission.module.ts` | NestJS module configuration. |
| `dto/verify-submission.dto.ts` | DTO for verification with `approved` (boolean) and `managerComment` (string) fields. |

**WorkSubmission Model Fields:**
- `id`, `hoursWorked`, `workProofType`, `workProofUrl`, `workProofText`, `staffComment`, `managerComment`, `submittedAt`, `verifiedAt`, `updatedAt`
- Relations: `assignment`, `staff`, `verifiedBy`, `comments`

**Access Control:**
| Action | ADMIN | MANAGER | STAFF |
|--------|:-----:|:-------:|:-----:|
| View | All | Own sub-dept | Own only |
| Create | ✅ (any) | ❌ | ✅ (own only) |
| Update | ✅ | ❌ | ✅ (own only) |
| Delete | ✅ | ❌ | ❌ |
| Verify | ✅ (any) | ✅ (own sub-dept) | ❌ |

**Key Security Features:**
- Staff cannot submit work for other employees
- Managers cannot submit work submissions (only verify)
- Verification restricted to same sub-department for managers
- `updateProtected()` blocks verification fields from direct modification
- Assignment status automatically updated to `VERIFIED` or `REJECTED` after verification

---

### 📁 `users/`
**Users Module** - In-memory user management (demo/testing purposes).

| File | Description |
|------|-------------|
| `users.service.ts` | In-memory CRUD operations for users. Uses a hardcoded array of users for demonstration. Supports filtering by role. |
| `users.controller.ts` | REST API endpoints for user management. |
| `users.module.ts` | NestJS module configuration. |
| `dto/create-user.dto.ts` | Data Transfer Object for creating users. |
| `dto/update-user.dto.ts` | Data Transfer Object for updating users. |

> ⚠️ **Note:** This module uses in-memory storage and is likely for testing/demo purposes. Production user management should use the `employees` module with database persistence.

---

### 📁 `prisma/`
**Prisma Configuration** - Database schema and migrations.

| File | Description |
|------|-------------|
| `schema.prisma` | Defines the database schema including all models (Employee, Department, SubDepartment, Responsibility, ResponsibilityAssignment, WorkSubmission, Comment, Notification). Uses PostgreSQL as the database provider. |
| `migrations/` | Contains migration history for database version control. |

---

### 📁 `generated/prisma/`
**Generated Prisma Client** - Auto-generated TypeScript client for database operations.

This folder contains the Prisma Client generated from `schema.prisma`. It provides type-safe database access methods used by the `DatabaseService`.

---

### 📁 `logs/`
**Application Logs** - Log files generated by the LoggerService.

| File | Description |
|------|-------------|
| `app.log` | Contains all application logs with timestamps in Asia/Kolkata timezone. |

---

### 📁 `test/`
**End-to-End Tests** - Integration testing configuration.

| File | Description |
|------|-------------|
| `app.e2e-spec.ts` | E2E test specifications for the application. |
| `jest-e2e.json` | Jest configuration for E2E testing. |

---

## Database Schema Overview

```
Employee ─────┬──── Department
              │         │
              │         └──── SubDepartment ──── Responsibility
              │                    │                   │
              └────────────────────┴───── ResponsibilityAssignment
                                                       │
                                                 WorkSubmission ──── Comment
                                                       │
                                                 Notification
```

### Enums

| Enum | Values |
|------|--------|
| **Role** | `ADMIN`, `MANAGER`, `STAFF` |
| **DepartmentType** | `TEACHING`, `NON_TEACHING` |
| **SubDepartmentType** | `QUANTS`, `VERBALS`, `SOFTSKILLS`, `SKILLS`, `ADMINISTRATION` |
| **AssignmentStatus** | `PENDING`, `IN_PROGRESS`, `SUBMITTED`, `VERIFIED`, `REJECTED` |
| **NotificationType** | `ASSIGNMENT_CREATED`, `WORK_SUBMITTED`, `WORK_VERIFIED`, `WORK_REJECTED`, `RESPONSIBILITY_UPDATED`, `RESPONSIBILITY_DELETED`, `PROMOTED_TO_MANAGER`, `ACCOUNT_CREATED` |
| **WorkProofType** | `PDF`, `IMAGE`, `TEXT` |

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `@nestjs/common`, `@nestjs/core` | Core NestJS framework |
| `@nestjs/config` | Configuration management |
| `@nestjs/jwt`, `@nestjs/passport` | JWT authentication |
| `@nestjs/throttler` | Rate limiting |
| `@prisma/client`, `prisma` | Database ORM |
| `bcrypt` | Password hashing |
| `class-validator`, `class-transformer` | DTO validation |
| `passport`, `passport-jwt` | Authentication strategies |

---

## Authentication Flow

1. User sends POST request to `/auth/login` with email and password
2. `AuthService` validates credentials against Employee table using bcrypt
3. On success, JWT token is issued containing `userId`, `role`, `departmentId`, and `subDepartmentId`
4. Protected routes use `@UseGuards(JwtAuthGuard)` decorator
5. `JwtStrategy` validates token and attaches user (with role and sub-department info) to request

**JWT Payload Structure:**
```json
{
  "userId": 3,
  "role": "MANAGER",
  "departmentId": 2,
  "subDepartmentId": 1,
  "iat": 1768557261,
  "exp": 1768557561
}

---

## Authorization (RBAC) Flow

```
Request → JwtAuthGuard → RolesGuard → Controller → Service (Scoped Access)
              ↓              ↓                           ↓
         Validates      Checks if              Filters data by
         JWT token      user.role              subDepartmentId
                        matches @Roles()
```

### Role Definitions

| Role | Description | Scope |
|------|-------------|-------|
| `ADMIN` | System administrator | Full access to ALL departments and sub-departments |
| `MANAGER` | Sub-department manager | Access restricted to OWN sub-department only |
| `STAFF` | Regular employee | Access restricted to OWN data only |

### Sub-Department Isolation

The system enforces **sub-department level isolation** for Managers and Staff:

- **ADMIN**: No restrictions, can access all data across all departments
- **MANAGER**: Can only view/manage employees, responsibilities, assignments, and work submissions within their assigned sub-department
- **STAFF**: Can only view/manage their own profile, assignments, and work submissions

### Scoped Service Methods

All major services implement `*Scoped()` methods for data isolation:

| Service | Scoped Method | Description |
|---------|---------------|-------------|
| `EmployeesService` | `findAllScoped()` | Filters employees by sub-department |
| `ResponsibilitiesService` | `findAllScoped()` | Filters responsibilities by sub-department |
| `AssignmentService` | `findAllScoped()` | Filters assignments by sub-department |
| `WorkSubmissionService` | `findAllScoped()` | Filters work submissions by sub-department |

### RBAC Usage Example

```typescript
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)  // Apply both guards
export class EmployeesController {

  @Post()
  @Roles('ADMIN')  // Only ADMIN can create
  create(@Body() dto: CreateEmployeeDto) { ... }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'STAFF')  // All can access, but data is SCOPED
  findAll(@Request() req) {
    return this.service.findAllScoped(
      req.user.id,
      req.user.role,
      req.user.subDepartmentId  // Used for filtering
    );
  }

  @Post('change-password')
  // No @Roles() = any authenticated user
  changePassword() { ... }
}
```

### RBAC Implementation Files

| File | Purpose |
|------|---------|
| `auth/decorators/roles.decorator.ts` | Defines `@Roles()` decorator using `SetMetadata` |
| `auth/guards/roles.guard.ts` | Implements `CanActivate` to check user role against required roles |

---

## Work Submission & Verification Flow

### Submission Lifecycle

```
Create Responsibility → Assign to Staff → Staff Logs Work → Staff Submits → Manager Verifies
      (ADMIN)            (MANAGER)          (STAFF)          (STAFF)        (MANAGER)
```

### Work Submission Access Control

| Action | ADMIN | MANAGER | STAFF |
|--------|:-----:|:-------:|:-----:|
| View Submissions | All | Own sub-dept | Own only |
| Create Submission | ✅ (any) | ❌ | ✅ (own only) |
| Update Submission | ✅ | ❌ | ✅ (own only) |
| Verify Submission | ✅ (any) | ✅ (own sub-dept) | ❌ |

### Verification Endpoint

```
POST /work-submission/:id/verify
```

**Request Body:**
```json
{
  "approved": true,
  "managerComment": "Good work, approved!"
}
```

**Access Rules:**
- STAFF: ❌ Cannot verify (403 Forbidden)
- MANAGER: ✅ Only submissions within their sub-department
- ADMIN: ✅ Can verify any submission

**Response (Success):**
```json
[
  {
    "id": 15,
    "hoursWorked": 6.5,
    "verifiedAt": "2026-01-17T08:00:00.000Z",
    "verifiedById": 3,
    "managerComment": "Good work, approved!"
  },
  {
    "id": 7,
    "status": "VERIFIED"
  }
]
```

### Protected Update

The `updateProtected()` method blocks verification fields from being set directly:
- Staff cannot set `verifiedAt`, `verifiedById`, or `verifiedBy`
- Redirects to proper verification endpoint

---

## Complete Access Matrix

### Employees

| Endpoint | ADMIN | MANAGER | STAFF |
|----------|:-----:|:-------:|:-----:|
| `POST /employees` | ✅ | ❌ | ❌ |
| `GET /employees` | All | Own sub-dept | Self only |
| `GET /employees/:id` | ✅ | Own sub-dept | Self only |
| `PATCH /employees/:id` | ✅ | ❌ | ❌ |
| `DELETE /employees/:id` | ✅ | ❌ | ❌ |
| `POST /employees/change-password` | ✅ | ✅ | ✅ |

### Responsibilities

| Endpoint | ADMIN | MANAGER | STAFF |
|----------|:-----:|:-------:|:-----:|
| `POST /responsibilities` | ✅ | ✅ | ❌ |
| `GET /responsibilities` | All | Own sub-dept | Assigned only |
| `GET /responsibilities/:id` | ✅ | Own sub-dept | Assigned only |
| `PATCH /responsibilities/:id` | ✅ | Own sub-dept | ❌ |
| `DELETE /responsibilities/:id` | ✅ | ❌ | ❌ |

### Assignments

| Endpoint | ADMIN | MANAGER | STAFF |
|----------|:-----:|:-------:|:-----:|
| `POST /assignment` | ✅ | ✅ (own sub-dept) | ❌ |
| `GET /assignment` | All | Own sub-dept | Own only |
| `GET /assignment/:id` | ✅ | Own sub-dept | Own only |
| `PATCH /assignment/:id` | ✅ | Own sub-dept | ❌ |
| `DELETE /assignment/:id` | ✅ | ❌ | ❌ |

### Work Submissions

| Endpoint | ADMIN | MANAGER | STAFF |
|----------|:-----:|:-------:|:-----:|
| `POST /work-submission` | ✅ | ❌ | ✅ (own only) |
| `GET /work-submission` | All | Own sub-dept | Own only |
| `GET /work-submission/:id` | ✅ | Own sub-dept | Own only |
| `PATCH /work-submission/:id` | ✅ | ❌ | ✅ (own only) |
| `DELETE /work-submission/:id` | ✅ | ❌ | ❌ |
| `POST /work-submission/:id/verify` | ✅ | ✅ (own sub-dept) | ❌ |

### Departments & Sub-Departments

| Endpoint | ADMIN | MANAGER | STAFF |
|----------|:-----:|:-------:|:-----:|
| `POST /department` | ✅ | ❌ | ❌ |
| `GET /department` | ✅ | ✅ | ✅ |
| `POST /sub-departments` | ✅ | ❌ | ❌ |
| `GET /sub-departments` | ✅ | ✅ | ✅ |

---

## API Endpoints Summary

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login with email/password, returns JWT |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/employees` | Create new employee (Admin only) |
| `GET` | `/employees` | List employees (scoped by role) |
| `GET` | `/employees/:id` | Get employee by ID |
| `PATCH` | `/employees/:id` | Update employee |
| `DELETE` | `/employees/:id` | Delete employee |
| `POST` | `/employees/change-password` | Change own password |

### Work Submissions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/work-submission` | Create submission (Staff only) |
| `GET` | `/work-submission` | List submissions (scoped) |
| `GET` | `/work-submission/:id` | Get submission by ID |
| `PATCH` | `/work-submission/:id` | Update submission |
| `DELETE` | `/work-submission/:id` | Delete submission |
| `POST` | `/work-submission/:id/verify` | Verify/reject submission (Manager/Admin) |

---

## Implementation Status

### ✅ Fully Implemented

| Feature | Status |
|---------|--------|
| JWT Authentication | ✅ |
| Password hashing (bcrypt) | ✅ |
| Role-Based Access Control (RBAC) | ✅ |
| Sub-Department Isolation | ✅ |
| Scoped Data Access | ✅ |
| Work Submission Verification | ✅ |
| Staff can only submit own work | ✅ |
| Managers cannot submit work | ✅ |
| Change Password | ✅ |
| Monthly Cycles Support | ✅ |
| Assignment Status Workflow | ✅ |
| Work Proof Types (TEXT, URL) | ✅ |
| Hours Worked Tracking | ✅ |

### ❌ Pending Implementation

| Feature | Priority | Description |
|---------|----------|-------------|
| Microsoft OAuth | 🔴 High | SSO login with first-login role assignment |
| Analytics Module | 🔴 High | Staff/Manager/Admin level analytics |
| File Upload | 🟠 Medium | PDF/Image upload for work proof |
| Notification Triggers | 🟡 Low | Auto-send notifications on events |

---

## Security Features

### Password Security
- Passwords hashed with bcrypt (10 rounds)
- Change password requires current password verification
- Passwords never exposed in API responses

### JWT Security
- Tokens contain: `userId`, `role`, `departmentId`, `subDepartmentId`
- Short expiration time (configurable)
- Token validated on every protected request

### Data Isolation
- Sub-department level isolation for Manager and Staff
- Scoped queries prevent cross-department data access
- Empty arrays returned when no accessible data exists

### Verification Protection
- Verification fields cannot be set via regular update
- Only dedicated verify endpoint allows verification
- Manager verification restricted to own sub-department
