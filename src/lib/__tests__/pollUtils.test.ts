import { describe, it, expect } from 'vitest'
import { parseOptions, validatePollInput, getUsername } from '@/lib/pollUtils'

describe('parseOptions', () => {
  it('splits comma-separated options into trimmed strings', () => {
    const result = parseOptions('Option A, Option B, Option C')
    expect(result).toEqual(['Option A', 'Option B', 'Option C'])
  })

  it('trims whitespace from each option', () => {
    const result = parseOptions('  Option A , Option B  ,Option C')
    expect(result).toEqual(['Option A', 'Option B', 'Option C'])
  })

  it('filters out empty entries from trailing commas', () => {
    const result = parseOptions('A,B,')
    expect(result).toEqual(['A', 'B'])
  })

  it('filters out whitespace-only entries', () => {
    const result = parseOptions('A,   ,B')
    expect(result).toEqual(['A', 'B'])
  })

  it('returns empty array for empty string', () => {
    const result = parseOptions('')
    expect(result).toEqual([])
  })
})

describe('validatePollInput', () => {
  it('returns null for valid inputs with 2 options', () => {
    const error = validatePollInput('My Poll', 'A, B')
    expect(error).toBeNull()
  })

  it('returns null for valid inputs with many options', () => {
    const error = validatePollInput('Title', 'A, B, C, D')
    expect(error).toBeNull()
  })

  it('returns error when title is empty', () => {
    const error = validatePollInput('', 'A, B')
    expect(error).toBe('Title and options are required')
  })

  it('returns error when optionsRaw is empty', () => {
    const error = validatePollInput('My Poll', '')
    expect(error).toBe('Title and options are required')
  })

  it('returns error when only 1 option is provided', () => {
    const error = validatePollInput('My Poll', 'A')
    expect(error).toBe('At least 2 options are required')
  })

  it('returns error when title and options are both empty', () => {
    const error = validatePollInput('', '')
    expect(error).toBe('Title and options are required')
  })
})

describe('getUsername', () => {
  it('returns the part before @ from an email', () => {
    const username = getUsername('tomas@example.com')
    expect(username).toBe('tomas')
  })

  it('prefers metadataUsername when provided', () => {
    const username = getUsername('tomas@example.com', 'Tommy')
    expect(username).toBe('Tommy')
  })

  it('returns "user" when email is undefined and no metadata', () => {
    const username = getUsername(undefined)
    expect(username).toBe('user')
  })

  it('returns metadataUsername even without email', () => {
    const username = getUsername(undefined, 'Geraldine')
    expect(username).toBe('Geraldine')
  })
})
