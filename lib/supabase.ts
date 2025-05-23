import { createClient } from '@supabase/supabase-js'
import { FoodEntry } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function saveEntry(entry: FoodEntry) {
  const { data, error } = await supabase
    .from('food_entries')
    .insert([
      { 
        food_name: entry.foodName,
        calories: entry.calories,
        description: entry.description,
        image_url: entry.imageUrl,
        timestamp: entry.timestamp || new Date().toISOString()
      }
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }
  
  return data && data[0] ? {
    id: data[0].id,
    foodName: data[0].food_name,
    calories: data[0].calories,
    description: data[0].description,
    imageUrl: data[0].image_url,
    timestamp: data[0].timestamp
  } : null
}

// Funcție pentru a obține intrările din ziua curentă
export async function getTodayEntries() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Începutul zilei curente
  
  const { data, error } = await supabase
    .from('food_entries')
    .select('*')
    .gte('timestamp', today.toISOString())
    .order('timestamp', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  
  return data ? data.map(entry => ({
    id: entry.id,
    foodName: entry.food_name,
    calories: entry.calories,
    description: entry.description,
    imageUrl: entry.image_url,
    timestamp: entry.timestamp
  })) : [];
}

// Funcție pentru a calcula totalul caloriilor din ziua curentă
export async function getTodayTotalCalories() {
  const todayEntries = await getTodayEntries();
  return todayEntries.reduce((total, entry) => total + entry.calories, 0);
}

// Funcție pentru ștergerea tuturor intrărilor din ziua curentă
export async function deleteTodayEntries() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Începutul zilei curente
  
  const { error } = await supabase
    .from('food_entries')
    .delete()
    .gte('timestamp', today.toISOString());

  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
}

export async function getEntries() {
  // Resetăm istoricul pentru a fi curat pentru fiecare utilizator nou
  const { data, error } = await supabase
    .from('food_entries')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }
  
  return data ? data.map(entry => ({
    id: entry.id,
    foodName: entry.food_name,
    calories: entry.calories,
    description: entry.description,
    imageUrl: entry.image_url,
    timestamp: entry.timestamp
  })) : []
}
