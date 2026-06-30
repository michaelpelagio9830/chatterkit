## ADDED Requirements

### Requirement: Continuous integration validates package changes
The repository SHALL provide a GitHub Actions CI workflow that validates package changes before merge or release.

#### Scenario: Pull request validation
- **WHEN** a pull request is opened or updated against the repository's main development branch
- **THEN** GitHub Actions MUST install dependencies, run type checking, run tests, and build the package

#### Scenario: Push validation
- **WHEN** code is pushed to the repository's main development branch
- **THEN** GitHub Actions MUST run the same package validation steps used for pull requests

### Requirement: npm publish workflow uses intentional release triggers
The repository SHALL provide a GitHub Actions workflow that publishes the package to npm only from intentional release triggers.

#### Scenario: Release-triggered publish
- **WHEN** a maintainer creates the configured release trigger
- **THEN** the publish workflow MUST validate the package and publish it to the npm registry

#### Scenario: Pull requests do not publish
- **WHEN** workflow jobs run for pull request events
- **THEN** no job MUST publish the package to npm

### Requirement: npm publishing uses trusted publishing
The publish workflow SHALL authenticate to npm using GitHub Actions OIDC trusted publishing and SHALL NOT require committed npm credentials or a long-lived npm token secret.

#### Scenario: trusted publisher is configured
- **WHEN** the publish workflow runs
- **THEN** npm authentication MUST use the workflow's GitHub Actions OIDC identity

#### Scenario: trusted publisher is missing or invalid
- **WHEN** the workflow identity does not match npm trusted publisher configuration
- **THEN** the workflow MUST fail without publishing a package

### Requirement: Release documentation describes publishing operations
The repository documentation SHALL describe how maintainers publish the package through GitHub Actions.

#### Scenario: Maintainer configures publishing
- **WHEN** a maintainer reads the release documentation
- **THEN** it MUST explain the required npm trusted publisher setup, the publish trigger, and the versioning expectation before publishing

#### Scenario: Maintainer publishes a release
- **WHEN** a maintainer follows the documented release steps
- **THEN** the GitHub Actions publish workflow MUST be the documented path for publishing `chatterkit` to npm