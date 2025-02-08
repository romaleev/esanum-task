group "default" {
  targets = ["backend", "frontend", "worker"]
}

target "backend" {
  context = "."
  dockerfile = "./server/Dockerfile"
  tags = ["esanum-task-backend:latest"]
}

target "frontend" {
  context = "."
  dockerfile = "./client/Dockerfile"
  tags = ["esanum-task-frontend:latest"]
}

target "worker" {
  context = "."
  dockerfile = "./server/Dockerfile"
  tags = ["esanum-task-worker:latest"]
}