export interface User {
  accountNumber: string
  fullName: string
  email: string
}

export interface AuthResponse {
  token: string
  tokenType: string
  expiresIn: number
  account: User
}

export interface DashboardData {
  accountNumber: string
  fullName: string
  balance: number
  totalTransactions: number
  todayTransactions: number
}

export interface Transaction {
  id: string
  transactionRef: string
  sourceAccount: string
  destinationAccount: string
  amount: number
  type: string
  status: string
  description: string | null
  createdAt: string
  processedAt: string | null
}

export interface TransferRequest {
  destinationAccount: string
  amount: number
  pin: string
  description?: string
}

export interface TopUpRequest {
  amount: number
  reference?: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  pin: string
}

export interface LoginRequest {
  email: string
  password: string
}
