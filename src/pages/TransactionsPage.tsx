import { useState, useMemo, useRef, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useDatabase } from "@/hooks/useDatabase"
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/uitils/storage"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "@/types"

const PAGE_SIZE = 20

export default function TransactionsPage() {
  const { user } = useAuth()
  const { refresh, db } = useDatabase()

  const transactions = useMemo(() => db.transactions[user!.id] ?? [], [
    db.transactions,
    user?.id,
  ])

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loaderRef = useRef<HTMLDivElement>(null)

  const [isAdding, setIsAdding] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [form, setForm] = useState<{
    description: string
    amount: number
    type: "credit" | "debit"
  }>({
    description: "",
    amount: 0,
    type: "credit",
  })


  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, transactions.length))
  }, [transactions.length])

 
  useMemo(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: "200px" }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  const visibleTransactions = useMemo(
    () => transactions.slice(0, visibleCount),
    [transactions, visibleCount]
  )

  const handleSubmit = () => {
    if (!form.description || form.amount <= 0) {
      alert("Fill all fields correctly")
      return
    }

    if (editingTx) {
      updateTransaction(user!.id, { ...editingTx, ...form })
    } else {
      addTransaction({ ...form, userId: user!.id })
    }

    refresh()
    setIsAdding(false)
    setEditingTx(null)
    setForm({ description: "", amount: 0, type: "credit" })
  }

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx)
    setForm({
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
    })
    setIsAdding(true)
  }

  const handleDelete = (txId: string) => {
    if (confirm("Delete transaction?")) {
      deleteTransaction(user!.id, txId)
      refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>

        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button>Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTx ? "Edit" : "Add"} Transaction</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <Input
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />
              <Select
                value={form.type}
                onValueChange={(val: "credit" | "debit") =>
                  setForm({ ...form, type: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button onClick={handleSubmit}>{editingTx ? "Save" : "Add"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.description}</TableCell>
                <TableCell>${tx.amount.toFixed(2)}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" onClick={() => handleEdit(tx)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(tx.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div ref={loaderRef}></div>
      </Card>
    </div>
  )
}