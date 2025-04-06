import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import IssuesList from "@/components/issues-list"

export default function IssuesPage() {
  return (
    <main className="flex-1 container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Issues</h1>
          <p className="text-muted-foreground">Browse and filter reported issues in your area</p>
        </div>
        <Button asChild>
          <Link href="/issues/new">
            <Plus className="mr-2 h-4 w-4" /> Report New Issue
          </Link>
        </Button>
      </div>

      <IssuesList />
    </main>
  )
}

