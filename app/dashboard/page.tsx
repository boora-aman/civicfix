"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Clock, FileText, MapPin, Plus, ThumbsUp, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import type { Issue } from "@/types/issue"
import { formatDate, getStatusColor } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard")
    }
  }, [status, router])

  const [userIssues, setUserIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  })

  useEffect(() => {
    async function fetchUserIssues() {
      if (status !== "authenticated") return

      try {
        const response = await fetch("/api/user/issues")
        if (response.ok) {
          const data = await response.json()
          setUserIssues(data)

          // Calculate stats
          const total = data.length
          const pending = data.filter((issue: Issue) => issue.status.toLowerCase() === "pending").length
          const inProgress = data.filter((issue: Issue) => issue.status.toLowerCase() === "in progress").length
          const resolved = data.filter((issue: Issue) => issue.status.toLowerCase() === "resolved").length

          setStats({ total, pending, inProgress, resolved })
        }
      } catch (error) {
        console.error("Error fetching user issues:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserIssues()
  }, [status])

  // Mock data for development
  useEffect(() => {
    if (!loading && userIssues.length === 0 && status === "authenticated") {
      const mockIssues = [
        {
          id: "1",
          title: "Large Pothole on Main Street",
          description: "Deep pothole causing traffic hazards near the intersection with Oak Avenue",
          location: "Main St & Oak Ave",
          category: "Pothole",
          priority: "High",
          status: "In Progress",
          createdAt: new Date("2023-11-15T10:30:00Z").toISOString(),
          upvotes: 12,
          comments: 5,
        },
        {
          id: "2",
          title: "Broken Sidewalk",
          description: "Cracked and uneven sidewalk creating accessibility issues",
          location: "123 Elm Street",
          category: "Sidewalk",
          priority: "Medium",
          status: "Approved",
          createdAt: new Date("2023-11-10T14:45:00Z").toISOString(),
          upvotes: 5,
          comments: 2,
        },
        {
          id: "3",
          title: "Street Light Outage",
          description: "Multiple street lights not working, creating safety concerns at night",
          location: "Pine Avenue",
          category: "Lighting",
          priority: "Urgent",
          status: "Pending",
          createdAt: new Date("2023-11-18T09:15:00Z").toISOString(),
          upvotes: 3,
          comments: 1,
        },
      ] as Issue[]

      setUserIssues(mockIssues)
      setStats({
        total: 12,
        pending: 3,
        inProgress: 4,
        resolved: 5,
      })
    }
  }, [loading, userIssues, status])

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="flex-1 container py-6 px-4 md:py-10 md:px-6 mx-auto max-w-screen-2xl">
        <div className="h-screen flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 container py-6 px-4 md:py-10 md:px-6 mx-auto max-w-screen-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your reported issues and account</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/issues">
              <FileText className="mr-2 h-4 w-4" /> My Issues
            </Link>
          </Button>
          <Button asChild>
            <Link href="/issues/new">
              <Plus className="mr-2 h-4 w-4" /> Report New Issue
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mt-8">
        <TabsList>
          <TabsTrigger value="all">All Issues</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Issue</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Engagement</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div className="font-medium">{issue.title}</div>
                        <div className="text-xs text-muted-foreground">{issue.category}</div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{issue.location}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{formatDate(issue.createdAt)}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{issue.upvotes || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{issue.comments || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/issues/${issue.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Issue</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userIssues
                    .filter((issue) => issue.status.toLowerCase() === "pending")
                    .map((issue) => (
                      <tr
                        key={issue.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="font-medium">{issue.title}</div>
                          <div className="text-xs text-muted-foreground">{issue.category}</div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{issue.location}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{formatDate(issue.createdAt)}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/issues/${issue.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="in-progress">{/* Similar table for in-progress issues */}</TabsContent>
        <TabsContent value="resolved">{/* Similar table for resolved issues */}</TabsContent>
      </Tabs>
    </main>
  )
}

