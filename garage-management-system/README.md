# Garage Management System

A full-stack web application for managing vehicle repairs, customers, mechanics, inventory and invoices for an automotive garage business.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2, Java 17 |
| Frontend | Angular 17, Angular Material |
| Database | MySQL 8.0 |
| Auth | JWT (jjwt 0.11) |
| PDF | iText 5 |
| Containerisation | Docker & Docker Compose |
| API Docs | Springdoc OpenAPI / Swagger UI |

---

## Project Structure

```
garage-management-system/
├── backend/
│   ├── src/main/java/com/garage/
│   │   ├── config/          # Security, CORS, Swagger
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/             # Request / Response objects
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Global error handling
│   │   ├── repository/      # Spring Data interfaces
│   │   ├── security/        # JWT filter & UserDetailsService
│   │   └── service/         # Business logic
│   └── pom.xml
├── frontend/
│   └── src/app/
│       ├── components/      # Feature components (standalone)
│       ├── guards/          # Auth guard
│       ├── interceptors/    # JWT interceptor
│       ├── models/          # TypeScript interfaces
│       └── services/        # HTTP services
├── docs/
│   ├── schema.sql           # Database DDL
│   └── seed.sql             # Sample data
├── docker-compose.yml
└── README.md
```

---

## Quick Start (Docker — Recommended)

```bash
# Clone the repo
git clone <your-repo-url>
cd garage-management-system

# Start everything (MySQL + Backend + Frontend)
docker-compose up --build

# App will be available at:
#   Frontend  → http://localhost
#   Backend   → http://localhost:8080
#   Swagger   → http://localhost:8080/swagger-ui.html
```

Default login credentials:
- **Username:** `admin`  **Password:** `admin123`
- **Username:** `staff`  **Password:** `staff123`

---

## Local Development Setup

### Prerequisites
- Java 17+
- Node.js 20+ & npm
- MySQL 8.0
- Maven 3.8+

### 1. Database

```sql
-- Run in MySQL client
source docs/schema.sql
source docs/seed.sql
```

### 2. Backend

```bash
cd backend

# Edit src/main/resources/application.properties with your DB credentials
# spring.datasource.username=root
# spring.datasource.password=yourpassword

mvn spring-boot:run
# Backend starts on http://localhost:8080
```

### 3. Frontend

```bash
cd frontend
npm install --legacy-peer-deps
ng serve --open
# Frontend starts on http://localhost:4200
```

---

## API Endpoints

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Auth | POST | `/api/auth/login` | Login, returns JWT |
| Auth | POST | `/api/auth/register` | Register new user |
| Customers | GET | `/api/customers` | List / search customers |
| Customers | POST | `/api/customers` | Create customer |
| Customers | PUT | `/api/customers/{id}` | Update customer |
| Customers | DELETE | `/api/customers/{id}` | Delete customer |
| Customers | GET | `/api/customers/{id}/vehicles` | Customer's vehicles |
| Vehicles | GET | `/api/vehicles` | List all vehicles |
| Vehicles | POST | `/api/vehicles` | Add vehicle |
| Vehicles | PUT | `/api/vehicles/{id}` | Update vehicle |
| Mechanics | GET | `/api/mechanics` | List mechanics |
| Mechanics | GET | `/api/mechanics/available` | Available only |
| Mechanics | POST | `/api/mechanics` | Add mechanic |
| Service Requests | GET | `/api/service-requests` | List (filter by ?status=) |
| Service Requests | POST | `/api/service-requests` | Create request |
| Service Requests | PATCH | `/api/service-requests/{id}/status` | Update status |
| Service Requests | PATCH | `/api/service-requests/{id}/assign/{mechanicId}` | Assign mechanic |
| Inventory | GET | `/api/inventory` | List (filter by ?category=, ?search=) |
| Inventory | GET | `/api/inventory/low-stock` | Low stock items |
| Inventory | PATCH | `/api/inventory/{id}/adjust` | Adjust quantity |
| Invoices | GET | `/api/invoices` | List invoices |
| Invoices | POST | `/api/invoices` | Generate invoice (+ PDF) |
| Invoices | PATCH | `/api/invoices/{id}/pay` | Mark as paid |
| Dashboard | GET | `/api/dashboard/stats` | Aggregate stats |

Full interactive docs at **`/swagger-ui.html`** once the backend is running.

---

## Features

- **JWT Authentication** — stateless, role-based (ADMIN / STAFF)
- **Customer Management** — CRUD with phone/email uniqueness validation
- **Vehicle Management** — linked to customers, licence-plate deduplication
- **Service Request Workflow** — PENDING → IN_PROGRESS → COMPLETED / CANCELLED; auto-sets mechanic status
- **Mechanic Management** — availability tracking, specialisation, hourly rate
- **Inventory Management** — categories, low-stock alerts, one-click quantity adjustment
- **Invoice Generation** — auto-calculates 15% VAT, generates PDF via iText, mark-as-paid
- **Dashboard** — live stats cards + monthly revenue bar chart + recent activity feed
- **Search & Filter** — full-text search on customers, inventory; status filter on service requests

---

## Running Tests

```bash
# Backend unit tests
cd backend
mvn test

# Individual test class
mvn test -Dtest=CustomerServiceTest
```

---

## Deployment

### Environment Variables (Docker / Production)

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Full JDBC URL | localhost |
| `SPRING_DATASOURCE_USERNAME` | DB user | root |
| `SPRING_DATASOURCE_PASSWORD` | DB password | root |
| `APP_JWT_SECRET` | Base64 JWT secret (≥256 bits) | (see compose) |

### Railway (free tier)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
railway variables set SPRING_DATASOURCE_URL=... APP_JWT_SECRET=...
```

---

## Seed Data Summary

After running `seed.sql`:

| Entity | Count |
|--------|-------|
| Users | 2 (admin + staff) |
| Customers | 5 |
| Mechanics | 4 |
| Vehicles | 6 |
| Service Requests | 6 (mix of statuses) |
| Inventory Items | 12 |

---

## Development Notes

- All passwords in seed data are BCrypt-hashed (`password` = `admin123` / `staff123`)
- PDF invoices are saved under `./uploads/invoices/` (or `/app/uploads/invoices/` in Docker)
- `spring.jpa.hibernate.ddl-auto=update` — tables are created/migrated automatically on startup
- CORS is configured for `http://localhost:4200` in development; update `CorsConfig.java` for production
