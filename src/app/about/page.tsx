export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-light tracking-widest mb-6">About Horizon</h1>
      <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
        <p>
          Horizon is a decision-theory explorer—an interactive visualization of how projected
          outcomes influence directional choices.
        </p>
        <p>
          The tool models three core dimensions: projected satisfaction, projected difficulty,
          and projected purpose. Each dimension is weighted by confidence, and a visibility
          horizon introduces uncertainty cones that pull the verdict toward equilibrium when
          foresight is limited.
        </p>
        <p>
          The project explores existentialist philosophy and the mathematics of persistence.
          It draws on ideas from logotherapy, epistemic humility, and decision theory.
        </p>
        <p className="text-zinc-500 text-xs mt-8 pt-4 border-t border-zinc-800/50">
          This is a philosophical thought experiment. It is not a clinical tool.
        </p>
      </div>
    </main>
  )
}
