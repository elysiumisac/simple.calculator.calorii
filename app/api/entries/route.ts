import { NextRequest, NextResponse } from 'next/server'
import { saveEntry, getEntries } from '../../../lib/supabase'
import { FoodEntry } from '../../../lib/types'

export async function GET() {
  try {
    const entries = await getEntries()
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as FoodEntry
    
    if (!data.foodName || !data.calories) {
      return NextResponse.json(
        { error: 'Food name and calories are required' },
        { status: 400 }
      )
    }
    
    // Ensure timestamp is set
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString()
    }
    
    const savedEntry = await saveEntry(data)
    return NextResponse.json(savedEntry)
  } catch (error) {
    console.error('Error saving entry:', error)
    return NextResponse.json(
      { error: 'Failed to save entry' },
      { status: 500 }
    )
  }
}
