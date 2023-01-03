# CRUD API

## API with cluster and load balancing

#### [RSSchool NodeJS Course Assignment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

---

#### Installation

```
$ git clone https://github.com/py-cs/node-crud-api.git
```

```
$ npm install
```

#### Configuration

Server port for listening incoming requests can be configured as environment variable (.env.example is provided)

#### Scripts

```
$ npm run start:dev
```

```
$ npm run start:prod
```

```
$ npm run start:dev:multi
```

```
$ npm run start:dev:prod
```

```
$ npm run test
```

---

#### OpenAPI docs

https://app.swaggerhub.com/apis/py-cs/nodeJS-crud-api/1.0.0#/

---

#### Endpoints description

1. `api/users`:
   - **GET** `api/users` is used to get all persons
     - Response: `status code` **200** and all users records
   - **GET** `api/users/${userId}`
     - Response: `status code` **200** and and record with `id === userId` if it exists
     - Response: `status code` **400** and message `Invalid user id` if provided id is not valid uuid
     - Response: `status code` **404** and message `User with id {provided_id} not found`
   - **POST** `api/users` is used to create record about new user and store it in database
     - Response: `status code` **201** and newly created record
     - Response: `status code` **400** and message `Invalid user data` if request `body` does not contain **required** fields
   - **PUT** `api/users/{userId}` is used to update existing user
     - Response: ` status code` **200** and updated record
     - Response: ` status code` **400** and message `Invalid user id` if provided id is not valid uuid
     - Response: ` status code` **404** and and message `User with id {provided_id} not found`
   - **DELETE** `api/users/${userId}` is used to delete existing user from database
     - Response: `status code` **204** if the record is found and deleted
     - Response: ` status code` **400** and message `Invalid user id` if provided id is not valid uuid
     - Response: ` status code` **404** and and message `User with id {provided_id} not found`
2. Requests to non-existing endpoints (e.g. `some-non/existing/resource`) Response: `status code` **404** `Endpoint is not available`)

---

#### Testing

Script `npm run test` runs e2e test for all methods with valid and invalid data. For manual testing Postman or similar tools can be used. In cluster mode workers can be accessed directly via corresponding ports (requests can be sent directly to ports 4001, 4002, ...). Workers' ids, ports and processed requests are logged to console.
