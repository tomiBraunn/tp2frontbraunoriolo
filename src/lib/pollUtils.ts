export function parseOptions(raw: string): string[] {
  return raw.split(',').map(o => o.trim()).filter(Boolean)
}

export function validatePollInput(title: string, optionsRaw: string): string | null {
  if (!title || !optionsRaw) return 'Title and options are required'
  const options = parseOptions(optionsRaw)
  if (options.length < 2) return 'At least 2 options are required'
  return null
}

export function getUsername(email: string | undefined, metadataUsername?: string): string {
  return metadataUsername || email?.split('@')[0] || 'user'
}
