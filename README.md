# Pacepard

### Helping African talents unlock their superhuman potential.

> Pacepard is the backend API powering Pacepard's learning and talent development platform. It provides the services required to manage programs, events, courses, modules, scholarships, enrollments, payments, emails, and background jobs.

This repository contains the API layer for the platform and is built to support the learning journeys and operational workflows behind Pacepard.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Background Jobs and Workers](#background-jobs-and-workers)
- [Building](#building)
- [Scripts Reference](#scripts-reference)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.x
- **pnpm**
- **Git**
- **MongoDB**
- **Redis**

To verify the tools installed on your machine:

```bash
node --version
pnpm --version
git --version
```

You will also need MongoDB and Redis running before starting the API, as the application uses MongoDB for persistence and Redis for queues and background jobs.

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/pacepard/pacepard-api-ts.git
cd pacepard-api-ts
```

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

Create a `.env` file in the root of the project and configure the environment variables required by the application.

The API requires configuration for services such as:

- Application environment and port
- MongoDB
- Redis
- Authentication
- Email delivery
- Paystack
- Storage

Keep secrets and credentials out of version control.

## Project Structure

The project is organized around modules and shared infrastructure:

```
src/
├── configs/              # Application, database, Redis, and other configuration
├── middlewares/          # Express middleware
├── modules/              # Application modules and business logic
├── queues/               # Queue and background job infrastructure
├── tasks/                # Workers and scheduled jobs
├── views/                # Email templates and preview routes
├── routes/               # Application routes
├── utils/                # Shared utilities
└── server.ts             # Application entry point
```

The learning platform modules include functionality around:

- Programs
- Events
- Courses
- Modules
- Scholarships
- Enrollments
- Transactions and payments
- Email notifications

The API also uses Redis and Bull-based queues for background processing and delayed jobs.

---

## Development

Start the API in development mode:

```bash
pnpm dev
```

The application startup flow connects the services required by the API before starting the server:

```
MongoDB
   ↓
Database seeding
   ↓
Redis
   ↓
Workers
   ↓
Scheduler
   ↓
Express API
```

### Type Checking

Run TypeScript type checking:

```bash
pnpm check-types
```

### Testing

Run the test suite:

```bash
pnpm test
```

Additional test commands are available for specific test categories and modules.

---

## Background Jobs and Workers

Pacepard uses Redis-backed queues to handle work that should not block API requests.

Examples include:

- Sending emails
- Processing delayed scholarship applications
- Scheduled cleanup jobs
- Invitation processing
- Other background operations

The general flow is:

```
API Request
   ↓
Queue Job
   ↓
Redis
   ↓
Worker
   ↓
Background Processing
```

For example, a scholarship application can be created immediately while a delayed background job processes the application later.

The API startup process initializes the workers and scheduler required for these jobs.

---

## Building

Build the application for production:

```bash
pnpm build
```

The build process:

1. Cleans the previous build output
2. Compiles TypeScript
3. Resolves TypeScript path aliases
4. Adds JavaScript extensions where required
5. Copies application data and view templates into the build output

The production output is generated in:

```
dist/
```

### Run the Production Build

After building:

```bash
pnpm start
```

---

## Scripts Reference

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the API in development mode |
| `pnpm build` | Build the API for production |
| `pnpm start` | Run the production build |
| `pnpm check-types` | Run TypeScript type checking |
| `pnpm test` | Run the test suite |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm test:unit` | Run unit tests |
| `pnpm test:integration` | Run integration tests |
| `pnpm test:modules` | Run module tests |
| `pnpm clean` | Remove build output |

Additional module-specific test commands are available in `package.json`.

---

## Contributing

We welcome contributions and improvements to Pacepard.

### 1. Fork and Clone

Fork the repository, then clone your fork:

```bash
git clone https://github.com/pacepard/pacepard-api-ts.git
cd pacepard-api-ts
```

### 2. Create a Branch

Create a branch for your work:

```bash
git checkout -b feature/your-feature-name
```

For bug fixes:

```bash
git checkout -b fix/your-bug-fix
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Make Your Changes

When contributing:

- Write clean and maintainable code
- Follow the existing project structure and conventions
- Keep modules focused on their responsibilities
- Add tests where applicable
- Update documentation when necessary

### 5. Run Checks

Before committing your changes:

```bash
pnpm check-types
pnpm test
pnpm build
```

### 6. Commit Your Changes

Use clear commit messages that explain the purpose of the change.

Examples:

```
feat: add scholarship approval processing
fix: handle failed payment transactions
docs: update API documentation
refactor: simplify enrollment workflow
test: add scholarship service tests
chore: update dependencies
```

### Standard Commit Types

| Type | Description |
| --- | --- |
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance, configuration, or dependencies |
| `refactor` | Code improvement without changing functionality |
| `docs` | Documentation changes |
| `test` | Tests |
| `style` | Formatting changes |
| `perf` | Performance improvement |
| `ci` | CI or pipeline changes |
| `build` | Build system changes |

### 7. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request

When opening a Pull Request:

- Clearly explain what changed
- Explain why the change was necessary
- Include relevant testing information
- Add screenshots or logs when they help explain the change
- Request a review before merging

---

## Development Guidelines

- **TypeScript**: Keep code properly typed
- **Architecture**: Follow the existing module, service, repository, and controller structure
- **Database**: Keep MongoDB models and application interfaces aligned
- **Background Jobs**: Use queues for work that should happen outside the request lifecycle
- **Emails**: Keep email delivery asynchronous through the queue system
- **Payments**: Handle payment state changes through the intended transaction and webhook flows
- **Documentation**: Keep relevant documentation updated when behaviour changes

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
