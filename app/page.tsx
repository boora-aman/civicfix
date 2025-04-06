import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FeaturedIssues from "@/components/featured-issues"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="container py-12 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            CivicFix makes it easy to report and track infrastructure issues in your community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Report an Issue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Submit details about infrastructure problems in your area, including photos and location.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Follow the status of your reports and see when they're reviewed and fixed.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join others in improving your neighborhood by highlighting issues that need attention.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Featured Issues</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Recently reported and high-priority issues in your community
            </p>
          </div>

          <FeaturedIssues />

          <div className="flex justify-center mt-8">
            <Button asChild size="lg">
              <Link href="/issues">View All Issues</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

