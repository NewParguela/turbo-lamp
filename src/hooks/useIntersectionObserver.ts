import { useCallback, useEffect, useRef } from "react";
import type { RefCallback } from "react";

type TUseIntersectionObserverOptions = Omit<IntersectionObserverInit, "root"> & {
  onChange: IntersectionObserverCallback
}

export function useIntersectionObserver({ onChange, ...options }: TUseIntersectionObserverOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const rootRef = useRef<HTMLElement | null>(null)
  const mountedArr = useRef<Map<string, Element>>(new Map())

  const onChangeRef = useRef<IntersectionObserverCallback>(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Crea / recrea el observer cuando haya root o cambien opciones
  const createObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (!rootRef.current) return

    observerRef.current = new IntersectionObserver(
      (p1, p2) => {
        onChangeRef.current(p1, p2)
      },
      {
        ...options,
        root: rootRef.current
      }
    )

    return observerRef.current
  }, [options.threshold, options.rootMargin]) // añade props que uses

  // Ref del contenedor (root)
  const wrapperRef: React.RefCallback<HTMLElement> = useCallback(
    node => {
      // node puede ser null al desmontar
      rootRef.current = node ?? null

      if (!node) {
        observerRef.current?.disconnect()
        observerRef.current = null
        return
      }

      // nuevo root => nuevo observer
      const obs = createObserver()
      if (obs) {
        mountedArr.current.forEach((el, id) => {
          obs.observe(el)
        })
      }
    },
    [createObserver]
  )

  const childRef: (id: string) => RefCallback<HTMLElement> = useCallback(
    id => node => {
      if (node) {
        if (observerRef.current) {
          observerRef.current.observe(node)
        }

        mountedArr.current.set(id, node)
      } else {
        const el = mountedArr.current.get(id)

        if (el) {
          mountedArr.current.delete(id)
          observerRef.current?.unobserve(el)
        }
      }
    },
    []
  )

  // Cleanup al desmontar
  useEffect(() => () => observerRef.current?.disconnect(), [])

  return { wrapperRef, childRef }
}
