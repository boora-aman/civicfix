import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Make Your Community Better with CivicFix
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Report infrastructure issues, track their progress, and collaborate with local authorities to improve your neighborhood.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/issues/new">
                    <Button size="lg" className="gap-2">
                      Report an Issue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/issues">
                    <Button variant="outline" size="lg">
                      View Issues
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Community members collaborating"
                  className="rounded-lg object-cover"
                  height="500"
                  src="/hero-image.jpg"
                  style={{
                    aspectRatio: "500/500",
                    objectFit: "cover",
                  }}
                  width="500"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Easy Reporting</h3>
                <p className="text-muted-foreground">
                  Report issues quickly with our simple and intuitive interface.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor the status of reported issues and get updates.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Community Engagement</h3>
                <p className="text-muted-foreground">
                  Collaborate with others and vote on important issues.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

