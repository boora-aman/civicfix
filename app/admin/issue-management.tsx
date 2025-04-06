"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MapPin, Clock, Search, Check, X, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { formatDate, getPriorityColor, getStatusColor } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Issue } from "@/types/issue"

export default function IssueManagement() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast()

  // Fetch issues
  useEffect(() => {
    async function fetchIssues() {
      try {
        const response = await fetch("/api/admin/issues")
        if (response.ok) {
          const data = await response.json()
          setIssues(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch issues",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching issues:", error)
        toast({
          title: "Error",
          description: "Failed to fetch issues",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [toast])

  // Filter issues based on search and status filter
  const filteredIssues = issues.filter(issue => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Status filter
    const matchesStatus = filterStatus === "all" || issue.status.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  // Get issues by status
  const pendingIssues = filteredIssues.filter(issue => issue.status.toLowerCase() === "pending")
  const approvedIssues = filteredIssues.filter(issue => issue.status.toLowerCase() === "approved")
  const inProgressIssues = filteredIssues.filter(issue => issue.status.toLowerCase() === "in_progress")
  const resolvedIssues = filteredIssues.filter(issue => issue.status.toLowerCase() === "resolved")
  const rejectedIssues = filteredIssues.filter(issue => issue.status.toLowerCase() === "rejected")

  // Update issue status and priority
  const updateIssue = async (id: string, status: string, priority?: string) => {
    try {
      const response = await fetch(`/api/admin/issues/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status.toUpperCase(),
          priority: priority ? priority.toUpperCase() : undefined,
          note: priority 
            ? `Issue ${status.toLowerCase()} with ${priority.toLowerCase()} priority`
            : `Issue ${status.toLowerCase()}`
        }),
      })

      if (response.ok) {
        const updatedIssue = await response.json()
        // Update the local state
        setIssues(prevIssues => 
          prevIssues.map(issue => 
            issue.id === id ? { 
              ...issue, 
              status: updatedIssue.status,
              ...(priority ? { priority: updatedIssue.priority } : {})
            } : issue
          )
        )

        toast({
          title: "Success",
          description: `Issue has been ${status.toLowerCase()}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update issue",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating issue:", error)
      toast({
        title: "Error",
        description: "Failed to update issue",
        variant: "destructive",
      })
    }
  }

  // Approve issue with priority
  const approveIssue = (id: string, priority: string) => {
    updateIssue(id, "APPROVED", priority)
  }

  // Reject issue
  const rejectIssue = (id: string) => {
    updateIssue(id, "REJECTED")
  }

  // Mark issue as in progress
  const markInProgress = (id: string) => {
    updateIssue(id, "IN_PROGRESS")
  }

  // Mark issue as resolved
  const markResolved = (id: string) => {
    updateIssue(id, "RESOLVED")
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Issue Management</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="flex w-full overflow-x-auto">
          <TabsTrigger value="pending" className="flex-shrink-0">
            Pending <Badge variant="outline" className="ml-2">{pendingIssues.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex-shrink-0">
            Approved <Badge variant="outline" className="ml-2">{approvedIssues.length}</Badge>
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

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Issue</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Location</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden md:table-cell">Reported By</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Date</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pendingIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4 align-middle">
                            <div className="font-medium">{issue.title}</div>
                            <div className="text-xs text-muted-foreground">{issue.category}</div>
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden md:table-cell">{issue.user?.name || "Anonymous"}</td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{formatDate(issue.createdAt)}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-wrap items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => approveIssue(issue.id, "Low")}>
                                    <Badge className={getPriorityColor("Low")} variant="outline">
                                      Low
                                    </Badge>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => approveIssue(issue.id, "Medium")}>
                                    <Badge className={getPriorityColor("Medium")} variant="outline">
                                      Medium
                                    </Badge>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => approveIssue(issue.id, "High")}>
                                    <Badge className={getPriorityColor("High")} variant="outline">
                                      High
                                    </Badge>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => approveIssue(issue.id, "Urgent")}>
                                    <Badge className={getPriorityColor("Urgent")} variant="outline">
                                      Urgent
                                    </Badge>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button variant="outline" size="sm" onClick={() => rejectIssue(issue.id)}>
                                <X className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/issues/${issue.id}`}>View</Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Issue</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Location</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden md:table-cell">Reported By</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Date</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Priority</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {approvedIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4 align-middle">
                            <div className="font-medium">{issue.title}</div>
                            <div className="text-xs text-muted-foreground">{issue.category}</div>
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden md:table-cell">{issue.user?.name || "Anonymous"}</td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{formatDate(issue.createdAt)}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-wrap items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <AlertTriangle className="h-4 w-4 mr-1" /> Change Priority
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => updateIssue(issue.id, "APPROVED", "Low")}>
                                    <Badge className={getPriorityColor("Low")} variant="outline">
                                      Low
                                    </Badge>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateIssue(issue.id, "APPROVED", "Medium")}>
                                    <Badge className={getPriorityColor("Medium")} variant="outline">
                                      Medium
                                    </Badge>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateIssue(issue.id, "APPROVED", "High")}>
                                    <Badge className={getPriorityColor("High")} variant="outline">
                                      High
                                    </Badge>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateIssue(issue.id, "APPROVED", "Urgent")}>
                                    <Badge className={getPriorityColor("Urgent")} variant="outline">
                                      Urgent
                                    </Badge>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button variant="outline" size="sm" onClick={() => markInProgress(issue.id)}>
                                Mark In Progress
                              </Button>
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/issues/${issue.id}`}>View</Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Issue</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Location</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden md:table-cell">Reported By</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Date</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Priority</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {inProgressIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4 align-middle">
                            <div className="font-medium">{issue.title}</div>
                            <div className="text-xs text-muted-foreground">{issue.category}</div>
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden md:table-cell">{issue.user?.name || "Anonymous"}</td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{formatDate(issue.createdAt)}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-wrap items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => markResolved(issue.id)}>
                                <Check className="h-4 w-4 mr-1" /> Mark Resolved
                              </Button>
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/issues/${issue.id}`}>View</Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Issue</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Location</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden md:table-cell">Reported By</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Date</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Priority</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {resolvedIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4 align-middle">
                            <div className="font-medium">{issue.title}</div>
                            <div className="text-xs text-muted-foreground">{issue.category}</div>
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden md:table-cell">{issue.user?.name || "Anonymous"}</td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{formatDate(issue.createdAt)}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-wrap items-center gap-2">
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/issues/${issue.id}`}>View</Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Issue</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Location</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden md:table-cell">Reported By</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold hidden sm:table-cell">Date</th>
                        <th className="py-3.5 px-4 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rejectedIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4 align-middle">
                            <div className="font-medium">{issue.title}</div>
                            <div className="text-xs text-muted-foreground">{issue.category}</div>
                            <div className="sm:hidden mt-1 text-xs text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{issue.location}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle hidden md:table-cell">{issue.user?.name || "Anonymous"}</td>
                          <td className="p-4 align-middle hidden sm:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{formatDate(issue.createdAt)}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-wrap items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Check className="h-4 w-4 mr-1" /> Reconsider
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => approveIssue(issue.id, "Low")}>
                                    <Badge className={getPriorityColor("Low")} variant="outline">
                                      Low
                                    </Badge>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => approveIssue(issue.id, "Medium")}>
                                    <Badge className={getPriorityColor("Medium")} variant="outline">
                                      Medium
                                    </Badge>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => approveIssue(issue.id, "High")}>
                                    <Badge className={getPriorityColor("High")} variant="outline">
                                      High
                                    </Badge>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => approveIssue(issue.id, "Urgent")}>
                                    <Badge className={getPriorityColor("Urgent")} variant="outline">
                                      Urgent
                                    </Badge>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/issues/${issue.id}`}>View</Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 