'use client'

import { useEffect, useState } from 'react'
import { useApi } from '@/hooks/api'
import { Button, Label, TextInput } from 'flowbite-react'
import { Card } from 'flowbite-react'

const Keywords = () => {
    const [search, setSearch] = useState(null)
    const { keywords } = useApi(search)
    const [data, setData] = useState({
        id: 0,
        total_result: 0,
        contents: [],
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
            <p className="lg:my-2">Total Result: {data?.total_result}</p>
            {data?.contents?.map((item, index) => (
                <Card
                    href="#"
                    className="max-w-7xl mx-auto my-2 md:my-4 lg:my-4 sm:px-6 lg:px-8"
                    key={index}>
                    <div className="search-result">
                        <div
                            dangerouslySetInnerHTML={{ __html: item.htmlRaw }}
                        />
                    </div>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white search-main-title">
                        {item.title}
                    </h5>
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="search-main-link">
                        {item.link}
                    </a>
                </Card>
            ))}
        </div>
    )
}

export default Keywords
