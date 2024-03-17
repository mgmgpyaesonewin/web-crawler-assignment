import useSWR from 'swr'
import axios from '@/lib/axios'

export const useApi = (search = null) => {
    const { data: keywords, error, mutate } = useSWR(
        search ? `/api/keywords?search=${search}` : '/api/keywords',
        url =>
            axios
                .get(url)
                .then(res => res.data?.keywords)
                .catch(error => {
                    if (error.response.status !== 409) throw error
                }),
    )

    const getKeywordById = async id => {
        try {
            const response = await axios.get(`/api/keywords/${id}`)
            return response.data
        } catch (error) {
            if (error.response?.status !== 409) throw error
            return null // or handle the error as needed
        }
    }

    return {
        keywords,
        getKeywordById,
        error,
        mutate,
    }
}
