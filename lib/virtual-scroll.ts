export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function useVirtualScroll<T>(items: T[], options: VirtualScrollOptions) {
  const { itemHeight, containerHeight, overscan = 5 } = options

  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const totalHeight = items.length * itemHeight

  const getVisibleRange = (scrollTop: number) => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(start + visibleCount + overscan, items.length)

    return {
      start: Math.max(0, start - overscan),
      end,
      offsetY: Math.max(0, start - overscan) * itemHeight,
    }
  }

  const getVisibleItems = (scrollTop: number) => {
    const { start, end, offsetY } = getVisibleRange(scrollTop)

    return {
      items: items.slice(start, end),
      startIndex: start,
      offsetY,
      totalHeight,
    }
  }

  return {
    getVisibleItems,
    totalHeight,
    itemHeight,
  }
}
