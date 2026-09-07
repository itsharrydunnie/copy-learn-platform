# Pacepard API Tests

This directory contains the automated test suite for the Pacepard learning platform API.

## Structure

- `factories/` — reusable builders for Pacepard models.
- `mocks/` — mocks for external infrastructure and providers.
- `unit/` — focused module and service tests.
- `integration/` — complete platform workflow tests.
- `utils/` — shared testing helpers.

## Platform Coverage

Tests are organized around Programs, Events, Courses, Modules, Enrollments, Scholarships, Transactions and payments.

The most important integration journeys are scholarship processing and payment processing.

## Running Tests

```bash
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:coverage
```

Tests use an in-memory MongoDB instance. Redis/Bull, email delivery and Paystack should be mocked so the suite does not depend on live infrastructure.
