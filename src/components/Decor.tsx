/** Odręczna adnotacja z zakrzywioną strzałką — akcent typograficzny. */
export function HandNote({
  children,
  flip = false,
}: {
  children: string
  flip?: boolean
}) {
  return (
    <span className="hand-note">
      {flip && <Squiggle flip />}
      {children}
      {!flip && <Squiggle />}
    </span>
  )
}

function Squiggle({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="46"
      height="26"
      viewBox="0 0 46 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M2 4c10 12 22 16 40 15" />
      <path d="M35 13.5 42 19l-8 4" />
    </svg>
  )
}
