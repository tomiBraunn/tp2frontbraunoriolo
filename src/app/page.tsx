import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-4xl font-bold text-indigo-600 mb-4">Encuestas Serverless</h1>
      <p className="text-gray-500 text-lg mb-8 text-center max-w-md">
        Creá encuestas, votá y mirá los resultados en tiempo real.
        Construido con Next.js + Supabase + Vercel.
      </p>
      <div className="flex gap-4">
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
        >
          Registrarse
        </Link>
        <Link
          href="/login"
          className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50"
        >
          Iniciar sesión
        </Link>
      </div>
      <Link href="/polls" className="mt-6 text-sm text-gray-400 hover:text-gray-600">
        Ver encuestas públicas
      </Link>
    </div>
  )
}
