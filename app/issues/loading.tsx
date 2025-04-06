import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <main className="flex-1 container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="h-8 bg-muted animate-pulse rounded w-64 mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-80" />
        </div>
        <div className="h-9 bg-muted animate-pulse rounded w-36" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        {/* Filters sidebar skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="h-5 bg-muted animate-pulse rounded w-24 mb-2" />
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </div>
          ))}
          <div className="h-9 bg-muted animate-pulse rounded w-full mt-4" />
        </div>

        {/* Issues grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted animate-pulse" />
              <CardHeader className="p-4">
                <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
                <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-9 bg-muted animate-pulse rounded w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

