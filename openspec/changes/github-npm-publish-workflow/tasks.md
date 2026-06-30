## 1. CI Workflow

- [x] 1.1 Create `.github/workflows/ci.yml` for pull request and main-branch push validation.
- [x] 1.2 Configure CI to use Node.js, cache Yarn dependencies, run `yarn install --frozen-lockfile`, then run `yarn typecheck`, `yarn test`, and `yarn build`.
- [x] 1.3 Set minimal GitHub Actions permissions for CI and verify the workflow does not require publish secrets.

## 2. npm Publish Workflow

- [x] 2.1 Create `.github/workflows/publish-npm.yml` with an intentional release trigger such as GitHub Release publication, version tag push, or manual dispatch.
- [x] 2.2 Configure the publish workflow to install dependencies, typecheck, test, and build before publishing.
- [x] 2.3 Configure npm registry authentication using GitHub Actions OIDC trusted publishing and publish to `https://registry.npmjs.org` without committing credentials.
- [x] 2.4 Ensure publish jobs never run for pull request events and use least-privilege GitHub permissions.

## 3. Package and Documentation

- [x] 3.1 Review package metadata and scripts to confirm the npm artifact includes `dist`, types, README, and stylesheet exports.
- [x] 3.2 Document required npm trusted publisher setup for the GitHub repository and workflow.
- [x] 3.3 Document the maintainer release flow, including version bump expectations and the configured publish trigger.

## 4. Verification

- [x] 4.1 Validate workflow YAML syntax and paths.
- [x] 4.2 Run local `yarn typecheck`, `yarn test`, and `yarn build` to confirm the workflow commands are valid.
- [x] 4.3 Confirm OpenSpec requirements are satisfied by the final workflow and documentation changes.