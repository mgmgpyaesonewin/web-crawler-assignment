import Header from '@/app/(app)/Header'
import CsvFileInput from '@/components/CsvFileInput'

export const metadata = {
    title: 'Laravel - Dashboard',
}

const Upload = () => {
    return (
        <>
            <Header title="Upload Keyword" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mx-2 md:mx-auto lg:mx-auto">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <CsvFileInput />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Upload
