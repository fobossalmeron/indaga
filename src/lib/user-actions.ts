import { supabase } from './supabase'

export interface SavedEvent {
  id: string
  user_id: string
  event_id: string
  event_title: string
  event_date: string | null
  saved_at: string | null
}

export interface SavedPlace {
  id: string
  user_id: string
  place_id: string
  place_name: string
  place_category: string | null
  saved_at: string | null
}

export interface UserActionResult {
  success: boolean
  message: string
  data?: any
}

// Event Management Functions
export async function saveEvent(
  userId: string,
  eventId: string,
  eventTitle: string,
  eventDate?: string
): Promise<UserActionResult> {
  try {
    // Check if event is already saved
    const { data: existingEvent, error: checkError } = await supabase
      .from('saved_events')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing event:', checkError)
      return {
        success: false,
        message: 'Error al verificar el evento guardado.'
      }
    }

    if (existingEvent) {
      return {
        success: false,
        message: 'Este evento ya está guardado en tu lista.'
      }
    }

    // Save the event
    const { data, error } = await supabase
      .from('saved_events')
      .insert({
        user_id: userId,
        event_id: eventId,
        event_title: eventTitle,
        event_date: eventDate || null,
        saved_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving event:', error)
      return {
        success: false,
        message: 'Error al guardar el evento.'
      }
    }

    return {
      success: true,
      message: 'Evento guardado exitosamente.',
      data
    }
  } catch (error) {
    console.error('Error in saveEvent:', error)
    return {
      success: false,
      message: 'Error interno al guardar el evento.'
    }
  }
}

export async function removeSavedEvent(
  userId: string,
  eventId: string
): Promise<UserActionResult> {
  try {
    const { error } = await supabase
      .from('saved_events')
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId)

    if (error) {
      console.error('Error removing saved event:', error)
      return {
        success: false,
        message: 'Error al eliminar el evento guardado.'
      }
    }

    return {
      success: true,
      message: 'Evento eliminado de tu lista.'
    }
  } catch (error) {
    console.error('Error in removeSavedEvent:', error)
    return {
      success: false,
      message: 'Error interno al eliminar el evento.'
    }
  }
}

export async function getUserSavedEvents(userId: string): Promise<SavedEvent[]> {
  try {
    const { data, error } = await supabase
      .from('saved_events')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserSavedEvents:', error)
    return []
  }
}

export async function isEventSaved(userId: string, eventId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('saved_events')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking if event is saved:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in isEventSaved:', error)
    return false
  }
}

// Place Management Functions
export async function savePlace(
  userId: string,
  placeId: string,
  placeName: string,
  placeCategory?: string
): Promise<UserActionResult> {
  try {
    // Check if place is already saved
    const { data: existingPlace, error: checkError } = await supabase
      .from('saved_places')
      .select('id')
      .eq('user_id', userId)
      .eq('place_id', placeId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing place:', checkError)
      return {
        success: false,
        message: 'Error al verificar el lugar guardado.'
      }
    }

    if (existingPlace) {
      return {
        success: false,
        message: 'Este lugar ya está guardado en tu lista.'
      }
    }

    // Save the place
    const { data, error } = await supabase
      .from('saved_places')
      .insert({
        user_id: userId,
        place_id: placeId,
        place_name: placeName,
        place_category: placeCategory || null,
        saved_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving place:', error)
      return {
        success: false,
        message: 'Error al guardar el lugar.'
      }
    }

    return {
      success: true,
      message: 'Lugar guardado exitosamente.',
      data
    }
  } catch (error) {
    console.error('Error in savePlace:', error)
    return {
      success: false,
      message: 'Error interno al guardar el lugar.'
    }
  }
}

export async function removeSavedPlace(
  userId: string,
  placeId: string
): Promise<UserActionResult> {
  try {
    const { error } = await supabase
      .from('saved_places')
      .delete()
      .eq('user_id', userId)
      .eq('place_id', placeId)

    if (error) {
      console.error('Error removing saved place:', error)
      return {
        success: false,
        message: 'Error al eliminar el lugar guardado.'
      }
    }

    return {
      success: true,
      message: 'Lugar eliminado de tu lista.'
    }
  } catch (error) {
    console.error('Error in removeSavedPlace:', error)
    return {
      success: false,
      message: 'Error interno al eliminar el lugar.'
    }
  }
}

export async function getUserSavedPlaces(userId: string): Promise<SavedPlace[]> {
  try {
    const { data, error } = await supabase
      .from('saved_places')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved places:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserSavedPlaces:', error)
    return []
  }
}

export async function isPlaceSaved(userId: string, placeId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('saved_places')
      .select('id')
      .eq('user_id', userId)
      .eq('place_id', placeId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking if place is saved:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in isPlaceSaved:', error)
    return false
  }
}

// Combined user data functions
export async function getUserSavedContent(userId: string) {
  try {
    const [savedEvents, savedPlaces] = await Promise.all([
      getUserSavedEvents(userId),
      getUserSavedPlaces(userId)
    ])

    return {
      events: savedEvents,
      places: savedPlaces,
      totalSaved: savedEvents.length + savedPlaces.length
    }
  } catch (error) {
    console.error('Error in getUserSavedContent:', error)
    return {
      events: [],
      places: [],
      totalSaved: 0
    }
  }
}

// Utility function to toggle save status
export async function toggleEventSave(
  userId: string,
  eventId: string,
  eventTitle: string,
  eventDate?: string
): Promise<UserActionResult> {
  const isSaved = await isEventSaved(userId, eventId)
  
  if (isSaved) {
    return await removeSavedEvent(userId, eventId)
  } else {
    return await saveEvent(userId, eventId, eventTitle, eventDate)
  }
}

export async function togglePlaceSave(
  userId: string,
  placeId: string,
  placeName: string,
  placeCategory?: string
): Promise<UserActionResult> {
  const isSaved = await isPlaceSaved(userId, placeId)
  
  if (isSaved) {
    return await removeSavedPlace(userId, placeId)
  } else {
    return await savePlace(userId, placeId, placeName, placeCategory)
  }
}