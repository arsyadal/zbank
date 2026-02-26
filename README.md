# ZBank - Core Banking & Transaction Engine

A modern digital banking simulation system demonstrating enterprise-grade backend architecture with Spring Boot and a sleek frontend with Next.js.

## Architecture

```
zbank/
├── backend/                 # Spring Boot 3.x Backend
│   ├── src/main/java/com/zbank/
│   │   ├── config/         # Security & CORS Configuration
│   │   ├── controller/     # REST API Endpoints
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA Entities
│   │   ├── exception/      # Global Exception Handling
│   │   ├── kafka/          # Event Publishing
│   │   ├── repository/     # Data Access Layer
│   │   ├── security/       # JWT Authentication
│   │   └── service/        # Business Logic
│   └── src/test/           # Unit Tests
├── frontend/               # Next.js 14 Frontend
│   └── src/
│       ├── app/           # Pages & Routes
│       ├── components/    # React Components
│       ├── lib/           # API Client
│       ├── store/         # Zustand State
│       └── types/         # TypeScript Types
└── docker-compose.yml     # PostgreSQL & Kafka
```

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL + Spring Data JPA
- **Messaging**: Apache Kafka
- **Testing**: JUnit 5 + Mockito

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State**: Zustand
- **HTTP**: Axios

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Run Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Access the application at http://localhost:3000

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Authenticate user |

### Account
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts/me` | Get current account info |
| GET | `/api/accounts/dashboard` | Get dashboard data |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/transfer` | Transfer funds |
| GET | `/api/transactions/history` | Get transaction history |
| GET | `/api/transactions/{ref}` | Get transaction by ref |

### External
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/external/topup/{account}` | Simulate top-up |

## Features

### Security Service
- JWT-based authentication
- BCrypt password hashing
- PIN verification for transactions
- Role-based access control

### Account Service
- Account creation with unique account numbers
- Balance management
- Account status tracking

### Transaction Service
- ACID-compliant transfers with pessimistic locking
- Top-up simulation (Payment Gateway integration)
- Transaction history with pagination
- Kafka event publishing

## Testing

```bash
cd backend
./mvnw test
```

## Environment Variables

### Backend (application.yml)
```yaml
spring.datasource.url: jdbc:postgresql://localhost:5432/zbank
spring.datasource.username: zbank
spring.datasource.password: zbank123
app.jwt.secret: your-secret-key
app.jwt.expiration: 86400000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
# zbank
