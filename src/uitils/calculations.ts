import type { Transaction } from "@/types"

export const calculateTotals = (transactions: Transaction[]) => {
  let credit = 0
  let debit = 0

  for (const tx of transactions) {
    if (tx.type === "credit") credit += tx.amount
    else debit += tx.amount
  }

  const balance = credit - debit

  return { credit, debit, balance }
}