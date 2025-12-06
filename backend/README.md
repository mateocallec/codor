# Backend logic

For users, notes & exercise storage

## API Endpoints

`POST /v1/exercises/new` -> content: string

---

`GET /v1/exercise/{exercise_sub}/info`

---

`POST /v1/exercise/{exercise_sub}/update` -> content: string

---

`DELETE /v1/exercise/{exercise_sub}/delete`

---

`GET /v1/exercise/{exercise_sub}/returns`

---

`GET /v1/exercise/{exercise_sub}/return/{user_sub}`

---

`POST /v1/users/new` -> content: string

---

`GET /v1/user/{user_sub}/info`

---

`DELETE /v1/user/{user_sub}/delete`
