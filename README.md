# 🛍️ Marketplace — Full-Stack E-Commerce Platform  

**Marketplace** is a modern full-stack e-commerce web application connecting **customers** and **merchants**.  
It allows users to browse products, add them to cart or wishlist, and place secure orders across multiple sellers.  

---

## ⚙️ Project Overview  

The system consists of two main parts:  

- **`frontend/`** → User interface built with **React + Vite + Tailwind CSS**  
- **`backend/`** → REST API built with **Java Spring Boot + PostgreSQL**  

---

## 🚀 Tech Stack  

### 🧱 Backend (`backend/`)
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
- **Axios** for API communication  
- **Context API + Hooks** for state management  
- **ESLint + Prettier** for clean code formatting  

---

## 🧩 Project Structure  

marketplace/
├── backend/ # Java Spring Boot backend
│ ├── src/main/java/az/marketplace/
│ │ ├── controller/ # REST endpoints
│ │ ├── service/ # Business logic
│ │ ├── repository/ # Data access layer
│ │ ├── entity/ # Database entities
│ │ ├── config/ # JWT, Security, CORS, Swagger
│ │ ├── scheduler/ # Background jobs
│ │ └── exception/ # Global exception handling
│ ├── src/main/resources/
│ │ ├── application.yaml
│ │ └── db/changelog/
│ ├── Dockerfile
│ ├── docker-compose.yml
│ └── k8s/ # Kubernetes manifests
│
└── frontend/ # React + Vite frontend
├── src/
├── package.json
├── tailwind.config.js
└── vite.config.js

yaml
Kodu kopyala

---

## 🐳 Run the Backend with Docker  

```bash
cd backend
docker compose up -d db
./gradlew bootRun
After startup, open:
➡️ http://localhost:8080/swagger-ui/index.html

💻 Run the Frontend
bash
Kodu kopyala
cd frontend
npm install
npm run dev
Frontend runs at:
➡️ http://localhost:5173

It automatically connects to the backend API at http://localhost:8080/api.

✨ Main Features
👤 User registration & JWT-based login

🏪 Merchant & customer role separation

🛒 Cart, wishlist & order management

📦 Product and category management

🔐 Role-based authorization

⏰ Background scheduler (wishlist reminders)

📘 Interactive Swagger UI

🧾 License
This project was developed for educational and portfolio purposes.
© 2025 Murad Mammadov — All rights reserved.
