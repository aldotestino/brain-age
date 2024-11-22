# Build

1. Build api
    ```sh
    docker compose build api
    ```

2. Run db and api
    ```sh
    docker compose up db api -d
    ```

3. Build app
    ```sh
    docker compose build app
    ```

4. Shut down db and api
    ```sh
    docker compose down db api
    ```
# Run
```sh
docker compose up
```

- [Open App](http://localhost:3000)
- [Open Api Docs](http://localhost:8080/docs)
