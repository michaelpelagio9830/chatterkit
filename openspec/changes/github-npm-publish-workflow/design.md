## Context

Chatterkit is a Vite-built React package published to npm as `chatterkit`. The package already defines npm metadata for library output, including `main`, `module`, `types`, `files`, and an exported stylesheet. Existing scripts cover the core release quality gates: `typecheck`, `test`, and `build`. The repository currently has no `.github/workflows` directory, so validation and npm publishing are manual.

GitHub Actions can provide two separate concerns: continuous validation for pull requests and pushes, and intentional npm publishing for release events or version tags. Publishing requires an npm automation token stored as a GitHub Actions secret and should avoid running on arbitrary pull request code.

## Goals / Non-Goals

**Goals:**

- Add GitHub Actions CI that installs dependencies, runs type checking, runs tests, and builds the package.
- Add an npm publishing workflow that publishes the package only from an explicit release trigger.
- Use secure npm authentication through `NPM_TOKEN` and least-privilege GitHub workflow permissions.
- Keep the workflow aligned with the current Yarn lockfile and package scripts.
- Document the release trigger and required repository secret.

**Non-Goals:**

- Automate semantic versioning or changelog generation.
- Automatically bump package versions.
- Publish from pull requests or untrusted forks.
- Migrate package managers or introduce a separate release tool.

## Decisions

1. **Use separate CI and publish workflows.**
   - CI will run on pull requests and pushes to protected/default branches.
   - Publishing will run only for explicit release triggers such as published GitHub Releases or version tags.
   - Rationale: validation should be broad, while publishing should be intentionally gated.
   - Alternative considered: one workflow with conditional publish steps. Rejected because separating concerns makes permissions and auditability clearer.

2. **Use Yarn for installation and existing npm scripts for validation.**
   - The repository has `yarn.lock`; workflows should use `yarn install --frozen-lockfile`, then `yarn typecheck`, `yarn test`, and `yarn build`.
   - Rationale: this matches the repository lockfile and avoids dependency drift in CI.
   - Alternative considered: use `npm ci`. Rejected unless the project adds a package-lock file or intentionally switches package managers.

3. **Publish with npm registry authentication via `NPM_TOKEN`.**
   - The publish workflow will configure Node for `registry-url: https://registry.npmjs.org` and run `npm publish` with `NODE_AUTH_TOKEN` sourced from `secrets.NPM_TOKEN`.
   - Rationale: npm publish is registry-native and avoids adding a release dependency.
   - Alternative considered: use GitHub Packages. Rejected because the requested target is npm.

4. **Gate publishing behind release/tag semantics and prepublish validation.**
   - The publish workflow must run install, typecheck, test, and build before publishing.
   - Rationale: the package published to npm should be the same artifact shape validated by CI.
   - Alternative considered: publish without re-running validation. Rejected because publishing should be self-contained and safe even if CI was skipped.

## Risks / Trade-offs

- **Invalid or missing `NPM_TOKEN`** → Document the required secret and let the publish job fail before publishing if authentication is unavailable.
- **Version already exists on npm** → Publishing will fail safely; release documentation should instruct maintainers to bump `package.json` before triggering publish.
- **Accidental publish trigger** → Use explicit release/tag triggers and avoid pull request publishing.
- **Dependency install mismatch** → Use the committed `yarn.lock` with frozen lockfile mode.
- **npm provenance support may require additional setup** → Consider enabling provenance if the repository and npm package support trusted publishing; otherwise use token-based publishing first.

## Migration Plan

1. Add `.github/workflows/ci.yml` for validation.
2. Add `.github/workflows/publish-npm.yml` for intentional npm publishing.
3. Configure the GitHub repository secret `NPM_TOKEN` with an npm automation token.
4. Update documentation with release steps and trigger behavior.
5. Validate workflow syntax and run local scripts before merging.

Rollback is simple: disable or remove the publish workflow if release automation behaves unexpectedly.

## Open Questions

- Should publishing trigger on GitHub Release publication, `v*` tags, manual `workflow_dispatch`, or a combination? The implementation should choose a safe default and document it.