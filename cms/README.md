# 🎓 College Student Management System

A full-stack web application built with **Spring Boot + React.js + MySQL + JWT**.

---

## 📁 Project Structure

```
college-mgmt/
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/college/
│   │   ├── config/           # Security, OpenAPI config
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Spring Data repositories
│   │   ├── security/         # JWT filter & utils
│   │   └── service/          # Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/                 # React.js application
│   └── src/
│       ├── components/       # UI components per module
│       ├── context/          # Auth context
│       ├── services/         # Axios API calls
│       └── styles.css        # Global styles
└── database/
    └── init.sql              # DB schema + seed data
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## 🚀 Setup & Run

### 1. Database

```bash
mysql -u root -p < database/init.sql
```

Or manually in MySQL:
```sql
CREATE DATABASE college_db;
```

---

### 2. Backend (Spring Boot)

**Update credentials** in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

**Run:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on → **http://localhost:8080**  
Swagger UI → **http://localhost:8080/swagger-ui.html**

---

### 3. Frontend (React.js)

```bash
cd frontend
npm install
npm start
```

Frontend runs on → **http://localhost:3000**

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | admin123 |
| Teacher | teacher@college.edu | admin123 |

---

## 🧩 Modules

### User Management (Admin only)
- Register/login with JWT
- CRUD for Admin and Teacher users
- Role-based access control

### Student Management
- Add, edit, delete students (Admin)
- View and search students (Teacher + Admin)
- Pagination and full-text search

### Marks Management
- Add/update/delete subject marks
- Per-student, per-semester records
- Visual progress bars with percentage

### Fee Management
- Track total, paid, and due amounts
- Auto-calculates payment status: PAID / PARTIAL / DUE
- Admin: full CRUD | Teacher: view + update only

### Document Generation
- Bonafide Certificate
- Transfer Certificate
- Marksheet
- Auto-generated content or custom input

### Dashboard
- Total students, fees collected/pending
- Average marks by department (bar chart)
- Role-aware view

---

## 🔑 API Endpoints Summary

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/register` | Public |
| POST | `/api/login` | Public |
| GET | `/api/users/me` | All |
| GET | `/api/users` | Admin |
| PUT | `/api/users/{id}` | Admin |
| DELETE | `/api/users/{id}` | Admin |

### Students
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/students` | All |
| GET | `/api/students/{id}` | All |
| GET | `/api/students/search?q=` | All |
| POST | `/api/students` | Admin |
| PUT | `/api/students/{id}` | Admin |
| DELETE | `/api/students/{id}` | Admin |

### Marks
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/marks` | All |
| GET | `/api/marks/student/{id}` | All |
| POST | `/api/marks/student/{id}` | All |
| PUT | `/api/marks/{id}` | All |
| DELETE | `/api/marks/{id}` | All |

### Fees
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/fees` | All |
| GET | `/api/fees/{studentId}` | All |
| POST | `/api/fees/student/{id}` | Admin |
| PUT | `/api/fees/{id}` | All |
| DELETE | `/api/fees/{id}` | Admin |

### Documents
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/documents` | All |
| POST | `/api/documents/bonafide` | All |
| POST | `/api/documents/transfer-certificate` | All |
| POST | `/api/documents/marksheet` | All |
| GET | `/api/documents/student/{id}` | All |

### Dashboard
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/dashboard` | All |

---

## 🛡️ Security Architecture

```
React Frontend
     │
     │  JWT Bearer Token (Authorization header)
     ▼
Spring Security Filter Chain
     │
     ├── JwtAuthFilter  →  validates token  →  sets SecurityContext
     │
     ├── @PreAuthorize("hasRole('ADMIN')")  →  method-level guards
     │
     └── Controller endpoints
```

- Passwords encrypted with **BCrypt**
- JWT signed with **HS256**, expiry: 24 hours
- CORS configured for `http://localhost:3000`

---

## 🗄️ Database Schema

```
users ──────────────────────────────────────────┐
  id, full_name, email, password, role           │
                                                 │ created_by
students ──────┬────────────────────────────────┼──► documents
  id, name,    │                                 │      id, student_id, type,
  roll_number, │                                 │      issue_date, content
  department,  ├──────────────────────────────► marks
  year, email  │                                        id, subject,
               │                                        marks_obtained, semester
               └──────────────────────────────► fees
                                                        id, total_amount,
                                                        paid_amount, due_amount,
                                                        payment_status
```

---

## 🧪 Running Tests

```bash
cd backend
mvn test
```

---

## 📦 Building for Production

**Backend:**
```bash
cd backend
mvn clean package -DskipTests
java -jar target/college-management-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build/ folder with nginx or any static server
```

---

## 🔧 Environment Variables (Production)

Create `application-prod.properties`:
```properties
spring.datasource.url=jdbc:mysql://YOUR_DB_HOST:3306/college_db
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}
jwt.secret=${JWT_SECRET}
```

Run with:
```bash
java -jar target/college-management-1.0.0.jar --spring.profiles.active=prod
```
