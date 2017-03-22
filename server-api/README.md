**api-server** is the api endpoint. It responds to API requests, such as searching. Mainly searching. Each request loads the database independently.

- runs at `bm.com/api/1/`
- `GET /query?name&…` -> `{}`
- `GET /status` -> `((unsorted-watcher up) (database-watcher up) (website-watcher down) (web-server up) (api-server up))`
