

export default function PharmacyHero() {
  return (
    <section className="overflow-hidden bg-[#F7FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">

          {/* Left: text content */}
          <div>
            {/* Eyebrow tags */}
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#002D6D]/10 px-3 py-1 text-xs font-semibold text-[#002D6D]">
                Medical
              </span>

              <span className="rounded-full bg-[#08781F]/10 px-3 py-1 text-xs font-semibold text-[#08781F]">
                Medicine
              </span>

              <span className="rounded-full bg-[#34CBFD]/15 px-3 py-1 text-xs font-semibold text-[#0077A8]">
                Testing
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold leading-tight text-[#002D6D] sm:text-5xl lg:text-6xl">
              Pure Medicine
              <br />
              <span className="text-[#08781F]">
                with Fair Price
              </span>
            </h1>

            {/* Body copy */}
            <p className="mt-5 max-w-md leading-relaxed text-slate-500">
              Trusted medicines, healthcare products, and professional
              pharmacy services — all at fair and affordable prices.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center rounded-lg bg-[#002D6D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#001F4D]">
                Buy Now
              </button>

              <button className="inline-flex items-center rounded-lg border border-[#08781F] px-6 py-3 text-sm font-semibold text-[#08781F] transition-colors hover:bg-[#08781F] hover:text-white">
                Learn More
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#08781F] text-xs text-white">
                  ✓
                </span>
                Genuine Medicines
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#08781F] text-xs text-white">
                  ✓
                </span>
                Fair Prices
              </div>
            </div>
          </div>

          {/* Right: image with decorative dot grids */}
          <div className="flex justify-center md:justify-end">
            {/* Inner wrapper sized to the image, NOT full width — this is what
                the absolutely-positioned dot grids anchor to, so they sit
                exactly at its corners instead of the wider flex container */}
            <div className="relative inline-block">
              {/* Top-right dot grid — sits above/right of the image corner */}
              <div className="absolute -top-6 -right-6 z-0 grid grid-cols-5 gap-1.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="h-1 w-1 rounded-full bg-teal-500/70" />
                ))}
              </div>

              {/* Bottom-left dot grid — sits below/left of the image corner */}
              <div className="absolute -bottom-6 -left-6 z-0 grid grid-cols-5 gap-1.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="h-1 w-1 rounded-full bg-teal-500/70" />
                ))}
              </div>

              {/* Image */}
              <div className="relative z-10 w-80 sm:w-96 overflow-hidden rounded-lg shadow-lg">
                {/* Replace src with your own pharmacist image */}
                <img
                  src="/images/pharmacy.jpg"
                  alt="Pharmacist standing in a pharmacy"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}