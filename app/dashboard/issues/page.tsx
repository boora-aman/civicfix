"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { formatDate, getPriorityColor, getStatusColor } from "@/lib/utils"

export default function MyIssuesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/issues")
    }
  }, [status, router])

  // Fetch user's issues
  useEffect(() => {
    if (status === "authenticated") {
      const fetchIssues = async () => {
        try {
          const response = await fetch("/api/issues?userId=me")
          if (response.ok) {
            const data = await response.json()
            setIssues(data)
          }
        } catch (error) {
          console.error("Error fetching issues:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchIssues()
    }
  }, [status])

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <main className="flex-1 container py-6 px-4 md:py-10 md:px-6 mx-auto max-w-screen-2xl">
        <div className="h-screen flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </main>
    )
  }

  // Filter issues by status
  const pendingIssues = issues.filter(issue => ["PENDING", "APPROVED"].includes(issue.status))
  const inProgressIssues = issues.filter(issue => issue.status === "IN_PROGRESS")
  const resolvedIssues = issues.filter(issue => issue.status === "RESOLVED")
  const rejectedIssues = issues.filter(issue => issue.status === "REJECTED")

  return (
    <main className="flex-1 container py-6 px-4 md:py-10 md:px-6 mx-auto max-w-screen-2xl">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Issues</h1>
            <p className="text-muted-foreground">Track and manage the issues you've reported</p>
          </div>
          <Button asChild>
            <Link href="/issues/new">
              <Plus className="mr-2 h-4 w-4" /> Report New Issue
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="flex w-full overflow-x-auto">
          <TabsTrigger value="pending" className="flex-shrink-0">
            Pending <Badge variant="outline" className="ml-2">{pendingIssues.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex-shrink-0">
            In Progress <Badge variant="outline" className="ml-2">{inProgressIssues.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex-shrink-0">
            Resolved <Badge variant="outline" className="ml-2">{resolvedIssues.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex-shrink-0">
            Rejected <Badge variant="outline" className="ml-2">{rejectedIssues.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Pending Issues */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Issues</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingIssues.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingIssues.map((issue) => (
                    <Link href={`/issues/${issue.id}`} key={issue.id} className="block">
                      <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          </div>
                          <h3 className="font-medium mb-1">{issue.title}</h3>
                          <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {issue.description}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{issue.location}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(issue.createdAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending issues found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* In Progress Issues */}
        <TabsContent value="in-progress">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Issues</CardTitle>
            </CardHeader>
            <CardContent>
              {inProgressIssues.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {inProgressIssues.map((issue) => (
                    <Link href={`/issues/${issue.id}`} key={issue.id} className="block">
                      <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          </div>
                          <h3 className="font-medium mb-1">{issue.title}</h3>
                          <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {issue.description}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{issue.location}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(issue.createdAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No issues in progress.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resolved Issues */}
        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Issues</CardTitle>
            </CardHeader>
            <CardContent>
              {resolvedIssues.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {resolvedIssues.map((issue) => (
                    <Link href={`/issues/${issue.id}`} key={issue.id} className="block">
                      <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          </div>
                          <h3 className="font-medium mb-1">{issue.title}</h3>
                          <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {issue.description}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{issue.location}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(issue.createdAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No resolved issues yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rejected Issues */}
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Issues</CardTitle>
            </CardHeader>
            <CardContent>
              {rejectedIssues.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rejectedIssues.map((issue) => (
                    <Link href={`/issues/${issue.id}`} key={issue.id} className="block">
                      <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          </div>
                          <h3 className="font-medium mb-1">{issue.title}</h3>
                          <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {issue.description}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{issue.location}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(issue.createdAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No rejected issues.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
} 