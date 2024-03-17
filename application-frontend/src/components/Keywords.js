'use client'

import { useEffect, useState } from 'react'
import { useApi } from '@/hooks/api'
import { Button, Label, TextInput } from 'flowbite-react'
import { useDebounce } from '@/hooks/useDebounce'
import KeywordDetail from '@/components/KeywordDetail'

const Keywords = () => {
    const [search, debouncedSearch, setSearch] = useDebounce('', 400)

    const { keywords } = useApi(debouncedSearch)
    const [data, setData] = useState({
        id: 0,
        name: '',
    })

    useEffect(() => {
        if (keywords) {
            setData(keywords[0])
        }
    }, [keywords])

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="flex w-full justify-end mb-4">
                <div className="max-w-md w-full">
                    <div className="mb-2 block">
                        <Label htmlFor="search" value="Type to search" />
                    </div>
                    <TextInput
                        id="search"
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Enter the keywords to search"
                        required
                    />
                </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h1 className="text-2xl font-bold mb-4">Keywords</h1>
                    {keywords ? (
                        <div className="flex flex-wrap gap-2">
                            {keywords.map(keyword => (
                                <Button
                                    color={
                                        data?.id === keyword?.id
                                            ? 'blue'
                                            : 'gray'
                                    }
                                    pill
                                    size="xs"
                                    key={keyword.id}
                                    onClick={() => setData(keyword)}>
                                    {keyword.name}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
            {data?.id === 0 && (
                <div className="p-6 bg-white border-b border-gray-200">
                    <p className="text-2xl font-bold mb-4">
                        Please select a keyword to view the details
                    </p>
                </div>
            )}
            {data?.id !== 0 && <KeywordDetail id={data?.id} />}
        </div>
    )
}

export default Keywords
