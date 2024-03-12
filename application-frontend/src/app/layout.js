import { Flowbite, ThemeModeScript } from 'flowbite-react'
import '@/app/global.css'

export const metadata = {
    title: 'Laravel',
}
const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <title title={metadata.title} />
                <ThemeModeScript />
            </head>
            <body className="antialiased">
                <Flowbite>{children}</Flowbite>
            </body>
        </html>
    )
}

export default RootLayout
