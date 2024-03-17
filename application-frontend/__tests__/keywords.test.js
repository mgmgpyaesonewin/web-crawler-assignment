import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Keywords from '@/components/Keywords'

describe('Keywords Component', () => {
    it('should render correctly', () => {
        render(<Keywords />)

        const searchInput = screen.getByPlaceholderText(
            'Enter the keywords to search',
        )
        expect(searchInput).toBeInTheDocument()
        expect(screen.getByText('Type to search')).toBeInTheDocument()
        expect(screen.getByText('Keywords')).toBeInTheDocument()
    })
    it('updates search state on typing', () => {
        render(<Keywords />)
        const input = screen.getByPlaceholderText('Enter the keywords to search');
        fireEvent.change(input, { target: { value: 'test' } })
        expect(input.value).toBe('test')
    })
})
