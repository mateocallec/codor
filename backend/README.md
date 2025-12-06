# Backend logic

For users, notes & exercise storage

**API DOMAIN:** https://gdg-api.callec.net

## API Endpoints

`POST /v1/exercises/new` -> content: string

```json
{"sub": string, "creation_time": int}
```

```
curl -X POST -d "content=THIS_IS_MY_CONTENT" https://gdg-api.callec.net/v1/exercises/new
```

---

`GET /v1/exercise/{exercise_id}/info`

```json
{"sub": string, "creation_time": int, "content": string}
```

```
curl -X GET https://gdg-api.callec.net/v1/exercise/{exercise_id}/info
```

---

`POST /v1/exercise/{exercise_id}/update` -> content: string

```
curl -X POST -d "content=THIS_IS_MY_CONTENT" https://gdg-api.callec.net/v1/exercise/{exercise_id}/update
```

---

`DELETE /v1/exercise/{exercise_id}/delete`

```
curl -X DELETE https://gdg-api.callec.net/v1/exercise/{exercise_id}/delete
```

---

`GET /v1/exercise/{exercise_id}/participants`

```json
["sub1", "sub2", ...]
```

```
curl -X GET https://gdg-api.callec.net/v1/exercise/{exercise_id}/participants
```

---

`GET /v1/exercise/{exercise_id}/participant/{user_id}`

```json
{"sub": string, "academic_id": int,"content": ?string}
```

```
curl -X GET https://gdg-api.callec.net/v1/exercise/{exercise_id}/participant/{user_id}
```

---

`POST /v1/users/new` -> exercise_id: string, academic_id: int

```json
{"sub": string, "exercise_sub": string, "academic_id": string, "creation_time": int}
```

```
curl -X POST -d "exercise_id=&academic_id=" https://gdg-api.callec.net/v1/users/new
```

---

`GET /v1/user/{user_id}/info`

```json
{"sub": string, "exercise_id": string, "creation_time": int, "academic_id": int, "note": ?int}
```

```
curl -X GET https://gdg-api.callec.net/v1/user/{user_id}/info
```

---

`POST /v1/user/{user_id}/push` -> content: string

```
curl -X POST -d "content=THIS_IS_MY_WORK" https://gdg-api.callec.net/v1/user/{user_id}/push
```

---

`DELETE /v1/user/{user_id}/delete`

```
curl -X DELETE https://gdg-api.callec.net/v1/user/{user_id}/delete
```

---

`POST /v1/user/{user_id}/note` -> note: int (>= 0 && <= 100)

```
curl -X POST -d "note=12" https://gdg-api.callec.net/v1/user/{user_id}/note
```
