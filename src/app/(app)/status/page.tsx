import Link from 'next/link'

export default function StatusPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Status</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">✅ Completed Features</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Internationalization (i18n) - Dutch/English support</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Dutch landing page with animated hero section</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Dynamic voiceover showcase component</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Payload CMS localization</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Admin panel translations (Dutch/English)</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Driver.js tours in Dutch</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Sample voiceover data seeded</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔗 Quick Links</h2>
            <div className="space-y-2">
              <Link href="/" className="block text-blue-600 hover:underline">
                → Homepage (Dutch Landing Page)
              </Link>
              <Link href="/admin" className="block text-blue-600 hover:underline">
                → Admin Panel (with Tours)
              </Link>
              <Link href="/api/voiceovers" className="block text-blue-600 hover:underline">
                → Voiceovers API
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📝 Admin Credentials</h2>
            <p className="text-gray-600">
              Email: admin@14voices.com<br />
              Password: ChangeThisPassword123!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}