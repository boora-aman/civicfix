"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Filter, Search } from "lucide-react"
import Link from "next/link"
import type { Issue } from "@/types/issue"
import { getPriorityColor, getStatusColor, formatDate } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

export default function IssuesList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [priority, setPriority] = useState(searchParams.get("priority") || "all")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true)
      try {
        // Build query string
        const params = new URLSearchParams()
        if (category !== "all") params.append("category", category)
        if (status !== "all") params.append("status", status)
        if (priority !== "all") params.append("priority", priority)
        if (sortBy) params.append("sort", sortBy)
        if (searchTerm) params.append("search", searchTerm)

        const response = await fetch(`/api/issues?${params.toString()}`)
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
  }, [category, status, priority, sortBy, searchTerm])

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category !== "all") params.append("category", category)
    if (status !== "all") params.append("status", status)
    if (priority !== "all") params.append("priority", priority)
    if (sortBy) params.append("sort", sortBy)

    router.push(`/issues?${params.toString()}`)
  }

  // Fallback to mock data if API fails or during development
  useEffect(() => {
    if (!loading && issues.length === 0) {
      // Mock data for issues
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
          images: [{ url: "/placeholder.svg?height=200&width=300" }],
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
          images: [{ url: "/placeholder.svg?height=200&width=300" }],
        },
        {
          id: "3",
          title: "Street Light Outage",
          description: "Multiple street lights not working, creating safety concerns at night",
          location: "Pine Avenue",
          category: "Lighting",
          priority: "Urgent",
          status: "Approved",
          createdAt: new Date("2023-11-18T09:15:00Z").toISOString(),
          images: [{ url: "/placeholder.svg?height=200&width=300" }],
        },
        {
          id: "4",
          title: "Fallen Tree Blocking Path",
          description: "Large tree has fallen across the walking path in Central Park",
          location: "Central Park, West Entrance",
          category: "Parks",
          priority: "High",
          status: "Pending",
          createdAt: new Date("2023-11-20T08:00:00Z").toISOString(),
          images: [{ url: "/placeholder.svg?height=200&width=300" }],
        },
        {
          id: "5",
          title: "Graffiti on Public Building",
          description: "Extensive graffiti on the south wall of the community center",
          location: "Community Center, 500 Main St",
          category: "Vandalism",
          priority: "Low",
          status: "Approved",
          createdAt: new Date("2023-11-05T16:20:00Z").toISOString(),
          images: [{ url: "/placeholder.svg?height=200&width=300" }],
        },
        {
          id: "6",
          title: "Damaged Playground Equipment",
          description: "Swing set with broken chains at Lincoln Elementary playground",
          location: "Lincoln Elementary School",
          category: "Parks",
          priority: "Medium",
          status: "In Progress",
          createdAt: new Date("2023-11-12T11:10:00Z").toISOString(),
          images: [{ url: "/placeholder.svg?height=200&width=300" }],
        },
      ] as Issue[]

      setIssues(mockIssues)
    }
  }, [loading, issues])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
      {/* Filters sidebar */}
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Search</h3>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Category</h3>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="pothole">Potholes</SelectItem>
              <SelectItem value="sidewalk">Sidewalks</SelectItem>
              <SelectItem value="lighting">Lighting</SelectItem>
              <SelectItem value="parks">Parks & Recreation</SelectItem>
              <SelectItem value="vandalism">Vandalism</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="font-medium mb-2">Status</h3>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="font-medium mb-2">Priority</h3>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="font-medium mb-2">Sort By</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="priority">Highest Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full" onClick={applyFilters}>
          <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </div>

      {/* Issues grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted animate-pulse" />
              <CardHeader className="p-4">
                <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
                <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-9 bg-muted animate-pulse rounded w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <Card key={issue.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={issue.images?.[0]?.url || "/placeholder.svg?height=200&width=300"}
                  alt={issue.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg">{issue.title}</CardTitle>
                  <div className="flex flex-col gap-1">
                    <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{issue.description}</p>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{issue.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Reported on {formatDate(issue.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/issues/${issue.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

