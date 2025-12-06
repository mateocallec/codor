# Backend API

Backend service responsible for **exercise management**, **user submissions**, and **grading**.

---

## ⚠️ Important

The directory below **must be writable** for the application to work correctly:

```bash
container-data/storage
```

Required permissions:

```bash
chmod -R 777 container-data/storage
```

---

## 🌐 API Base URL

```
https://gdg-api.callec.net
```

All endpoints are prefixed with `/v1`.

---

## 📚 API Endpoints

---

### ➕ Create a new exercise

**Endpoint**

```
POST /v1/exercises/new
```

**Parameters**

| Name    | Type   | Required | Description      |
| ------- | ------ | -------- | ---------------- |
| content | string | No       | Exercise content |

**Response**

```json
{
  "sub": "string",
  "creation_time": 1234567890
}
```

**Test**

```bash
curl -X POST \
  -d "content=THIS_IS_MY_CONTENT" \
  https://gdg-api.callec.net/v1/exercises/new
```

---

### 📄 Get exercise information

**Endpoint**

```
GET /v1/exercise/{exercise_id}/info
```

**Response**

```json
{
  "sub": "string",
  "creation_time": 1234567890,
  "content": "string"
}
```

**Test**

```bash
curl -X GET \
  https://gdg-api.callec.net/v1/exercise/{exercise_id}/info
```

---

### ✏️ Update an exercise

**Endpoint**

```
POST /v1/exercise/{exercise_id}/update
```

**Parameters**

| Name    | Type   | Required |
| ------- | ------ | -------- |
| content | string | Yes      |

**Test**

```bash
curl -X POST \
  -d "content=UPDATED_CONTENT" \
  https://gdg-api.callec.net/v1/exercise/{exercise_id}/update
```

---

### 🗑️ Delete an exercise

**Endpoint**

```
DELETE /v1/exercise/{exercise_id}/delete
```

**Test**

```bash
curl -X DELETE \
  https://gdg-api.callec.net/v1/exercise/{exercise_id}/delete
```

---

### 👥 List exercise participants

**Endpoint**

```
GET /v1/exercise/{exercise_id}/participants
```

**Response**

```json
["user_sub_1", "user_sub_2"]
```

**Test**

```bash
curl -X GET \
  https://gdg-api.callec.net/v1/exercise/{exercise_id}/participants
```

---

### 👤 Get participant details

**Endpoint**

```
GET /v1/exercise/{exercise_id}/participant/{user_id}
```

**Response**

```json
{
  "sub": "string",
  "academic_id": 123456,
  "content": "string | null"
}
```

**Test**

```bash
curl -X GET \
  https://gdg-api.callec.net/v1/exercise/{exercise_id}/participant/{user_id}
```

---

### ➕ Create a new user

**Endpoint**

```
POST /v1/users/new
```

**Parameters**

| Name        | Type   | Required |
| ----------- | ------ | -------- |
| exercise_id | string | Yes      |
| academic_id | int    | Yes      |

**Response**

```json
{
  "sub": "string",
  "exercise_sub": "string",
  "academic_id": 123456,
  "creation_time": 1234567890
}
```

**Test**

```bash
curl -X POST \
  -d "exercise_id=EXERCISE_SUB&academic_id=123456" \
  https://gdg-api.callec.net/v1/users/new
```

---

### ℹ️ Get user information

**Endpoint**

```
GET /v1/user/{user_id}/info
```

**Response**

```json
{
  "sub": "string",
  "exercise_id": "string",
  "creation_time": 1234567890,
  "academic_id": 123456,
  "note": 85
}
```

**Test**

```bash
curl -X GET \
  https://gdg-api.callec.net/v1/user/{user_id}/info
```

---

### 📤 Submit user content

**Endpoint**

```
POST /v1/user/{user_id}/push
```

**Parameters**

| Name    | Type   | Required |
| ------- | ------ | -------- |
| content | string | Yes      |

**Test**

```bash
curl -X POST \
  -d "content=THIS_IS_MY_WORK" \
  https://gdg-api.callec.net/v1/user/{user_id}/push
```

---

### 🗑️ Delete a user

**Endpoint**

```
DELETE /v1/user/{user_id}/delete
```

**Test**

```bash
curl -X DELETE \
  https://gdg-api.callec.net/v1/user/{user_id}/delete
```

---

### ✅ Grade a user

**Endpoint**

```
POST /v1/user/{user_id}/note
```

**Parameters**

| Name | Type | Constraints    |
| ---- | ---- | -------------- |
| note | int  | 0 ≤ note ≤ 100 |

**Test**

```bash
curl -X POST \
  -d "note=12" \
  https://gdg-api.callec.net/v1/user/{user_id}/note
```

---

## 🧩 Notes

- All responses are returned in **JSON**
- Errors return an appropriate **HTTP status code**
- Exercise and user contents are stored using file-based storage
