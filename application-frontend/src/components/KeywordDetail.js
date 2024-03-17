import { useEffect, useState } from 'react'
import { useApi } from '@/hooks/api'
import { Badge, Button, Card } from 'flowbite-react'

const KeywordDetail = ({ id }) => {
    const [data, setData] = useState('')
    const [showContent, setShowContent] = useState(true)
    const { getKeywordById } = useApi()

    useEffect(() => {
        if (id) {
            getKeywordById(id).then(response => {
                setData(response)
            })
        }
    }, [id])

    if (!id) {
        return (
            <div className="my-4">
                <p>No Data Found ...</p>
            </div>
        )
    }
    return (
        <>
            <div className="flex justify-between items-center lg:my-4">
                <div>
                    <p>Total Result: {data?.total_result}</p>
                    <div className="flex gap-2 my-2">
                        <Badge color="indigo">
                            Sponsored Count: {data?.ads_count}
                        </Badge>
                        <Badge color="success">
                            Links Count: {data?.links_count}
                        </Badge>
                    </div>
                </div>
                <Button.Group>
                    <Button
                        color={`${showContent ? 'blue' : 'gray'}`}
                        onClick={() => setShowContent(true)}>
                        Cached Content
                    </Button>
                    <Button
                        color={`${showContent ? 'gray' : 'blue'}`}
                        onClick={() => setShowContent(false)}>
                        Parsed Content
                    </Button>
                </Button.Group>
            </div>
            {showContent && (
                <>
                    <Card className="page-content">
                        <p>Cached Content</p>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: data.page_content,
                            }}
                        />
                    </Card>
                </>
            )}
            {!showContent && (
                <div>
                    {data?.contents?.map((item, index) => (
                        <Card
                            href="#"
                            className="max-w-7xl mx-auto my-2 md:my-4 lg:my-4 sm:px-6 lg:px-8"
                            key={index}>
                            <div className="search-result">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: item.htmlRaw,
                                    }}
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
            )}
        </>
    )
}

export default KeywordDetail
