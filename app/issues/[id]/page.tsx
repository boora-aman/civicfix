import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getIssueById } from "@/lib/data"
import { formatDate, formatTime, getPriorityColor, getStatusColor } from "@/lib/utils"
import { notFound } from "next/navigation"
import IssueComments from "@/components/issue-comments"
import IssueActions from "@/components/issue-actions"

export default async function IssuePage({ params }: { params: { id: string } }) {
  const id = await Promise.resolve(params.id)
  const issue = await getIssueById(id)

  if (!issue) {
    notFound()
  }

  return (
    <main className="flex-1 container py-6 px-4 md:py-10 md:px-6 mx-auto max-w-screen-2xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/issues">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Issues
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{issue.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getPriorityColor(issue.priority)}>{issue.priority} Priority</Badge>
            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Reported on {formatDate(issue.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{issue.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-8">
        <div className="space-y-6 md:space-y-8">
          {/* Issue images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {issue.images && issue.images.length > 0 ? (
              issue.images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg border aspect-video">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Image ${index + 1} of ${issue.title}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))
            ) : (
              <div className="overflow-hidden rounded-lg border aspect-video">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="No image available"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          {/* Issue description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{issue.description}</p>
          </div>

          {/* User actions */}
          <IssueActions issueId={issue.id} />

          {/* Comments section */}
          <IssueComments issueId={issue.id} />
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Issue details */}
          <div className="bg-muted rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">Issue Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                <dd>{issue.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd>
                  <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
                <dd>
                  <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Reported By</dt>
                <dd>{issue.user?.name || "Anonymous"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Reported On</dt>
                <dd>
                  {formatDate(issue.createdAt)} at {formatTime(issue.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd>
                  {formatDate(issue.updatedAt)} at {formatTime(issue.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Status timeline */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Status Updates</h2>
            {issue.updates && issue.updates.length > 0 ? (
              <ol className="relative border-l border-muted-foreground/20 ml-3 space-y-4 md:space-y-6">
                {issue.updates.map((update, index) => (
                  <li key={index} className="mb-6 md:mb-10 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-background rounded-full -left-3 ring-8 ring-background">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(update.status)}`} />
                    </span>
                    <h3 className="flex flex-wrap items-center mb-1 text-lg font-semibold">
                      {update.status}
                      {index === 0 && (
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                          Latest
                        </span>
                      )}
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                      {formatDate(update.createdAt)} at {formatTime(update.createdAt)}
                    </time>
                    <p className="text-base font-normal text-muted-foreground">{update.note}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted-foreground">No status updates available.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

