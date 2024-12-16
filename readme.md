This API was created using node version 22.12.0 LTS. To start the server locally run:

```bash
npm run dev
```

The API has the following routes:

- GET: `/tasks`
    - query: `?title=string&description=string`
- GET: `/tasks/:id`
- POST: `/tasks`
- POST: `/tasks/bulk`
- PUT: `/tasks/:id`
- PATCH: `/tasks/:id/complete`
- DELETE: `/tasks/:id`