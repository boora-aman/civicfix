import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About CivicFix",
  description: "Learn about the CivicFix platform and our mission to improve communities",
}

export default function AboutPage() {
  return (
    <main className="flex-1 container py-6 px-4 md:py-10 md:px-6 mx-auto max-w-screen-2xl">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">About CivicFix</h1>
          <p className="text-muted-foreground">
            Our mission is to empower communities through transparent infrastructure reporting
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p>
            CivicFix was founded with a simple but powerful idea: to give citizens a voice in improving their communities. 
            We believe that by creating a transparent and accessible platform for reporting infrastructure issues, 
            we can help bridge the gap between residents and local authorities.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <div className="space-y-3">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Report Issues</h3>
              <p className="text-muted-foreground">
                Residents can easily report problems they encounter in their neighborhoods, from potholes to broken 
                streetlights, providing details and images to help authorities understand the issue.
              </p>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Community Verification</h3>
              <p className="text-muted-foreground">
                Other community members can verify issues, add comments, and upvote problems that they also consider important,
                helping to prioritize the most pressing concerns.
              </p>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Official Response</h3>
              <p className="text-muted-foreground">
                Local authorities review and respond to reported issues, providing updates on progress and timeline for repairs.
              </p>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Transparent Tracking</h3>
              <p className="text-muted-foreground">
                All stakeholders can track the status of reported issues from submission to resolution, creating accountability 
                and transparency in the process.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Team</h2>
          <p>
            CivicFix is developed by a dedicated team of civic-minded technologists and urban planners who believe in the 
            power of technology to improve public services and community engagement.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Join Us</h2>
          <p>
            We invite you to join our growing community of active citizens who are making a difference in their 
            neighborhoods. By reporting issues, verifying problems, and supporting the platform, you can help make 
            your community a better place to live.
          </p>
        </div>
      </div>
    </main>
  )
} 