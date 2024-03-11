import { useMountEffect } from './useMountEffect'
import { useUnmountEffect } from './useUnmountEffect'
import { useEffect, useRef, useState } from 'react'

export const useDebounce = (initialValue, delay) => {
    const [inputValue, setInputValue] = useState(initialValue)
    const [debouncedValue, setDebouncedValue] = useState(initialValue)
    const mountedRef = useRef(false)
    const timeoutRef = useRef(null)
    const cancelTimer = () => window.clearTimeout(timeoutRef.current)

    useMountEffect(() => {
        mountedRef.current = true
    })

    useUnmountEffect(() => {
        cancelTimer()
    })

    useEffect(() => {
        if (!mountedRef.current) {
            return
        }

        cancelTimer()
        timeoutRef.current = window.setTimeout(() => {
            setDebouncedValue(inputValue)
        }, delay)
    }, [inputValue, delay])

    return [inputValue, debouncedValue, setInputValue]
}
