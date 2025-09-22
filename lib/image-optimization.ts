export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: "webp" | "jpeg" | "png"
}

export function getOptimizedImageUrl(src: string, options: ImageOptimizationOptions = {}): string {
  const { width, height, quality = 80, format = "webp" } = options

  // If it's already a placeholder or external URL, return as-is
  if (src.includes("placeholder.svg") || src.startsWith("http")) {
    return src
  }

  // Build Next.js Image Optimization URL
  const params = new URLSearchParams()
  if (width) params.set("w", width.toString())
  if (height) params.set("h", height.toString())
  params.set("q", quality.toString())

  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

export async function preloadImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map(preloadImage))
}
