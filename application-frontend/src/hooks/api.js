import useSWR from 'swr'
import axios from '@/lib/axios'

export const useApi = (search = null) => {
    const { data: keywords, error, mutate } = useSWR(
        search ? `/api/keywords?search=${search}` : '/api/keywords',
        url =>
            axios
                .get(url)
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error
                }),
    )

    return {
        keywords,
        error,
        mutate,
    }
}
