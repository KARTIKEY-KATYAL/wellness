# Deploy to AWS EC2 (Docker Compose)

This guide deploys the app on a single EC2 instance using Docker Compose:
- MongoDB
- Backend (Node/Express)
- Frontend (Nginx serving static files, proxying /api to backend)

Works with Amazon Linux 2023 or Ubuntu 22.04.

## Prerequisites
- AWS account with permissions to create EC2 instances and security groups
- SSH key pair (.pem) to access the instance
- (Optional) Domain name (can start with public IP only)

Security Group inbound rules:
- TCP 22 (SSH) from your IP
- TCP 80 (HTTP) from 0.0.0.0/0 (and ::/0)
- (Optional) TCP 443 (HTTPS) if you later enable TLS

## 1) Launch an EC2 instance
- AMI: Amazon Linux 2023 (recommended) or Ubuntu Server 22.04 LTS
- Instance type: t3.small (2GB RAM) or larger
- Storage: 20GB is fine for starters
- Attach your SSH key pair
- Assign the security group above

Note the public IPv4 address (e.g., 3.120.45.67).

## 2) SSH in and install Docker + Compose

### Amazon Linux 2023
```
ssh -i path\to\key.pem ec2-user@3.120.45.67
sudo dnf update -y
sudo dnf install -y docker git
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
# Log out and back in to pick up docker group, or run: newgrp docker
sudo dnf install -y docker-compose-plugin
# Verify
docker --version
docker compose version
```

### Ubuntu 22.04
```
ssh -i path\to\key.pem ubuntu@3.120.45.67
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose-plugin git
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
# Log out and back in, or run: newgrp docker
# Verify
docker --version
docker compose version
```

## 3) Clone code and set environment
```
cd /opt
sudo git clone https://github.com/KARTIKEY-KATYAL/wellness.git
sudo chown -R $(id -u):$(id -g) wellness
cd wellness
```

Create a `.env` file at repo root (used by `docker-compose.prod.yml`):
```
cat > .env << 'EOF'
# Externalized env used by docker-compose.prod.yml
MONGODB_URI=mongodb://mongo:27017/wellness_app
JWT_SECRET=bsjbidbfuvufbifbfivfibifvbfidbi
FRONTEND_ORIGIN=http://13.233.230.158
EOF
```

## 4) Build and run the stack
```
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

Services:
- Mongo (internal)
- Backend (internal on 3000)
- Frontend exposed on port 80 (public)

## 5) Test
- Frontend: http://3.120.45.67/
- API health: http://3.120.45.67/api/health

If CORS errors appear, ensure `FRONTEND_ORIGIN` in `.env` matches the URL you’re using.

## 6) Optional: domain and HTTPS
- Create an A record pointing your domain (e.g., `app.example.com`) to the EC2 public IP.
- Update `FRONTEND_ORIGIN=https://app.example.com` and redeploy.

TLS options:
- Simple: put a Caddy container in front to auto-manage certificates.
- Or install certbot on Nginx and configure SSL. For quick testing, HTTP-only is fine.

## 7) Updates / redeploys
```
cd /opt/wellness
git pull
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up -d
```

## 8) Backups
Mongo data resides in the Docker volume `mongo_data`. Use `mongodump` with a temporary container, or snapshot the EBS volume. Consider automating backups.

## Troubleshooting
- Inspect services:
```
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```
- Ensure your EC2 security group allows inbound 80/22.
- On Ubuntu, if `docker compose` is missing, install the compose plugin or use `docker-compose` binary.
- If login/register fails, confirm Mongo is up and `JWT_SECRET` is set.
