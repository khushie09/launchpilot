import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Query a known-nonexistent table — any PGRST response (not a network error)
    // confirms the URL is reachable and the key is accepted.
    const { error } = await supabase.from('_ping').select('1').limit(1)

    const connected =
      !error ||                          // table exists
      error.code === 'PGRST205' ||       // table not in schema cache
      error.code === '42P01'             // postgres relation does not exist

    if (!connected) throw new Error(error!.message)

    return Response.json({ ok: true, supabase: 'connected' })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
