import { useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useDatabase } from "@/hooks/useDatabase"
import { calculateTotals } from "@/uitils/calculations"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function UserDashboard() {
  const { user } = useAuth()
  const { db } = useDatabase()

  const transactions = useMemo(
    () => db.transactions[user!.id] ?? [],
    [db.transactions, user?.id]
  )

  const totals = useMemo(() => calculateTotals(transactions), [transactions])

  const last10 = useMemo(() => transactions.slice(0, 10), [transactions])

  const chartData = useMemo(
    () => [
      { name: "Income", value: totals.credit },
      { name: "Expense", value: totals.debit },
    ],
    [totals]
  )

  return (
    <div className="space-y-6">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome, {user?.name}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
          <p className="text-xl font-bold">${totals.credit.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Expense</h3>
          <p className="text-xl font-bold">${totals.debit.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Current Balance</h3>
          <p className="text-xl font-bold">${totals.balance.toFixed(2)}</p>
        </Card>
      </div>

     
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Income vs Expense</h3>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

     
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Last 10 Transactions</h3>
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
            {last10.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.description}</TableCell>
                <TableCell>${tx.amount.toFixed(2)}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}