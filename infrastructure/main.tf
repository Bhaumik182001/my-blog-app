# 1. Define the Cloud Provider (AWS Mumbai Region)
provider "aws" {
  region = "ap-south-1" 
}

# 2. Automatically find the latest Amazon Linux image
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# 3. Create a Security Group (Firewall)
resource "aws_security_group" "spa_sg" {
  name        = "devops-spa-security-group"
  description = "Allow HTTP for the web, SSH for Jenkins, and Ports for Monitoring"

  # Web Traffic (React App)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH (For Jenkins to deploy)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Prometheus Dashboard
  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Grafana Dashboard
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow the server to download updates
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Provision the EC2 Server
resource "aws_instance" "spa_server" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.micro"
  vpc_security_group_ids = [aws_security_group.spa_sg.id]

  # CRITICAL: Replace this with your actual AWS Key Pair name!
  key_name               = "devops-key" 

  # 5. Boot Script: Install Docker and Docker Compose automatically
  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install docker -y
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ec2-user
              
              # Install Docker Compose
              curl -SL https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose
              EOF

  tags = {
    Name = "DevOps-SPA-Host"
  }
}

# Output the public IP address when finished
output "server_public_ip" {
  value = aws_instance.spa_server.public_ip
}