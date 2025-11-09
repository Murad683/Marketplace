# 🛍️ Marketplace

**Marketplace** is a full-stack e-commerce platform that connects **customers** and **merchants**.  
It allows users to browse products, add them to cart or wishlist, and place orders across multiple sellers.

The project consists of two main parts:

- **frontend/** → User interface built with **React + Vite + Tailwind CSS**
- **marketplace_final_project/** → **Backend built with Java Spring Boot**

---

## 🚀 Tech Stack

### 🧱 Backend (`marketplace_final_project/`)
- **Java 17**
- **Spring Boot** (Gradle build system)
- **PostgreSQL** (via Docker)
- **Spring Security + JWT Authentication**
- **Spring Data JPA**
- **Liquibase** for database versioning
- **Swagger / OpenAPI** documentation
- **Docker & Docker Compose**
- **Kubernetes (YAML deployment files)**
- **JUnit / Mockito** for testing

### 🎨 Frontend (`frontend/`)
- **React + Vite**
- **Tailwind CSS**
- **Axios** for API requests
- **ESLint + Prettier** for clean code formatting

---

## ⚙️ Run the Backend with Docker

```bash
cd ./marketplace_final_project
docker-compose up --build
This will start both PostgreSQL and the Spring Boot backend containers.
After successful startup, open:

👉 http://localhost:8080/swagger-ui/index.html

💻 Run the Frontend

cd ./frontend
npm install
npm run dev
Frontend will start on:
👉 http://localhost:5173
It will automatically connect to the backend API at http://localhost:8080.

🧩 Project Structure
Marketplace/
├── frontend/                     # React + Vite frontend
└── marketplace_final_project/    # Java Spring Boot backend
    ├── src/
    │   ├── main/java/az/marketplace/
    │   │   ├── controller/       # REST API endpoints
    │   │   ├── service/          # Business logic
    │   │   ├── repository/       # JPA repositories
    │   │   ├── entity/           # Database entities
    │   │   ├── config/           # Security, Swagger, JWT
    │   │   ├── scheduler/        # Scheduled background jobs
    │   │   └── exception/        # Global exception handling
    │   └── resources/
    │       ├── application.yaml  # Application config
    │       └── db/changelog/     # Liquibase changelogs
    ├── Dockerfile
    ├── docker-compose.yml
    └── k8s/                      # Kubernetes manifests
✨ Main Features
👤 User registration & login (JWT-based)

🏪 Merchant & customer roles

🛒 Cart and order system

📦 Product and category management

🔐 Role-based authorization

⏰ Background scheduler (wishlist reminders)

📘 Interactive Swagger UI

🧾 License
This project was developed for educational and portfolio purposes.
© 2025 Murad Mammadov — All rights reserved.