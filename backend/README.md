# Backend logic

For users, notes & exercise storage

## API Endpoints

`POST /v1/exercises/new` -> content: string

```json
{"sub": string, "creation_time": int}
```

---

`GET /v1/exercise/{exercise_id}/info`

```json
{"sub": string, "creation_time": int, "content": string}
```

---

`POST /v1/exercise/{exercise_id}/update` -> content: string

---

`DELETE /v1/exercise/{exercise_id}/delete`

---

`GET /v1/exercise/{exercise_id}/participants`

```json
["sub1", "sub2", ...]
```

---

`GET /v1/exercise/{exercise_id}/participant/{user_id}`

```json
{"sub": string, "academic_id": int,"content": ?string}
```

---

`POST /v1/users/new` -> exercise_id: string, academic_id: string

```json
{"sub": string, "exercise_sub": string, "academic_id": string, "creation_time": int}
```

---

`GET /v1/user/{user_id}/info`

```json
{"sub": string, "exercise_id": string, "creation_time": int, "academic_id": string, "note": ?int}
```

---

`POST /v1/user/{user_id}/push` -> content: string

---

`DELETE /v1/user/{user_id}/delete`

---

`POST /v1/user/{user_id}/note` -> note: int (>= 0 && <= 100)
