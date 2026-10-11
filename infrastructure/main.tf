# ─────────────────────────────────────────────────────────────
# Provider
# ─────────────────────────────────────────────────────────────
provider "aws" {
  region = "ap-south-1"
}

# ─────────────────────────────────────────────────────────────
# Variables
# ─────────────────────────────────────────────────────────────
variable "key_name" {
  description = "Name of the AWS EC2 Key Pair to use for SSH access"
  type        = string
  default     = "devops-key"
}

# ─────────────────────────────────────────────────────────────
# Data sources
# ─────────────────────────────────────────────────────────────

# Latest Amazon Linux 2023 AMI (x86_64)
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# Default VPC
data "aws_vpc" "default" {
  default = true
}

# All subnets in the default VPC
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# ─────────────────────────────────────────────────────────────
# Security Group
# ─────────────────────────────────────────────────────────────
resource "aws_security_group" "spa_sg" {
  name        = "devops-spa-security-group"
  description = "Allow HTTP, SSH, Kubernetes NodePort, and K8s API access"
  vpc_id      = data.aws_vpc.default.id

  # HTTP — serves the frontend SPA
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH — Jenkins remote deployment
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # NodePort 30080 — Kubernetes frontend-service external access
  ingress {
    description = "Kubernetes NodePort (frontend)"
    from_port   = 30080
    to_port     = 30080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Port 6443 — Kubernetes API (remote kubectl / Jenkins kubectl commands)
  ingress {
    description = "Kubernetes API Server"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Egress — allow all outbound traffic (package installs, Docker pulls, etc.)
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "devops-spa-sg"
  }
}

# ─────────────────────────────────────────────────────────────
# Launch Template
# ─────────────────────────────────────────────────────────────
resource "aws_launch_template" "spa_lt" {
  name_prefix   = "devops-spa-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = "t3.medium"
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.spa_sg.id]

  # Boot script: install and start K3s (lightweight Kubernetes)
  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum update -y
    curl -sfL https://get.k3s.io | sh -
    sudo chmod 644 /etc/rancher/k3s/k3s.yaml
  EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "DevOps-Microservices-Node"
    }
  }

  tag_specifications {
    resource_type = "volume"
    tags = {
      Name = "DevOps-Microservices-Node"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ─────────────────────────────────────────────────────────────
# Auto Scaling Group
# ─────────────────────────────────────────────────────────────
resource "aws_autoscaling_group" "spa_asg" {
  name_prefix         = "devops-spa-asg-"
  min_size            = 1
  max_size            = 3
  desired_capacity    = 1
  health_check_type   = "EC2"
  vpc_zone_identifier = data.aws_subnets.default.ids

  launch_template {
    id      = aws_launch_template.spa_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "DevOps-Microservices-Node"
    propagate_at_launch = true
  }

  tag {
    key                 = "ManagedBy"
    value               = "Terraform"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ─────────────────────────────────────────────────────────────
# Outputs
# ─────────────────────────────────────────────────────────────
output "autoscaling_group_name" {
  description = "Name of the Auto Scaling Group managing K3s nodes"
  value       = aws_autoscaling_group.spa_asg.name
}

output "launch_template_id" {
  description = "ID of the EC2 Launch Template"
  value       = aws_launch_template.spa_lt.id
}

output "security_group_id" {
  description = "ID of the security group attached to ASG instances"
  value       = aws_security_group.spa_sg.id
}