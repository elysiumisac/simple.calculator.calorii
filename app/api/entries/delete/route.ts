import { NextResponse } from 'next/server'
import { deleteTodayEntries } from '../../../../lib/supabase'

export async function DELETE() {
  try {
    await deleteTodayEntries()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting entries:', error)
    return NextResponse.json(
      { error: 'Failed to delete entries' },
      { status: 500 }
    )
  }
}
