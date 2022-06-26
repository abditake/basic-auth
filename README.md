LAB - Basic Authorization
========

Authenticating through encoding and decoding username and password
---------------

### Author: Abdinasir Yussuf

### Setup

#### `.env` requirements

-   `PORT` - Port Number
-   DATABASE_URL- postgres link or sqlite Memory 

#### Running the app

-   `npm start`
-   Endpoint: 
              `/signup'`
              `/signin`

    -   Returns Object

        ```
        {
          "username": "tester",
          "password": "$2b$05$N5J/F6339f9wKNsyWGeKQOrGFTaeLjp1yg93D8PKNDXoDpt5KkV5m",
          "updatedAt": "2022-06-21T21:23:46.610Z",
          "createdAt": "2022-06-21T21:23:46.610Z"
        }

        ```

#### Tests

-   Unit Tests: `npm test`


#### UML

![uml design for token](./assets/auth_server.png)