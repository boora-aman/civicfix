import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Report & Track Civic Issues
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Help improve your community by reporting infrastructure problems. From potholes to broken sidewalks, we
                make it easy to notify officials and track progress.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/issues/new">Report an Issue</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/issues">Browse Issues</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl md:h-[400px] lg:h-[500px]">
              <img
                alt="Community members reporting issues"
                className="object-cover w-full h-full"
                src="/placeholder.svg?height=500&width=600"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

