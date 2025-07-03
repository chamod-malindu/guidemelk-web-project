import Link from "next/link"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white shadow mb-8 rounded-lg">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        GuidMeLK
      </Link>
      <div className="space-x-4">
        <Link href="/login" className="text-gray-600 hover:text-blue-600">
          Login
        </Link>
        <Link href="/register" className="text-gray-600 hover:text-blue-600">
          Register
        </Link>
      </div>
    </nav>
  )
}
