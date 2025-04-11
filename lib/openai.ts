import OpenAI from 'openai'
import { FoodEntry } from './types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function analyzeImage(imageBase64: string): Promise<FoodEntry> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a nutrition expert who analyses food images and provides accurate calorie estimates.
          Format your response as a JSON object with the following fields:
          - foodName: The name of the food in the image
          - calories: A numeric estimate of the calories (kcal)
          - description: A brief description of the nutritional content (proteins, carbs, fats) and portion size`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "What food is in this image? Analyze it and provide calorie information." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(response.choices[0]?.message?.content || '{}')
    
    return {
      foodName: result.foodName || 'Unknown food',
      calories: result.calories || 0,
      description: result.description || 'No description available',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error analyzing image with OpenAI:', error)
    throw new Error('Failed to analyze the food image')
  }
}
