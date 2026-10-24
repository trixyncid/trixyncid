/**
 * Single fixed viewport background: the base color and one soft brand wash.
 * Keeps the ambient consistent on every page and visible through the header.
 */
export function PageAmbientGlow() {
  return (
    <div
      aria-hidden
      className="page-ambient-glow pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-ambient-wash" />
    </div>
  );
}
