import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-[90vh] flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <p className="font-[family-name:var(--font-mono)] text-xs text-paper-muted tracking-widest uppercase mb-6">
            Resultados en tiempo real
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-bold text-paper-text mb-4 tracking-tight">
            Tinta<span className="text-paper-secondary">.</span>
          </h1>
          <p className="text-base text-paper-muted mb-10 max-w-lg mx-auto leading-relaxed">
            Creá encuestas, compartí el link y mirá los resultados
            actualizarse en vivo. Sin registro para votar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-paper-primary text-paper-surface px-7 py-3 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Empezar gratis
            </Link>
            <Link
              href="/polls"
              className="border border-paper-border text-paper-text px-7 py-3 text-sm font-medium hover:bg-paper-surface transition-colors"
            >
              Ver encuestas públicas
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-paper-border">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { title: "Fácil de crear", desc: "En segundos creás tu encuesta con las opciones que quieras", num: "01" },
            { title: "Voto anónimo", desc: "Cualquiera puede votar sin registro, solo con el link", num: "02" },
            { title: "Resultados en vivo", desc: "Los gráficos se actualizan automáticamente al recibir votos", num: "03" },
          ].map((f) => (
            <article key={f.title} className="border border-paper-border p-6 bg-paper-surface">
              <p className="font-[family-name:var(--font-mono)] text-xs text-paper-muted mb-2">{f.num}</p>
              <h3 className="font-[family-name:var(--font-display)] font-semibold text-paper-text mb-1">{f.title}</h3>
              <p className="text-sm text-paper-muted leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
