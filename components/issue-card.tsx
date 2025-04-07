import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
}

const priorityColors = {
  URGENT: "bg-red-100 text-red-800",
  HIGH: "bg-orange-100 text-orange-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  LOW: "bg-green-100 text-green-800",
}

interface IssueCardProps {
  issue: {
    id: string
    title: string
    description: string
    status: keyof typeof statusColors
    priority: keyof typeof priorityColors
    category: string
    createdAt: string
    _count: {
      upvotes: number
      comments: number
    }
    user: {
      name: string
    }
  }
}

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="line-clamp-2">{issue.title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className={cn(statusColors[issue.status])}>
                {issue.status.replace(/_/g, " ")}
              </Badge>
              <Badge variant="secondary" className={cn(priorityColors[issue.priority])}>
                {issue.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {issue.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Posted by {issue.user.name}
              </span>
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ThumbsUp className="h-4 w-4" />
                <span>{issue._count.upvotes}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{issue._count.comments}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 