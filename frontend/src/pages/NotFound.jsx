import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Ukurasa Haukupatikana</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Samahani, ukurasa unaoutafuta haupo. Labda ulikosea anwani au ukurasa
          umehamishwa.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
        >
          ← Rudi Nyumbani
        </Link>
      </div>
    </div>
  )
}