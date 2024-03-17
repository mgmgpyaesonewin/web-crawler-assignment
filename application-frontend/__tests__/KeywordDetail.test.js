import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import KeywordDetail from '@/components/KeywordDetail'

jest.mock('@/hooks/api', () => ({
    useApi: () => ({
        keywords: null,
        getKeywordById: jest.fn().mockResolvedValue({
            total_result: 10,
            ads_count: 2,
            links_count: 8,
            page_content: '<div>Testing Page Content</div>',
            contents: [
                {
                    htmlRaw: '<p>Test Link Style Content</p>',
                    title: 'Test Title',
                    link: 'http://example.com',
                },
            ],
        }),
        error: null,
        mutate: jest.fn(),
    }),
}))

describe('KeywordDetail Component', () => {
    it('renders correctly with an ID', async () => {
        const id = 1
        render(<KeywordDetail id={id} />)

        await waitFor(() => {
            const totalResult = screen.getByText(/Total Result: 10/)
            expect(totalResult).toBeInTheDocument()
        })
    })

    it('displays "No Data Found" when no ID is provided', () => {
        render(<KeywordDetail />)

        expect(screen.getByText('No Data Found...')).toBeInTheDocument()
    })

    it('toggles between Cached Content and Parsed Content', async () => {
        const id = 1;
        render(<KeywordDetail id={id} />)

        const cachedButton = await screen.findByText(/Cached Content/)
        fireEvent.click(cachedButton)

        // Wait for the expected content to appear after the click
        await waitFor(() => {
            expect(screen.getByText('Testing Page Content')).toBeInTheDocument()
        })
    })

    it('displays the correct data from the API', async () => {
        const id = 1;
        render(<KeywordDetail id={id} />)

        await waitFor(() => {
            expect(screen.getByText('Sponsored Count: 2')).toBeInTheDocument()
            expect(screen.getByText('Links Count: 8')).toBeInTheDocument()
        })
    })
})
