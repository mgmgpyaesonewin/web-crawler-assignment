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
                setKeywords(text.split(',').map(keyword => keyword.trim()))
            }
            reader.readAsText(file)
        }

        setErrors([])
    }

    useEffect(() => {
        if (keywords.length > 0) {
            axios
                .post('/api/initiate-spider', {
                    url: keywords.join(','),
                })
                .then(() => {
                    setProcessing(true)
                })
                .catch(error => {
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
