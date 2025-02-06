# esanum-task

## Description

1. Develop a multi-user, high load, self-recovered web service to convert MP4
	 to GIF
2. Input MP4: maximum size 1024:768 length 10 seconds
3. Output GIF: size -1:400, FPS = 5
4. Package a service for Docker Swarm
5. API should be able to accept up to 1000 convert requests per minute
6. Time for waiting GIF for user could be from 5 seconds to 5 mins
7. Write a simple load test via CURL
8. The number of web server replicas is 1
9. The number of worker replicas is up to 5

Code should:
1. Reliable and scalable solution
2. Allow multi-user access
3. Has clean architecture with best practices
4. README how to start develop and deploy on production
5. Has no useless parts or abandoned parts

## Installation

Run `npm install` to install dependencies
Install [ffmpeg](https://ffmpeg.org/download.html) for video processing
Install and run [docker](https://docs.docker.com/get-docker/) for containerization
Install [docker-compose](https://docs.docker.com/compose/install/) for container orchestration

## Development

Run `npm start` to start the project

The application will automatically restart if you change any of the source files

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory

## Run tests

Run `npm test` to execute unit tests

Run `npm run test:watch` to execute unit tests in watch mode

## Run code quality checks

Run `npm run lint` for code quality checks.

Run `npm run lint:fix` for code quality fixes. It happens automatically in pre-commit hook.

## Update library versions

Run `npm run update` to update libraries to the latest versions.

## Environment

Plain template powered with:
- Typescript
- ESLint lint, fix, coverage
- Prettier lint, fix, organize imports
- Pre-commit hook with lint staged
- Editor config
- Jest test
- NPM check updates