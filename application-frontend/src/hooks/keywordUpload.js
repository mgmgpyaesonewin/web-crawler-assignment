import { useState } from 'react'
import { useEffect } from 'react'
import axios from '@/lib/axios'

export const useKeywordUpload = () => {
    const [keywords, setKeywords] = useState([])
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState([])

    const handleFileChange = e => {
        const file = e.target.files[0]

        if (file.type !== 'text/csv') {
            setErrors(['Only CSV files are allowed'])
            return
        }

        if (file) {
            const reader = new FileReader()
            reader.onload = e => {
                const text = e.target.result
                const words = text
                    .split(',')
                    .map(keyword => keyword.trim())
                    .filter(keyword => keyword !== '')

                if (words.length < 1) {
                    setErrors(['At least one keyword is required'])
                    return
                }
                if (words.length > 100) {
                    setErrors(['Only 100 keywords are allowed'])
                    return
                }
                setKeywords(words)
            }
            reader.onerror = () => setErrors([...errors, 'Error reading file'])
            reader.readAsText(file)
        }

        setErrors([])
    }

    useEffect(() => {
        if (keywords.length > 0) {
            axios
                .post('/api/spider', {
                    url: keywords.join(','),
                })
                .then(() => {
                    setProcessing(true)
                })
                .catch(error => {
                    setErrors([...errors, 'Error initiating spider operation'])
                    // eslint-disable-next-line no-console
                    console.error(error)
                })
        }
    }, [keywords])

    return {
        keywords,
        processing,
        setProcessing,
        errors,
        handleFileChange,
    }
}
