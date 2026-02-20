export type Transaction = {
  id: string
  userId: string
  amount: number
  type: "credit" | "debit"
  description: string
  createdAt: number
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "user"
}

export type Database = {
  users: Record<string, User>
  transactions: Record<string, Transaction[]>
}