import { useEffect, useState } from 'react'
import { Icon } from './Icon'

/** Prosty toast: `const [toast, showToast] = useToast()` + `{toast}` w JSX. */
export function useToast(): [React.ReactNode, (msg: string) => void] {
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 3800)
    return () => clearTimeout(t)
  }, [msg])

  const node = msg ? (
    <div className="toast" role="status">
      <Icon name="checkCircle" size={18} />
      {msg}
    </div>
  ) : null

  return [node, setMsg]
}
