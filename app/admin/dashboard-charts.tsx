"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// Define colors for different categories and priorities
const CATEGORY_COLORS = {
  "Damaged Playground Equipment": "#FF6B6B",
  "Pothole on Main Street": "#4ECDC4",
  "Broken Street Light": "#FFD166",
  "Overflowing Trash Bin": "#06D6A0",
  "Graffiti on Public Library": "#118AB2",
  "Other": "#073B4C",
}

const PRIORITY_COLORS = {
  URGENT: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
}

export function DashboardCharts() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    )
  }

  if (!stats || Object.keys(stats.categoryDistribution || {}).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground">
            There is currently no data available to display charts. 
            Please create some issues to see analytics.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Format data for category distribution chart
  const categoryData = Object.entries(stats.categoryDistribution || {}).map(([name, value]) => ({
    name,
    value: Number(value),
  })).sort((a, b) => b.value - a.value)

  // Format data for priority vs votes chart
  const priorityVotesData = Object.entries(stats.priorityVotes || {}).map(([priority, votes]) => ({
    priority,
    votes: Number(votes),
    issues: stats.priorityDistribution?.[priority] || 0,
  })).sort((a, b) => {
    const priorityOrder = { 'URGENT': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 }
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - 
           (priorityOrder[b.priority as keyof typeof priorityOrder] || 0)
  })

  // Format data for monthly trends
  const monthlyTrendsData = Object.entries(stats.monthlyTrends || {}).map(([month, count]) => ({
    month,
    count: Number(count),
  }))

  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  monthlyTrendsData.sort((a, b) => {
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  })

  return (
    <Tabs defaultValue="categories" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="categories">Category Distribution</TabsTrigger>
        <TabsTrigger value="priority">Priority vs Votes</TabsTrigger>
        <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
      </TabsList>
      
      <TabsContent value="categories">
        <Card>
          <CardHeader>
            <CardTitle>Issue Categories Distribution</CardTitle>
            <CardDescription>Breakdown of issues by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || "#8884d8"} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="priority">
        <Card>
          <CardHeader>
            <CardTitle>Priority vs Votes</CardTitle>
            <CardDescription>Comparison of issue priority levels and community votes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityVotesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="issues" name="Number of Issues" fill="#8884d8">
                    {priorityVotesData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={PRIORITY_COLORS[entry.priority as keyof typeof PRIORITY_COLORS] || "#8884d8"} 
                      />
                    ))}
                  </Bar>
                  <Bar yAxisId="right" dataKey="votes" name="Total Votes" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="trends">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Issue Trends</CardTitle>
            <CardDescription>Number of issues reported per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Issues Reported" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 