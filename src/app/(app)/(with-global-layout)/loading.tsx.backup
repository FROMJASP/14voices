export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="hero bg-background px-6 py-10">
        <div className="hero-container max-w-[1280px] mx-auto px-4 lg:px-[60px] py-8 lg:py-[60px]">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-[60px] items-center">
            {/* Left Content Skeleton */}
            <div className="space-y-6">
              {/* Process Steps Skeleton */}
              <div className="flex flex-wrap items-center gap-4 skeleton-pulse">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-4 bg-muted rounded w-20" />
                    {index < 2 && <span className="text-muted">→</span>}
                  </div>
                ))}
              </div>

              {/* Title Skeleton - 3 lines like actual hero */}
              <div className="space-y-3 skeleton-pulse">
                <div className="h-12 bg-muted rounded w-3/4" />
                <div className="h-12 bg-muted rounded w-3/4" />
                <div className="h-12 bg-muted rounded w-2/3" />
              </div>

              {/* Description Skeleton */}
              <div className="skeleton-pulse">
                <div className="h-6 bg-muted rounded w-full max-w-[440px]" />
              </div>

              {/* CTA Buttons Skeleton */}
              <div className="flex flex-row gap-3 skeleton-pulse">
                <div className="h-11 bg-muted rounded-[10px] w-36" />
                <div className="h-11 bg-muted rounded-[10px] w-36 border border-border" />
              </div>

              {/* Stats Skeleton */}
              <div className="flex flex-row gap-8 mt-8 skeleton-pulse">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-7 bg-muted rounded w-16" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Image Skeleton (Hidden on mobile/tablet) */}
            <div className="hidden xl:block skeleton-pulse">
              <div
                className="relative mx-auto lg:ml-auto max-w-[420px] aspect-[4/5] bg-muted border-2 border-border"
                style={{
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Voiceover Grid Section Skeleton */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header Skeleton */}
          <div className="mb-8 skeleton-pulse">
            <div className="h-10 bg-muted rounded w-64 mb-4" />
            <div className="h-6 bg-muted rounded w-96" />
          </div>

          {/* Filter Controls Skeleton */}
          <div className="flex items-center justify-between mb-6 skeleton-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 bg-muted rounded-lg w-24" />
              <div className="hidden md:block h-10 bg-muted rounded-lg w-20" />
            </div>
            <div className="h-5 bg-muted rounded w-24" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="group">
                {/* Card with optimized aspect ratio */}
                <div className="custom-card-wrapper">
                  <div className="custom-card skeleton-pulse">
                    <div className="relative aspect-[3/4] bg-muted" />
                  </div>
                </div>
                {/* Name and tags below card */}
                <div className="mt-3 px-1 space-y-2 skeleton-pulse">
                  <div className="h-5 bg-muted rounded w-20" />
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 bg-muted rounded w-16" />
                    <span className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
