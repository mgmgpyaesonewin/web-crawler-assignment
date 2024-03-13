'use client'
import { Badge, FileInput, Label } from 'flowbite-react'
import { useKeywordUpload } from '@/hooks/keywordUpload'

const CsvFileInput = () => {
    const {
        keywords,
        processing,
        errors,
        handleFileChange,
    } = useKeywordUpload()
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
            {errors.length > 0 &&
                errors.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm">
                        {error}
                    </p>
                ))}
            {errors.length === 0 && keywords.length > 0 && processing && (
                <>
                    <div className="mt-4">
                        <p className="text-sm font-semibold">
                            These keywords are queued for processing. You can
                            them in dashboard after processed.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 my-4">
                        {keywords.map((item, index) => (
                            <Badge color="info" key={index}>
                                {item}
                            </Badge>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default CsvFileInput
