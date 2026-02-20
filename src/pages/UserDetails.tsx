import { useMemo, useState, useRef, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useDatabase } from "@/hooks/useDatabase"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const PAGE_SIZE = 20

export default function UserDetails() {
  const { id } = useParams<{ id: string }>()
  const { db } = useDatabase()

  const user = db.users[id!]
  const transactions = useMemo(() => db.transactions[id!] ?? [], [db.transactions, id])

  
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loaderRef = useRef<HTMLDivElement>(null)

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

  const totals = useMemo(() => {
    let credit = 0, debit = 0
    for (const t of transactions) {
      if (t.type === "credit") credit += t.amount
      else debit += t.amount
    }
    return { credit, debit, balance: credit - debit }
  }, [transactions])

  const visibleTransactions = useMemo(() => transactions.slice(0, visibleCount), [transactions, visibleCount])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Details: {user?.name}</h1>

     
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
          <p>{user?.name}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
          <p>{user?.email}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Credit</h3>
          <p>${totals.credit.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Debit</h3>
          <p>${totals.debit.toFixed(2)}</p>
        </Card>

        <Card className="p-6 md:col-span-4">
          <h3 className="text-sm font-medium text-muted-foreground">Balance</h3>
          <p className="text-xl font-bold">${totals.balance.toFixed(2)}</p>
        </Card>
      </div>

     
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.description}</TableCell>
                <TableCell>${tx.amount.toFixed(2)}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div ref={loaderRef}></div>
      </Card>
    </div>
  )
}