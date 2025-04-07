"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import IssueCard from "@/components/issue-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function IssuesPage() {
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const fetchIssues = async (page: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/issues?sort=${sort}&page=${page}&limit=10`)
      if (!response.ok) {
        throw new Error("Failed to fetch issues")
      }
      const data = await response.json()
      setIssues(data.issues)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Error fetching issues:", error)
      toast({
        title: "Error",
        description: "Failed to load issues. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues(currentPage)
  }, [currentPage, sort])

  const handleSortChange = (value: string) => {
    setSort(value)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <main className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Community Issues</h1>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                There are no issues to display at this time.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </main>
  )
}

