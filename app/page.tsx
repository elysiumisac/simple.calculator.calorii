'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { FoodEntry } from '../lib/types'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<FoodEntry | null>(null)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Fetch existing entries when component mounts
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/entries')
        if (response.ok) {
          const data = await response.json()
          setFoodEntries(data)
        }
      } catch (error) {
        console.error('Error fetching entries:', error)
      }
    }

    fetchEntries()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create file preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async () => {
    if (!imagePreview) return

    setIsLoading(true)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      if (fileInputRef.current?.files?.[0]) {
        formData.append('image', fileInputRef.current.files[0])
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      setAnalysisResult(data)
    } catch (error) {
      console.error('Error analyzing image:', error)
      alert('Eroare la analizarea imaginii. Te rugăm să încerci din nou.')
    } finally {
      setIsLoading(false)
    }
  }

  const saveEntry = async () => {
    if (!analysisResult) return

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisResult),
      })

      if (!response.ok) {
        throw new Error('Failed to save entry')
      }

      const savedEntry = await response.json()
      setFoodEntries([savedEntry, ...foodEntries])
      
      // Reset the form
      setImagePreview(null)
      setAnalysisResult(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Eroare la salvarea intrării. Te rugăm să încerci din nou.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Calculator de Calorii</h1>
        <p className="text-gray-600">Încarcă poze cu mâncarea și urmărește caloriile cu ajutorul AI</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Încarcă Poza cu Mâncare</h2>
          
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input"
            />
          </div>

          {imagePreview && (
            <div className="mb-4">
              <div className="relative w-full h-64">
                <Image 
                  src={imagePreview}
                  alt="Food preview"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-lg"
                />
              </div>
              
              <button 
                onClick={analyzeImage}
                disabled={isLoading}
                className="btn mt-4 w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analizare...
                  </span>
                ) : 'Analizează Mâncarea'}
              </button>
            </div>
          )}

          {analysisResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Rezultatul Analizei:</h3>
              <p className="mb-1"><span className="font-medium">Mâncare:</span> {analysisResult.foodName}</p>
              <p className="mb-1"><span className="font-medium">Calorii:</span> {analysisResult.calories} kcal</p>
              <p className="mb-3"><span className="font-medium">Descriere:</span> {analysisResult.description}</p>
              
              <button
                onClick={saveEntry}
                className="btn w-full"
              >
                Salvează în Istoric
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Intrări Recente</h2>
          
          {foodEntries.length === 0 ? (
            <p className="text-gray-500 italic">Nicio intrare încă. Încarcă o poză pentru a începe!</p>
          ) : (
            <div className="space-y-4">
              {foodEntries.map((entry, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{entry.foodName}</h3>
                      <p className="text-sm text-gray-600">{entry.calories} kcal</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{entry.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
