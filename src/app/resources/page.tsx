export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-light tracking-widest mb-6">Resources</h1>
      <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
        <p>If you are experiencing distress, support is available:</p>
        <ul className="list-disc list-inside space-y-2 text-zinc-400">
          <li><span className="text-white">988 Suicide & Crisis Lifeline</span> — Call or text 988</li>
          <li><span className="text-white">Crisis Text Line</span> — Text HOME to 741741</li>
          <li><span className="text-white">Samaritans</span> — Call 116 123 (UK)</li>
          <li><span className="text-white">Lifeline</span> — Call 13 11 14 (Australia)</li>
        </ul>
        <p className="text-zinc-500 text-xs mt-8 pt-4 border-t border-zinc-800/50">
          These resources are provided for informational purposes.
        </p>
      </div>
    </main>
  )
}
