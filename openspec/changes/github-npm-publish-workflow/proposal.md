## Why

Chatterkit is already packaged for npm, but there is no repository CI/CD workflow to validate builds and publish releases consistently. A GitHub Actions workflow will make npm publishing repeatable, safer, and easier to operate from version tags or release events.

## What Changes

- Add GitHub Actions CI workflow coverage for install, typecheck, test, and package build.
- Add an npm publish workflow that publishes the package to npm from an intentional release trigger.
- Use npm authentication via a repository secret such as `NPM_TOKEN`.
- Ensure the workflow uses the project package manager and existing scripts: `build`, `test`, and `typecheck`.
- Document the release/publishing trigger and required repository secrets.

## Capabilities

### New Capabilities
- `npm-publish-workflow`: Defines CI validation and npm publishing behavior for the package through GitHub Actions.

### Modified Capabilities

## Impact

- Adds GitHub Actions workflow files under `.github/workflows/`.
- May add or update npm package metadata/scripts if required for safe publishing.
- Updates README or contributor/release documentation with npm publishing instructions.
- Requires GitHub repository configuration for an npm automation token secret.