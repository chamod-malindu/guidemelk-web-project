import Link from "next/link"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 mb-8 rounded-lg border border-gray-100 dark:border-gray-700">
      <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        GuidMeLK
      </Link>
      <div className="space-x-4">
        <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Login
        </Link>
        <Link href="/register" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Register
        </Link>
      </div>
    </nav>
  )
}