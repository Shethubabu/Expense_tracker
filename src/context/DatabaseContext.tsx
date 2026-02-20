import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react"
import type { Database } from "@/types"
import { getDB } from "@/uitils/storage"

type DatabaseContextType = {
  db: Database
  refresh: () => void
}

export const DatabaseContext =
  createContext<DatabaseContextType | null>(null)

export const DatabaseProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [db, setDb] = useState<Database>(() => getDB())

  
  const refresh = useCallback(() => {
    setDb(getDB())
  }, [])

  const value = useMemo(
    () => ({
      db,
      refresh,
    }),
    [db, refresh]
  )

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  )
}