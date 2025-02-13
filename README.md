# esanum-task

A high-performance web service for converting MP4 videos to GIFs, designed for scalability and reliability.

## Features
- **🎥 Upload MP4**: Supports MP4 file uploads with validation (size, resolution, duration).
- **🚀 Fast Conversion**: Uses `FFmpeg` for efficient MP4 to GIF processing.
- **📡 Real-time Job Tracking**: Server-Sent Events (SSE) for job status updates.
- **🖥️ Web UI**: Angular-based client with Material UI.
- **🔧 Robust Backend**: Node.js, Express, Redis-backed BullMQ for job queueing.
- **🛠️ Scalable Processing**: Dockerized worker architecture with concurrency control.
- **📊 Load Testing**: CLI-based tests simulating 1000+ requests/min.
- **🧪 End-to-End Testing**: Playwright, Jest, and Supertest integration.
- **🧹 Auto Cleanup**: Scheduled deletion of old files.

## Tech Stack
- **Client**: Angular 19, Material UI, RxJS
- **Server**: Node.js, Express, Typescript
- **Processing**: FFmpeg, BullMQ, Redis
- **Testing**: Playwright, Supertest, Jest, Jasmine
- **Deployment**: Docker, Docker Swarm
- **Load Testing**: CLI-based stress testing
- **Code Quality**: ESLint, Prettier, pre-commit hooks, lint-staged

## Task Description

- Develop a multi-user, high load, self-recovered web service to convert MP4
	 to GIF
- Input MP4: maximum size 1024:768 length 10 seconds
- Output GIF: size -1:400, FPS = 5
- Package a service for Docker Swarm
- API should be able to accept up to 1000 convert requests per minute
- Time for waiting GIF for user could be from 5 seconds to 5 mins
- Write a simple load test via CURL
- The number of web server replicas is 1
- The number of worker replicas is up to 5
- Reliable and scalable solution
- Allow multi-user access
- Has clean architecture with best practices
- README how to start develop and deploy on production
- Has no useless parts or abandoned parts

## Commands

### Installation

Install dependencies, [Docker](https://docs.docker.com/get-docker/) and [FFmpeg](https://ffmpeg.org/download.html)

`npm install` Install dependencies

`brew install --cask docker` Install Docker using brew example

`brew install ffmpeg` Install FFmpeg using brew example

### Development

Don't forget to stop Redis when exit development mode

`npm run start` Start client, server, worker and redis

`npm run start:server` Start server and worker

`npm run redis:start` Start Redis

`npm run redis:stop` Stop Redis

### Testing

Run application in development or production mode first

`npm run test` Run client, server and e2e tests

`npm run test:load` Run load testing (1000 requests/min)

`npm run test:e2e` Run Playwright end-to-end tests

`npm run test:client` Run client tests

`npm run test:server` Run server tests

`npm run test:watch` Run client and server tests in watch mode

`npm run test:watch:client` Run client tests in watch mode

`npm run test:watch:server` Run server tests in watch mode

`npm run test:server:coverage` Run server tests coverage report

### Build

Build client, server and worker

`npm run build` Build client, server and worker

`npm run build:client` Build client

`npm run build:server` Build server and worker

### Production

Docker commands for client, server, redis and workers images

`npm run docker:build` Build Docker images

`npm run docker:deploy` Deploy Docker containers

`npm run docker:rm` Remove Docker containers

`npm run docker:init` Init Docker

`npm run docker:status` Show Docker status

`npm run docker:logs` Show Docker logs

`npm run docker:prune` Prune Docker containers

### Code quality

Code quality checks and fixes

`npm run lint` Run code quality checks

`npm run lint:fix` Run code quality fixes

`npm run update` Update libraries to the latest versions

## API Endpoints
- **`POST /api/upload`**: Upload an MP4 file for conversion
- **`GET /api/status/:jobId`**: Get real-time status of conversion
- **`GET /api/gif/:jobId.gif`**: Retrieve the generated GIF
