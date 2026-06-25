"use client";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 px-6 py-10 text-center max-w-3xl mx-auto w-full relative z-10">
      <p className="text-xs text-zinc-600">
        Horizon · A decision-theory explorer. All figures are
        in-world mechanics.
      </p>
      <p className="mt-2 text-[0.65rem] text-zinc-700">
        Head sculpture: Lee Perry-Smith (Infinite-Realities) · CC BY 3.0.
      </p>
      <div className="text-xs text-zinc-700 border-t border-zinc-800/50 pt-4 mt-8">
        <p>Horizon · A decision-theory explorer · Design fiction</p>
        <p className="text-zinc-600 mt-1">
          This is a philosophical thought experiment. It is not a clinical tool.
          <span className="text-zinc-500 mx-2">·</span>
          <a href="/about" className="text-zinc-500 hover:text-zinc-400">About</a>
          <span className="text-zinc-500 mx-2">·</span>
          <a href="/resources" className="text-zinc-500 hover:text-zinc-400">Resources</a>
        </p>
      </div>
    </footer>
  );
}
