import Header from '@/app/(app)/Header'
import Keywords from '@/components/Keywords'

export const metadata = {
    title: 'Laravel - Dashboard',
}

const Dashboard = async () => {
    return (
        <>
            <Header title="Dashboard" />
            <div className="py-12 px-4 sm:px-0">
                <Keywords />
            </div>
        </>
    )
}

export default Dashboard
