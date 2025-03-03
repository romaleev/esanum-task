group "default" {
  targets = ["backend", "frontend", "worker"]
}

target "backend" {
  context = "."
  dockerfile = "./common/docker/Dockerfile.server"
  tags = ["esanum-task-backend:latest"]
}

target "frontend" {
  context = "."
  dockerfile = "./common/docker/Dockerfile.client"
  tags = ["esanum-task-frontend:latest"]
}

target "worker" {
  context = "."
  dockerfile = "./common/docker/Dockerfile.server"
  tags = ["esanum-task-worker:latest"]
}