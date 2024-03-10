'use client'
import { Badge, FileInput, Label } from 'flowbite-react'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

const CsvFileInput = () => {
    const [keywords, setKeywords] = useState([])
    const [processing, setProcessing] = useState(false)

    const handleFileChange = e => {
        const file = e.target.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onload = e => {
                const text = e.target.result
                // Split the text into an array of strings
                setKeywords(text.split(','))
            }
            reader.readAsText(file)
        }
    }

    useEffect(() => {
        if (keywords.length > 0) {
            axios
                .post('/api/initiate-spider', {
                    url: keywords.join(','),
                })
                .then(response => {
                    setProcessing(true)
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }, [keywords])

    return (
        <>
            <div className="mb-2 block">
                <Label htmlFor="file-upload" value="Upload CSV file" />
            </div>
            <FileInput
                id="file-upload"
                accept=".csv"
                onChange={handleFileChange}
            />
            {keywords.length > 0 && processing && (
                <div className="mt-4">
                    <p className="text-sm font-semibold">
                        These keywords are queued for processing. You can find
                        them in dashboard after processed.
                    </p>
                </div>
            )}
            <div className="flex flex-wrap gap-2 my-4">
                {keywords.map((item, index) => (
                    <Badge color="info" key={index}>
                        {item}
                    </Badge>
                ))}
            </div>
        </>
    )
}

export default CsvFileInput
