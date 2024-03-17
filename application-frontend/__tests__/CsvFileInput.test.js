import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CsvFileInput from './../src/components/CsvFileInput'

describe('CsvFileInput', () => {
    test('renders file input and label', () => {
        render(<CsvFileInput />)
        const fileInput = screen.getByLabelText('Upload CSV file')
        expect(fileInput).toBeInTheDocument()
    })

    test('should display error message if file type is not csv', () => {
        render(<CsvFileInput />)
        const fileInput = screen.getByLabelText('Upload CSV file')
        fireEvent.change(fileInput, {
            target: {
                files: [
                    new File(['(⌐□_□)'], 'chucknorris.png', {
                        type: 'image/png',
                    }),
                ],
            },
        })

        const errorMessage = screen.getByText('Only CSV files are allowed')
        expect(errorMessage).toBeInTheDocument()
    })

    test('should display error message if keyword count is more than 100', async () => {
        render(<CsvFileInput />)
        const fileInput = screen.getByLabelText('Upload CSV file')

        const keywords = Array.from({ length: 105 }, (_, i) => `keyword${i}`)
        const file = new File([keywords], 'keywords.csv', { type: 'text/csv' })

        fireEvent.change(fileInput, { target: { files: [file] } })

        await waitFor(async () => {
            const errorMessage = screen.getByText('Only 100 keywords are allowed')
            expect(errorMessage).toBeInTheDocument()
        })
    })
})
