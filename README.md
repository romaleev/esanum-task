# node-template

## Task

Plain template powered with:
- Typescript
- ESLint lint, fix, coverage
- Prettier lint, fix, organize imports
- Pre-commit hook with lint staged
- Editor config
- Jest test
- NPM check updates

## Installation

Run `npm install` to install dependencies

## Development

Run `npm start` to start the project

The application will automatically restart if you change any of the source files

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory

## Run tests

Run `npm test` to execute unit tests

## Run test coverage

Run `npm run coverage` to generate [coverage report](./coverage/lcov-report/index.html)

## Run code quality checks

Run `npm run lint` for code quality checks.

Run `npm run lintfix` for code quality fixes. It happens automatically in pre-commit hook.

## Update library versions

Run `npm run update` to update libraries to the latest versions.
