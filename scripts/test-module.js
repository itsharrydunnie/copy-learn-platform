#!/usr/bin/env node

/**
 * Test a specific module
 * Usage: pnpm test:module <module-name> [--watch]
 * Example: pnpm test:module auth --watch
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleMap = {
  auth: 'test/unit/modules/auth.test.ts',
  user: 'test/unit/modules/user.test.ts',
  business: 'test/unit/modules/business.test.ts',
  workspace: 'test/unit/modules/workspace.test.ts',
  project: 'test/unit/modules/project.test.ts',
  task: 'test/unit/modules/task.test.ts',
  team: 'test/unit/modules/team.test.ts',
  subscription: 'test/unit/modules/subscription.test.ts',
  token: 'test/unit/services/token.service.test.ts',
  permission: 'test/unit/services/permission.service.test.ts',
  repository: 'test/unit/repositories/repository.service.test.ts',
  workflow: 'test/integration/workflow.test.ts',
};

const moduleName = process.argv[2];
const additionalArgs = process.argv.slice(3).join(' ');

if (!moduleName) {
  console.error('Error: Module name is required');
  console.error('Usage: pnpm test:module <module-name> [--watch]');
  console.error('');
  console.error('Available modules:');
  Object.keys(moduleMap).forEach(key => {
    console.error(`  - ${key}`);
  });
  process.exit(1);
}

const testPath = moduleMap[moduleName];

if (!testPath) {
  console.error(`Error: Unknown module '${moduleName}'`);
  console.error(`Available modules: ${Object.keys(moduleMap).join(', ')}`);
  process.exit(1);
}

const command = `NODE_OPTIONS=--experimental-vm-modules jest ${testPath} ${additionalArgs}`;

try {
  execSync(command, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
} catch (error) {
  process.exit(error.status || 1);
}
