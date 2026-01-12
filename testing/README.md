# Testing Suite

This directory contains end-to-end (E2E) tests for the Daggerbrain application using Playwright.

## Setup

### 1. Install Dependencies

Run these commands in the `testing/` directory:

```bash
bun add -d @playwright/test
bun add -d @types/node
bun add -d typescript
```

### 2. Install Playwright Browsers

```bash
bunx playwright install
```

### 3. Configure Environment

Create a `.env` file in the `testing/` directory (or use one in the parent directory):

```env
# Base URL of the application (local dev or deployed)
BASE_URL=http://localhost:8787

# Test user credentials (for Clerk authentication)
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=your-test-password

# For multi-user tests
GM_USER_EMAIL=gm@example.com
GM_USER_PASSWORD=your-gm-password
PLAYER_USER_EMAIL=player@example.com
PLAYER_USER_PASSWORD=your-player-password

# Clerk API keys (must be test/dev keys: pk_test_* and sk_test_*)
CLERK_PUBLISHABLE_KEY=pk_test_**
CLERK_SECRET_KEY=sk_test_***
```

The setup will automatically load `.env` from either the `testing/` directory or the parent directory.

### 4. Start the Application

Before running tests, start your application:

```bash
# In the daggerbrain/ directory
cd ../daggerbrain
bun run dev:wrangler
```

Or test against a deployed version by setting `BASE_URL` in `.env`.

## Running Tests

### Run All Tests

```bash
bunx playwright test
```

### Run Specific Test File

```bash
bunx playwright test e2e/characters.spec.ts
```

### Run Tests in UI Mode

```bash
bunx playwright test --ui
```

### Run Tests in Debug Mode

```bash
bunx playwright test --debug
```

### Run Tests in Headed Mode (see browser)

```bash
bunx playwright test --headed
```

### Run Tests for Specific Browser

```bash
bunx playwright test --project=chromium
bunx playwright test --project=firefox
bunx playwright test --project=webkit
```

## Test Structure

```
testing/
├── e2e/                    # Test files
│   ├── characters.spec.ts # Character tests
│   ├── campaigns.spec.ts  # Campaign tests
│   ├── signin.spec.ts     # Authentication tests
│   ├── multi-user.spec.ts # Multi-user/real-time tests
│   └── auth.setup.ts      # Auth state setup (runs before tests)
├── utils/                  # Test utilities
│   ├── auth.ts            # Authentication helpers
│   ├── test-data.ts       # Test data generators
│   ├── helpers.ts         # General test helpers
│   └── page-objects/      # Page Object Models
│       ├── characters.ts
│       └── campaigns.ts
├── .auth/                  # Auth state files (gitignored, auto-generated)
│   ├── test-user.json
│   ├── gm-user.json
│   └── player-user.json
├── global.setup.ts        # Global setup (Clerk configuration)
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { CharactersPage } from '../utils/page-objects/characters';
import { login } from '../utils/auth';

test('My test', async ({ page }) => {
  await login(page, TEST_USER);
  const charactersPage = new CharactersPage(page);
  await charactersPage.goto();
  // ... test code
});
```

### Using Page Objects

Page Objects encapsulate page interactions:

```typescript
const charactersPage = new CharactersPage(page);
await charactersPage.goto();
await charactersPage.createCharacter('Test Character');
```

### Multi-User Tests

For tests requiring multiple users:

```typescript
test('Multi-user test', async ({ browser }) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();
  
  // Login different users
  await login(page1, USER1);
  await login(page2, USER2);
  
  // ... test code
});
```

## Authentication

The test suite uses Clerk's testing helpers (`@clerk/testing`) for authentication. The setup:

1. **Global Setup** (`global.setup.ts`): Configures Clerk with your test API keys using `clerkSetup()`
2. **Auth State Setup** (`e2e/auth.setup.ts`): Pre-authenticates test users and saves auth state to `.auth/` directory for reuse
3. **Login Helper** (`utils/auth.ts`): Uses Clerk's `clerk.signIn()` helper for programmatic authentication
4. Requires test/dev Clerk API keys (`pk_test_*` and `sk_test_*`) in your `.env` file

### Using Pre-authenticated State

For better performance, you can use pre-authenticated state files created by `auth.setup.ts`:

```typescript
import { test } from '@playwright/test';

// Use pre-authenticated state (no need to call login())
test.use({ storageState: '.auth/test-user.json' });

test('My test', async ({ page }) => {
  // Page is already authenticated
  await page.goto('/characters');
  // ... test code
});
```

### Manual Authentication

You can also authenticate manually in each test:

```typescript
import { login } from '../utils/auth';

test('My test', async ({ page }) => {
  await login(page, {
    email: process.env.TEST_USER_EMAIL!,
    password: process.env.TEST_USER_PASSWORD!,
  });
  // ... test code
});
```

### Multi-User Tests

For multi-user tests, use different auth state files:

```typescript
test.use({ storageState: '.auth/gm-user.json' }); // GM user
test.use({ storageState: '.auth/player-user.json' }); // Player user
```

**Note**: 
- Make sure your test users exist in your Clerk dev instance and their credentials are set in `.env`
- Test users must have password authentication enabled in Clerk
- The auth state files are automatically generated when you run tests (they're gitignored for security)
- If authentication fails, verify:
  1. Users exist in your Clerk dashboard
  2. Users have password authentication enabled (not just OAuth)
  3. Credentials in `.env` match the actual user passwords
  4. `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are correct test keys

## Test Data

Use test data utilities to generate unique test data:

```typescript
import { generateCharacterName, createTestCharacter } from '../utils/test-data';

const characterName = generateCharacterName();
const testCharacter = createTestCharacter({ name: characterName });
```

## Debugging

### View Test Report

```bash
bunx playwright show-report
```

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots (in `test-results/`)
- Videos (in `test-results/`)
- Traces (when using `--trace on`)

### Debug in VS Code

Install the Playwright extension for VS Code to debug tests directly in the editor.

## CI/CD Integration

Tests can be run in CI/CD pipelines. Set the `CI` environment variable:

```bash
CI=true bunx playwright test
```

This will:
- Run tests in headless mode
- Retry failed tests twice
- Use a single worker (sequential execution)

## Notes

- Tests run against the application via URL (configured in `BASE_URL`)
- The application must be running before tests execute
- For local development, use `bun run dev:wrangler` in the `daggerbrain/` directory
- Multi-user tests require separate test accounts
- Real-time sync tests require Durable Objects to be running

## Troubleshooting

### Tests fail with timeout
- Ensure the application is running
- Check `BASE_URL` is correct
- Increase timeout in `playwright.config.ts`

### Authentication fails / "Failed to authenticate test user - redirected to sign-in"

This error means `clerk.signIn()` completed but authentication didn't persist. Common causes:

1. **Test users don't exist in Clerk**
   - Go to your Clerk Dashboard → Users
   - Create the test users (test@example.com, gm@example.com, player@example.com)
   - Make sure they have password authentication enabled

2. **Invalid credentials**
   - Verify the passwords in `.env` match the actual user passwords in Clerk
   - Test users must have password authentication (not just OAuth)

3. **Clerk configuration**
   - Ensure `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are test keys (pk_test_* and sk_test_*)
   - Verify the keys match your Clerk instance
   - Check that password authentication is enabled in your Clerk instance settings

4. **User authentication method**
   - In Clerk Dashboard, ensure test users have password authentication enabled
   - Users created via OAuth only may not work with password strategy

**To create test users in Clerk:**
1. Go to Clerk Dashboard → Users → Create User
2. Enter email (e.g., test@example.com)
3. Set a password (use the same password in your `.env` file)
4. Ensure "Password" is enabled as an authentication method
5. Repeat for all test users (GM, Player, etc.)

### Multi-user tests fail
- Ensure you have separate test accounts configured
- Check that both users can authenticate
- Verify Durable Objects are running for real-time tests
