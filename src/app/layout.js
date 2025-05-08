import "./globals.css";

export const metadata = {
    title: "Almost there",
    icons: {
        icon: "/icons/favicon.ico",
    },
    description: "Project Almost there",

};

export default function RootLayout({ children }) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
