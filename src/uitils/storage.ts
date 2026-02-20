import type { Database, User, Transaction } from "@/types"
import { v4 as uuidv4 } from "uuid"

const DB_KEY = "expense_tracker_db"
const SESSION_KEY = "expense_tracker_session"



export const getDB = (): Database => {
  const raw = localStorage.getItem(DB_KEY)
  if (raw) return JSON.parse(raw)
  const initial: Database = { users: {}, transactions: {} }
  localStorage.setItem(DB_KEY, JSON.stringify(initial))
  return initial
}

export const saveDB = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}



export const saveSession = (userId: string) => {
  localStorage.setItem(SESSION_KEY, userId)
}

export const getSession = (): string | null => {
  return localStorage.getItem(SESSION_KEY)
}

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
}



export const createUser = (data: Omit<User, "id">): User => {
  const db = getDB()
  const id = uuidv4()
  const newUser: User = { ...data, id }
  db.users[id] = newUser
  db.transactions[id] = []
  saveDB(db)
  return newUser
}



export const addTransaction = (data: Omit<Transaction, "id" | "createdAt">) => {
  const db = getDB()
  const tx: Transaction = {
    ...data,
    id: uuidv4(),
    createdAt: Date.now(),
  }
  db.transactions[data.userId].unshift(tx) 
  saveDB(db)
  return tx
}

export const updateTransaction = (userId: string, tx: Transaction) => {
  const db = getDB()
  const index = db.transactions[userId].findIndex((t) => t.id === tx.id)
  if (index === -1) throw new Error("Transaction not found")
  db.transactions[userId][index] = tx
  saveDB(db)
}

export const deleteTransaction = (userId: string, txId: string) => {
  const db = getDB()
  db.transactions[userId] = db.transactions[userId].filter(
    (t) => t.id !== txId
  )
  saveDB(db)
}

export const getUserTransactions = (userId: string): Transaction[] => {
  const db = getDB()
  return db.transactions[userId] ?? []
}