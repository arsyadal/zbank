# ZBank — Core Banking System

Aplikasi perbankan digital full-stack dengan backend Spring Boot dan frontend Next.js. Mendukung registrasi akun, transfer dana antar rekening, top up, riwayat transaksi, dan notifikasi real-time via WebSocket.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Spring Boot 3.2, Java 17, Spring Security, JWT |
| Database | PostgreSQL 16 |
| Message Broker | Apache Kafka |
| Real-time | WebSocket (STOMP / SockJS) |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| State Management | Zustand |
| Animasi | Framer Motion |
| HTTP Client | Axios |

---

## Struktur Proyek

```
zbank/
├── backend/                    # Spring Boot — Core Banking Engine
│   ├── src/main/java/com/zbank/
│   │   ├── config/             # SecurityConfig, WebSocketConfig
│   │   ├── controller/         # Auth, Account, Transaction, External
│   │   ├── dto/                # Request & Response DTOs
│   │   ├── entity/             # Account, Transaction
│   │   ├── exception/          # BusinessException, GlobalExceptionHandler
│   │   ├── kafka/              # TransactionEventPublisher, TransactionEventConsumer
│   │   ├── repository/         # AccountRepository, TransactionRepository
│   │   ├── security/           # JWT, TokenBlacklist, UserDetailsService
│   │   └── service/            # AuthService, AccountService, TransactionService
│   ├── src/test/               # Unit tests (JUnit 5 + Mockito)
│   └── docker-compose.yml      # PostgreSQL + Kafka
│
└── frontend/                   # Next.js — Web App
    └── src/
        ├── app/                # Pages
        │   ├── page.tsx        # Landing
        │   ├── login/
        │   ├── register/
        │   ├── dashboard/
        │   ├── transfer/
        │   ├── topup/
        │   ├── history/
        │   ├── settings/
        │   └── transactions/[ref]/
        ├── components/
        │   ├── layout/         # DashboardLayout, ProtectedRoute
        │   └── ui/             # BalanceCard, TransactionList, BackgroundEffects
        ├── hooks/              # useWebSocket
        ├── lib/                # Axios API client
        ├── store/              # Zustand auth store
        └── types/              # TypeScript types
```

---

## Prasyarat

- Java 17
- Maven 3.x
- Node.js 18+
- Docker Desktop

---

## Cara Menjalankan

### 1. Jalankan Infrastruktur (PostgreSQL + Kafka)

```bash
cd backend
docker compose up -d
```

| Service    | Host      | Port   | Kredensial           |
|------------|-----------|--------|----------------------|
| PostgreSQL | localhost | `5435` | `zbank` / `zbank123` |
| Kafka      | localhost | `9092` | —                    |

### 2. Jalankan Backend

```bash
cd backend
mvn spring-boot:run
```

Backend berjalan di `http://localhost:8080`

### 3. Jalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/api/auth/register` | Public | Daftar akun baru |
| POST | `/api/auth/login` | Public | Login, dapat JWT token |
| POST | `/api/auth/logout` | Auth | Blacklist token (server-side logout) |

### Account
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/api/accounts/me` | Auth | Info akun sendiri |
| GET | `/api/accounts/dashboard` | Auth | Data dashboard (saldo, statistik) |
| PUT | `/api/accounts/change-password` | Auth | Ganti password |
| PUT | `/api/accounts/change-pin` | Auth | Ganti PIN transaksi |

### Transaksi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/api/transactions/transfer` | Auth | Transfer ke rekening lain |
| GET | `/api/transactions/history` | Auth | Riwayat transaksi (paginasi) |
| GET | `/api/transactions/{ref}` | Auth | Detail satu transaksi |

### External
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/api/external/topup/{accountNumber}` | Public | Top up saldo (simulasi payment gateway) |

---

## Fitur

| Fitur | Deskripsi |
|-------|-----------|
| Registrasi & Login | JWT stateless, password & PIN di-hash bcrypt |
| Transfer | Validasi PIN, pessimistic locking, isolasi SERIALIZABLE |
| Top Up | Endpoint publik untuk integrasi payment gateway eksternal |
| Riwayat Transaksi | Pagination 20 item/halaman |
| Detail Transaksi | Info lengkap: ref, status, amount, timestamp |
| Ganti Password/PIN | Verifikasi nilai lama sebelum update |
| Logout Backend | Token blacklist in-memory, token lama langsung tidak valid |
| Notifikasi Real-time | Kafka → WebSocket → toast notifikasi di dashboard |

---

## Menjalankan Test

```bash
cd backend
mvn test
```

8 unit test, 0 failures. Test menggunakan Mockito — tidak membutuhkan database atau Kafka.

---

## Konfigurasi

### Backend (`backend/src/main/resources/application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5435/zbank
    username: zbank
    password: zbank123
  kafka:
    bootstrap-servers: localhost:9092

server:
  port: 8080

app:
  jwt:
    secret: zbankSuperSecretKeyForJwtTokenGeneration2024VeryLongSecretKey
    expiration: 86400000   # 24 jam (ms)
```

### Frontend (`frontend/.env.local`) — opsional
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## WebSocket

Frontend subscribe ke topic per akun:

```
ws://localhost:8080/ws  →  /topic/transactions/{accountNumber}
```

Notifikasi muncul otomatis di dashboard saat ada transfer masuk atau keluar.
