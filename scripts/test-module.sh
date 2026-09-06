#!/bin/bash

# Test a specific module
# Usage: pnpm test:module <module-name> [--watch]
# Example: pnpm test:module auth --watch

MODULE_NAME=$1
shift  # Remove first argument, keep the rest (like --watch)

if [ -z "$MODULE_NAME" ]; then
  echo "Error: Module name is required"
  echo "Usage: pnpm test:module <module-name> [--watch]"
  echo ""
  echo "Available modules:"
  echo "  - auth"
  echo "  - user"
  echo "  - business"
  echo "  - workspace"
  echo "  - project"
  echo "  - task"
  echo "  - team"
  echo "  - subscription"
  echo "  - token (unit test)"
  echo "  - permission (unit test)"
  echo "  - repository (unit test)"
  echo "  - workflow (integration test)"
  exit 1
fi

# Map module names to test file paths
case $MODULE_NAME in
  auth)
    TEST_PATH="test/unit/modules/auth.test.ts"
    ;;
  user)
    TEST_PATH="test/unit/modules/user.test.ts"
    ;;
  business)
    TEST_PATH="test/unit/modules/business.test.ts"
    ;;
  workspace)
    TEST_PATH="test/unit/modules/workspace.test.ts"
    ;;
  project)
    TEST_PATH="test/unit/modules/project.test.ts"
    ;;
  task)
    TEST_PATH="test/unit/modules/task.test.ts"
    ;;
  team)
    TEST_PATH="test/unit/modules/team.test.ts"
    ;;
  subscription)
    TEST_PATH="test/unit/modules/subscription.test.ts"
    ;;
  token)
    TEST_PATH="test/unit/services/token.service.test.ts"
    ;;
  permission)
    TEST_PATH="test/unit/services/permission.service.test.ts"
    ;;
  repository)
    TEST_PATH="test/unit/repositories/repository.service.test.ts"
    ;;
  workflow)
    TEST_PATH="test/integration/workflow.test.ts"
    ;;
  *)
    echo "Error: Unknown module '$MODULE_NAME'"
    echo "Available modules: auth, user, business, workspace, project, task, team, subscription, token, permission, repository, workflow"
    exit 1
    ;;
esac

# Run jest with the test path and any additional arguments (like --watch)
NODE_OPTIONS=--experimental-vm-modules jest "$TEST_PATH" "$@"
