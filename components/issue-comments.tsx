"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatTime } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

export default function IssueComments({ issueId }: { issueId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchComments() {
      setLoading(true)
      try {
        const response = await fetch(`/api/issues/${issueId}/comments`)
        if (response.ok) {
          const data = await response.json()
          setComments(data)
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [issueId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user) {
      router.push(`/login?callbackUrl=/issues/${issueId}`)
      return
    }

    if (!commentText.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/issues/${issueId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments((prev) => [newComment, ...prev])
        setCommentText("")

        toast({
          title: "Comment added",
          description: "Your comment has been added successfully.",
        })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "There was a problem adding your comment.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate user initials for avatar fallback
  const getUserInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div id="comments-section" className="space-y-6">
      <h2 className="text-xl font-semibold">Comments</h2>

      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder={session ? "Add a comment..." : "Please log in to comment"}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!session || isSubmitting}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!session || isSubmitting || !commentText.trim()}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted animate-pulse rounded w-40" />
                  <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.user.image || ""} alt={comment.user.name || "User"} />
                <AvatarFallback>{getUserInitials(comment.user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{comment.user.name || "Anonymous"}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)} at {formatTime(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}

