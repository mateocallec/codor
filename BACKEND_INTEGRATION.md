# Backend API Integration Documentation

This document describes the complete integration of the backend API (`https://gdg-api.callec.net/`) with the frontend application.

## 🎯 Overview

The application now uses the backend API for all exercise and user management operations, replacing all previously hardcoded data.

## 📁 Files Modified/Created

### New Files
- **`frontend/src/lib/api.ts`** - Complete API service layer with all backend endpoints

### Modified Files
- **`frontend/src/pages/TeacherUpload.tsx`** - Publishes exercises to backend
- **`frontend/src/pages/StudentProgress.tsx`** - Fetches exercises and participants from backend
- **`frontend/src/pages/TeacherDashboard.tsx`** - Shows shareable exercise links
- **`frontend/src/pages/Index.tsx`** - Loads exercises, creates users, auto-saves student code
- **`frontend/src/contexts/AppContext.tsx`** - Added exerciseId, userId, and academicId state

## 🔌 API Endpoints Implemented

### Exercise Management

#### 1. Create Exercise
```typescript
POST /v1/exercises/new
Body: { content: string }
Response: { sub: string, creation_time: number }
```
**Usage:** Teacher creates a new exercise with title, code, description, and steps.

#### 2. Get Exercise Info
```typescript
GET /v1/exercise/{exercise_id}/info
Response: { sub: string, creation_time: number, content: string }
```
**Usage:** Load exercise details including all steps and code.

#### 3. Update Exercise
```typescript
POST /v1/exercise/{exercise_id}/update
Body: { content: string }
```
**Usage:** Update existing exercise content.

#### 4. Delete Exercise
```typescript
DELETE /v1/exercise/{exercise_id}/delete
```
**Usage:** Remove an exercise.

#### 5. Get Exercise Participants
```typescript
GET /v1/exercise/{exercise_id}/participants
Response: ["sub1", "sub2", ...]
```
**Usage:** Get list of all students working on an exercise.

#### 6. Get Participant Details
```typescript
GET /v1/exercise/{exercise_id}/participant/{user_id}
Response: { sub: string, academic_id: number, content?: string }
```
**Usage:** Get specific student's code submission for an exercise.

### User Management

#### 1. Create User
```typescript
POST /v1/users/new
Body: { exercise_id: string, academic_id: number }
Response: { sub: string, exercise_sub: string, academic_id: number, creation_time: number }
```
**Usage:** Student joins an exercise with their academic ID.

#### 2. Get User Info
```typescript
GET /v1/user/{user_id}/info
Response: { sub: string, exercise_id: string, creation_time: number, academic_id: number, note?: number }
```
**Usage:** Get student information and their grade.

#### 3. Push User Content
```typescript
POST /v1/user/{user_id}/push
Body: { content: string }
```
**Usage:** Save student's code (auto-saves every 30 seconds).

#### 4. Delete User
```typescript
DELETE /v1/user/{user_id}/delete
```
**Usage:** Remove a student from the system.

#### 5. Assign Note/Grade
```typescript
POST /v1/user/{user_id}/note
Body: { note: number } // 0-100
```
**Usage:** Teacher assigns a grade to a student.

## 🔄 Data Flow

### Teacher Workflow

1. **Create Exercise** (`/teacher/upload`)
   - Teacher designs exercise with code, description, and steps
   - Clicks "Publish Task"
   - Frontend calls `createExercise()` with serialized exercise data
   - Backend returns exercise ID
   - Exercise ID stored in localStorage
   - Teacher redirected to dashboard

2. **Share Exercise Link** (`/teacher`)
   - Dashboard displays shareable link: `/?exercise_id={id}`
   - Teacher copies and shares link with students

3. **Monitor Progress** (`/teacher/progress`)
   - Frontend loads exercises from localStorage
   - For each exercise, calls `getExerciseInfo()` and `getAllParticipantsWithDetails()`
   - Displays list of students with their academic IDs and grades
   - Can view individual student submissions

### Student Workflow

1. **Access Exercise** (`/?exercise_id={id}`)
   - Student opens shared link
   - Frontend calls `getExerciseInfo()` to load exercise
   - Student enters their academic ID (integer)
   - Frontend calls `createUser()` to register student
   - User ID stored in localStorage

2. **Work on Exercise** (`/`)
   - Student codes in the editor
   - Code auto-saves every 30 seconds via `pushUserContent()`
   - Student can chat with AI tutor for help
   - All state persists across page refreshes

3. **Submit for Grading**
   - Student's final code is saved via `pushUserContent()`
   - Teacher can view submission in progress dashboard
   - Teacher assigns grade via `assignUserNote()`

## 💾 Local Storage

The application uses localStorage to maintain state:

```typescript
// Teacher side
localStorage.setItem('lastCreatedExerciseId', exerciseId);
localStorage.setItem('exerciseIds', JSON.stringify([...ids]));

// Student side
localStorage.setItem('currentExerciseId', exerciseId);
localStorage.setItem('currentUserId', userId);
localStorage.setItem('currentAcademicId', academicId.toString());
```

## 🔧 Helper Functions

### `serializeExerciseContent()`
Converts exercise object to JSON string for backend storage:
```typescript
serializeExerciseContent({
  title: "Build a Greeting Function",
  code: "function greet(name) { ... }",
  description: "Learn about functions...",
  steps: [{ description: "...", lineStart: 1, lineEnd: 1 }]
})
```

### `parseExerciseContent()`
Parses JSON string from backend into exercise object.

### `getAllParticipantsWithDetails()`
Convenience function that fetches participant list and details in one call.

## ⚠️ Important Notes

1. **Academic ID Must Be Integer**: The API requires `academic_id` to be a number, not a string.

2. **Auto-Save**: Student code is automatically saved every 30 seconds to prevent data loss.

3. **Exercise Content Format**: Exercise content is stored as a JSON string containing:
   - `title`: Exercise name
   - `code`: Template/solution code
   - `description`: Exercise instructions
   - `steps`: Array of step objects with descriptions and line ranges

4. **Error Handling**: All API calls include try-catch blocks with user-friendly error messages.

5. **No Authentication**: Current implementation doesn't include user authentication. Academic ID serves as student identifier.

## 🎨 UI/UX Features

### Teacher Dashboard
- ✅ Create new exercises with AI-generated steps
- ✅ Share exercise links with students
- ✅ View all student submissions
- ✅ Assign grades to students
- ✅ Copy student access links

### Student View
- ✅ Join exercise with academic ID
- ✅ Auto-save code every 30 seconds
- ✅ Interactive AI tutor for help
- ✅ Code highlighting from AI feedback
- ✅ Real-time code execution

## 🚀 Testing the Integration

### Test Teacher Flow:
1. Navigate to `/teacher/upload`
2. Create an exercise with AI-generated steps
3. Click "Publish Task"
4. Copy the exercise link from dashboard
5. Open `/teacher/progress` to verify exercise appears

### Test Student Flow:
1. Open the shared exercise link
2. Enter an academic ID (e.g., 12345)
3. Write code in the editor
4. Verify auto-save works (check console logs)
5. Return to teacher progress view to see your submission

## 📝 Future Enhancements

- [ ] Add proper authentication system
- [ ] Implement exercise editing
- [ ] Add exercise templates library
- [ ] Track time spent on exercises
- [ ] Store AI chat history
- [ ] Add exercise versioning
- [ ] Implement student dashboard
- [ ] Add code comparison view for teachers

## 🐛 Troubleshooting

**Issue:** "No exercise ID provided"
- **Solution:** Ensure you're using a valid exercise link with `?exercise_id=` parameter

**Issue:** "Failed to create exercise"
- **Solution:** Check network connectivity and backend API status

**Issue:** "Academic ID must be a number"
- **Solution:** Ensure academic ID is an integer, not a string

**Issue:** Code not saving
- **Solution:** Check browser console for API errors, verify user ID is set

## 📊 Data Types

```typescript
// Exercise stored in backend
{
  sub: string,              // Exercise ID
  creation_time: number,    // Timestamp
  content: string          // JSON stringified exercise data
}

// User stored in backend
{
  sub: string,              // User ID
  exercise_sub: string,     // Exercise ID this user belongs to
  academic_id: number,      // Student number (integer)
  creation_time: number,    // Timestamp
  note?: number            // Grade (0-100)
}

// Participant info
{
  sub: string,              // User ID
  academic_id: number,      // Student number
  content?: string         // Student's code (if submitted)
}
```

---

**Integration completed by:** GitHub Copilot
**Date:** December 6, 2025
**Backend API:** https://gdg-api.callec.net/
