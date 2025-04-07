"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, AlertTriangle, CheckCircle2, BarChart3, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

type OverviewStats = {
  totalIssues: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  approved: number;
  priorityDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
}

// Animation classes
const fadeIn = "animate-in fade-in duration-500"
const slideUp = "animate-in slide-in-from-bottom-8 duration-500"

// Priority colors for the pie chart
const PRIORITY_COLORS = ["#ef4444", "#f97316", "#facc15", "#4ade80"]

export default function AdminOverview() {
  const [stats, setStats] = useState<OverviewStats>({
    totalIssues: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    approved: 0,
    priorityDistribution: [
      { name: "URGENT", value: 0, color: PRIORITY_COLORS[0] },
      { name: "HIGH", value: 0, color: PRIORITY_COLORS[1] },
      { name: "MEDIUM", value: 0, color: PRIORITY_COLORS[2] },
      { name: "LOW", value: 0, color: PRIORITY_COLORS[3] },
    ]
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/overview")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch admin statistics",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching admin statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  // Demo stats for when real stats are loading
  const demoStats = {
    totalIssues: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    approved: 0,
    priorityDistribution: stats.priorityDistribution
  }

  // Stats to render (use real data if available, otherwise demo data)
  const displayStats = loading ? demoStats : stats

  return (
    <div className="space-y-6">
      {/* Stats overview cards with smooth animations */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={cn(fadeIn, "delay-100", "shadow-sm hover:shadow transition-shadow")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={displayStats.totalIssues} />
            </div>
            <p className="text-xs text-muted-foreground">
              All reported community issues
            </p>
          </CardContent>
        </Card>
        <Card className={cn(fadeIn, "delay-200", "shadow-sm hover:shadow transition-shadow")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={displayStats.pending} />
            </div>
            <p className="text-xs text-muted-foreground">
              {displayStats.pending > 0 ? "Need your attention" : "No pending issues"}
            </p>
          </CardContent>
        </Card>
        <Card className={cn(fadeIn, "delay-300", "shadow-sm hover:shadow transition-shadow")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={displayStats.inProgress} />
            </div>
            <p className="text-xs text-muted-foreground">
              Currently being addressed
            </p>
          </CardContent>
        </Card>
        <Card className={cn(fadeIn, "delay-400", "shadow-sm hover:shadow transition-shadow")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={displayStats.resolved} />
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Priority distribution and quick access */}
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", slideUp, "delay-300")}>
        <Card className="col-span-2 shadow-sm hover:shadow transition-shadow">
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            {loading || displayStats.totalIssues === 0 ? (
              <div className="flex items-center justify-center h-full">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayStats.priorityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1500}
                    animationBegin={400}
                  >
                    {displayStats.priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} issues`, 'Count']}
                    labelFormatter={(name) => `Priority: ${name}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              View the analytics tab for detailed charts
            </p>
          </CardFooter>
        </Card>
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start" size="sm" onClick={() => document.querySelector('[value="management"]')?.dispatchEvent(new Event('click'))}>
                Pending Review {displayStats.pending > 0 && <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{displayStats.pending}</span>}
              </Button>
              <Button variant="outline" className="justify-start" size="sm" onClick={() => document.querySelector('[value="analytics"]')?.dispatchEvent(new Event('click'))}>
                View Analytics
              </Button>
              <Button variant="outline" className="justify-start" size="sm" onClick={() => window.location.reload()}>
                <ArrowUp className="mr-2 h-4 w-4" /> Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 