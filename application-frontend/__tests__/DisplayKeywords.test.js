import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Keywords from '@/components/Keywords'

import * as apiHooks from '@/hooks/api'
import * as debounceHook from '@/hooks/useDebounce'

jest.mock('@/components/KeywordDetail')
jest.mock('@/hooks/api')
jest.mock('@/hooks/useDebounce')

describe('API Data Rendering', () => {
    beforeEach(() => {
        debounceHook.useDebounce.mockReturnValue(['', 'react', jest.fn()])
        apiHooks.useApi.mockReturnValue({
            keywords: [{ id: 1, name: 'React' }, { id: 2, name: 'Angular' }],
        })
    })

    it('should display keywords', async () => {
        render(<Keywords />)
        await waitFor(() => {
            expect(screen.getByText('React')).toBeInTheDocument()
            expect(screen.getByText('Angular')).toBeInTheDocument()
        })
    })

    it('updates data state on keyword button click', async () => {
        render(<Keywords />)
        const button = screen.getByRole('button', {
            name: /react/i,
        })
        fireEvent.click(button)
        await waitFor(() => {
            expect(screen.getByText('React')).toBeInTheDocument()
            expect(screen.getByText('Angular')).toBeInTheDocument()
            expect(button).toHaveClass('bg-blue-700')
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('API Data Not Found', () => {
    beforeEach(() => {
        debounceHook.useDebounce.mockReturnValue(['', 'react', jest.fn()])
        apiHooks.useApi.mockReturnValue({
            keywords: null,
        })
    })

    it('should displays loading text when keywords are null', async () => {
        render(<Keywords />)
        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })
    })

    it('handles empty keyword array', () => {
        jest.mock('@/hooks/api', () => ({
            useApi: () => ({
                keywords: []
            })
        }))
        render(<Keywords />)
        expect(screen.getByText('Please select a keyword to view the details')).toBeInTheDocument();
    });

    afterEach(() => {
        jest.clearAllMocks()
    })
})
