import '../styles/globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}