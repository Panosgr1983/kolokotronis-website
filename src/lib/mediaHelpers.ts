
export interface DeleteResult {
  success: boolean
  inUse?: boolean
  usages?: string[]
  error?: string
}

export async function safeDeleteMedia(id: string, fileName: string): Promise<DeleteResult> {
  // Check usages first
  const usages = await getUsages(id)
  if (usages.length > 0) {
    return { success: false, inUse: true, usages: usages.map(u => `${u.entity_type}${u.entity_slug ? ': ' + u.entity_slug : ''}`) }
  }

  // Delete storage object via Vercel API proxy
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return { success: false, error: 'Not authenticated' }

    const res = await fetch('/api/delete-storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ bucket: 'kareli-images', files: [fileName] })
    })

    if (!res.ok) {
      const err = await res.json()
      if (res.status === 409) return { success: false, inUse: true, usages: err.usages }
      return { success: false, error: err.error || 'Storage delete failed' }
    }

    // Delete DB record
    await deleteMediaRecord(id)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
