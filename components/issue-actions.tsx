"use client"

import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, Flag } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function IssueActions({ issueId }: { issueId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [upvotes, setUpvotes] = useState(0)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [isUpvoting, setIsUpvoting] = useState(false)

  // Fetch upvote status on component mount
  useState(() => {
    async function fetchUpvoteStatus() {
      if (!session?.user) return

      try {
        const response = await fetch(`/api/issues/${issueId}/upvotes`)
        if (response.ok) {
          const data = await response.json()
          setUpvotes(data.count)
          setHasUpvoted(data.hasUpvoted)
        }
      } catch (error) {
        console.error("Error fetching upvote status:", error)
      }
    }

    fetchUpvoteStatus()
  })

  const handleUpvote = async () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/issues/${issueId}`)
      return
    }

    setIsUpvoting(true)

    try {
      const response = await fetch(`/api/issues/${issueId}/upvotes`, {
        method: hasUpvoted ? "DELETE" : "POST",
      })

      if (response.ok) {
        setHasUpvoted(!hasUpvoted)
        setUpvotes((prev) => (hasUpvoted ? prev - 1 : prev + 1))

        toast({
          title: hasUpvoted ? "Upvote removed" : "Issue upvoted",
          description: hasUpvoted ? "You have removed your upvote from this issue." : "You have upvoted this issue.",
        })
      }
    } catch (error) {
      console.error("Error upvoting issue:", error)
      toast({
        title: "Error",
        description: "There was a problem processing your request.",
        variant: "destructive",
      })
    } finally {
      setIsUpvoting(false)
    }
  }

  const scrollToComments = () => {
    document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })
  }

  const reportIssue = () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/issues/${issueId}`)
      return
    }

    toast({
      title: "Report submitted",
      description: "Thank you for reporting this issue. Our team will review it.",
    })
  }

  return (
    <div className="flex gap-2">
      <Button variant={hasUpvoted ? "default" : "outline"} size="sm" onClick={handleUpvote} disabled={isUpvoting}>
        <ThumbsUp className="mr-2 h-4 w-4" />
        {hasUpvoted ? "Upvoted" : "Upvote"} ({upvotes})
      </Button>
      <Button variant="outline" size="sm" onClick={scrollToComments}>
        <MessageSquare className="mr-2 h-4 w-4" /> Comments
      </Button>
      <Button variant="outline" size="sm" onClick={reportIssue}>
        <Flag className="mr-2 h-4 w-4" /> Report Issue
      </Button>
    </div>
  )
}

