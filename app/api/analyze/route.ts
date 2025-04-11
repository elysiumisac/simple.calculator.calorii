import { NextRequest, NextResponse } from 'next/server'
import { analyzeImage } from '../../../lib/openai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert the image to base64
    const buffer = await image.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')
    
    // Analyze the image with OpenAI
    const analysis = await analyzeImage(base64Image)
    
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in analyze API:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
