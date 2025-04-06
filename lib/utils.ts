import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format date
export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Helper function to format time
export function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Helper function to get priority color
export function getPriorityColor(priority: string) {
  switch (priority?.toLowerCase()) {
    case "low":
      return "bg-green-100 text-green-800"
    case "medium":
      return "bg-blue-100 text-blue-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "urgent":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Helper function to get status color
export function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "approved":
      return "bg-blue-100 text-blue-800"
    case "in progress":
      return "bg-purple-100 text-purple-800"
    case "resolved":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

