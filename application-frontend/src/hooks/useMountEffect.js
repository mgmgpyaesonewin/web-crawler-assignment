import { useEffect, useRef } from 'react'

export const useMountEffect = fn => {
    const mounted = useRef(false)
    return useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            return fn && fn()
        }
    }, [])
}
