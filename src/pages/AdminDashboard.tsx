import { useMemo } from "react"
import { useDatabase } from "@/hooks/useDatabase"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

export default function AdminDashboard() {
  const { db } = useDatabase()
  const navigate = useNavigate()

  const totalUsers = useMemo(() => Object.keys(db.users).length, [db.users])

  const allTransactions = useMemo(() => {
    let arr: any[] = []
    for (const userId in db.transactions) {
      arr = arr.concat(db.transactions[userId].map(tx => ({ ...tx, userId })))
    }
    arr.sort((a, b) => b.createdAt - a.createdAt)
    return arr
  }, [db.transactions])

  const totals = useMemo(() => {
    let credit = 0
    let debit = 0
    for (const t of allTransactions) {
      if (t.type === "credit") credit += t.amount
      else debit += t.amount
    }
    return { credit, debit, volume: credit + debit }
  }, [allTransactions])

  const last10 = useMemo(() => allTransactions.slice(0, 10), [allTransactions])

  const pieData = useMemo(() => {
    return Object.keys(db.users).map((id) => {
      const tx = db.transactions[id] || []
      const total = tx.reduce((sum, t) => sum + t.amount, 0)
      return { name: db.users[id].name, value: total, id }
    })
  }, [db.users, db.transactions])

  const COLORS = ["#4f46e5", "#f43f5e", "#14b8a6", "#facc15", "#f97316", "#3b82f6"]

  return (
    <div className="space-y-6">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard
      </motion.h1>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
          <p className="text-xl font-bold">{totalUsers}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Credits</h3>
          <p className="text-xl font-bold">${totals.credit.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Debits</h3>
          <p className="text-xl font-bold">${totals.debit.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Transaction Volume</h3>
          <p className="text-xl font-bold">${totals.volume.toFixed(2)}</p>
        </Card>
      </div>

    
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Expense Distribution per User</h3>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={(entry) => entry.name}
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

    
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Last 10 Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {last10.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <button
                    className="text-blue-500 underline"
                    onClick={() => navigate(`/admin/user/${tx.userId}`)}
                  >
                    {db.users[tx.userId]?.name}
                  </button>
                </TableCell>
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