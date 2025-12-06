// Backend API integration for https://gdg-api.callec.net/
const API_BASE_URL = 'https://gdg-api.callec.net';

// Types matching the API responses
export interface Exercise {
  sub: string;
  creation_time: number;
  content?: string;
}

export interface ExerciseInfo extends Exercise {
  content: string;
}

export interface User {
  sub: string;
  exercise_sub: string;
  academic_id: number;
  creation_time: number;
}

export interface UserInfo extends User {
  exercise_id: string;
  note?: number;
}

export interface Participant {
  sub: string;
  academic_id: number;
  content?: string;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE' = 'GET',
  body?: any,
  useFormData: boolean = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[API] ${method} ${url}`, body ? { body } : '');
  
  const options: RequestInit = {
    method,
    mode: 'cors', // Explicitly set CORS mode
  };

  if (body) {
    if (useFormData) {
      // Send as form-urlencoded for PHP $_POST compatibility
      const formBody = new URLSearchParams();
      Object.keys(body).forEach(key => {
        formBody.append(key, body[key]);
      });
      options.body = formBody;
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
    } else {
      // Send as JSON
      options.body = JSON.stringify(body);
      options.headers = {
        'Content-Type': 'application/json',
      };
    }
  }

  try {
    const response = await fetch(url, options);
    
    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response:`, errorText);
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`[API] Response data:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Request failed:`, error);
    throw error;
  }
}

// ============================================
// EXERCISE ENDPOINTS
// ============================================

/**
 * Create a new exercise
 * POST /v1/exercises/new
 * @param content - The exercise content (JSON stringified)
 * @returns Exercise object with sub and creation_time
 */
export async function createExercise(content: string): Promise<Exercise> {
  return apiCall<Exercise>('/v1/exercises/new', 'POST', { content }, true);
}

/**
 * Get exercise information
 * GET /v1/exercise/{exercise_id}/info
 * @param exerciseId - The exercise sub/ID
 * @returns Exercise info including content
 */
export async function getExerciseInfo(exerciseId: string): Promise<ExerciseInfo> {
  return apiCall<ExerciseInfo>(`/v1/exercise/${exerciseId}/info`);
}

/**
 * Update an exercise
 * POST /v1/exercise/{exercise_id}/update
 * @param exerciseId - The exercise sub/ID
 * @param content - The new exercise content
 */
export async function updateExercise(exerciseId: string, content: string): Promise<void> {
  await apiCall(`/v1/exercise/${exerciseId}/update`, 'POST', { content }, true);
}

/**
 * Delete an exercise
 * DELETE /v1/exercise/{exercise_id}/delete
 * @param exerciseId - The exercise sub/ID
 */
export async function deleteExercise(exerciseId: string): Promise<void> {
  await apiCall(`/v1/exercise/${exerciseId}/delete`, 'DELETE');
}

/**
 * Get list of participants for an exercise
 * GET /v1/exercise/{exercise_id}/participants
 * @param exerciseId - The exercise sub/ID
 * @returns Array of participant user IDs
 */
export async function getExerciseParticipants(exerciseId: string): Promise<string[]> {
  return apiCall<string[]>(`/v1/exercise/${exerciseId}/participants`);
}

/**
 * Get a specific participant's info for an exercise
 * GET /v1/exercise/{exercise_id}/participant/{user_id}
 * @param exerciseId - The exercise sub/ID
 * @param userId - The user sub/ID
 * @returns Participant info including their code content
 */
export async function getExerciseParticipant(
  exerciseId: string,
  userId: string
): Promise<Participant> {
  return apiCall<Participant>(`/v1/exercise/${exerciseId}/participant/${userId}`);
}

// ============================================
// USER ENDPOINTS
// ============================================

/**
 * Create a new user for an exercise
 * POST /v1/users/new
 * @param exerciseId - The exercise sub/ID
 * @param academicId - The academic ID (MUST BE INTEGER)
 * @returns User object with sub, exercise_sub, academic_id, and creation_time
 */
export async function createUser(exerciseId: string, academicId: number): Promise<User> {
  return apiCall<User>('/v1/users/new', 'POST', { 
    exercise_id: exerciseId, 
    academic_id: academicId 
  }, true);
}

/**
 * Get user information
 * GET /v1/user/{user_id}/info
 * @param userId - The user sub/ID
 * @returns User info including note if assigned
 */
export async function getUserInfo(userId: string): Promise<UserInfo> {
  return apiCall<UserInfo>(`/v1/user/${userId}/info`);
}

/**
 * Push/update user's code content
 * POST /v1/user/{user_id}/push
 * @param userId - The user sub/ID
 * @param content - The code content to save
 */
export async function pushUserContent(userId: string, content: string): Promise<void> {
  await apiCall(`/v1/user/${userId}/push`, 'POST', { content }, true);
}

/**
 * Delete a user
 * DELETE /v1/user/{user_id}/delete
 * @param userId - The user sub/ID
 */
export async function deleteUser(userId: string): Promise<void> {
  await apiCall(`/v1/user/${userId}/delete`, 'DELETE');
}

/**
 * Assign a note/grade to a user
 * POST /v1/user/{user_id}/note
 * @param userId - The user sub/ID
 * @param note - The note/grade (0-100)
 */
export async function assignUserNote(userId: string, note: number): Promise<void> {
  if (note < 0 || note > 100) {
    throw new Error('Note must be between 0 and 100');
  }
  await apiCall(`/v1/user/${userId}/note`, 'POST', { note }, true);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create exercise content from step data
 * Helper to serialize exercise data for the backend
 */
export function serializeExerciseContent(data: {
  title: string;
  code: string;
  description: string;
  steps: Array<{
    description: string;
    lineStart: number;
    lineEnd: number;
  }>;
}): string {
  return JSON.stringify(data);
}

/**
 * Parse exercise content from backend
 * Helper to deserialize exercise data from the backend
 */
export function parseExerciseContent(content: string): {
  title: string;
  code: string;
  description: string;
  steps: Array<{
    description: string;
    lineStart: number;
    lineEnd: number;
  }>;
} {
  return JSON.parse(content);
}

/**
 * Get all participant details for an exercise
 * Fetches the participant list and then gets details for each participant
 */
export async function getAllParticipantsWithDetails(exerciseId: string): Promise<Participant[]> {
  const participantIds = await getExerciseParticipants(exerciseId);
  const participants = await Promise.all(
    participantIds.map(userId => getExerciseParticipant(exerciseId, userId))
  );
  return participants;
}
