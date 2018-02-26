# node-tcp-ops
A proposal for a fast, resilient and scalable service architecture.

# requirements
- [ ] scalable on the fly
- [x] no inter-service dependencies
- [x] no dependency on startup order
- [x] automagic reconnection

# implementation
- http-client (like a browser)
- http-server and tcp-client (api)
- tcp-server (services)

The browser calls the api which calls service x which responds and the api relays data back to the client. Ports: api http/5001, people tcp/5002, pets tcp/5003. Clients poll for connections during startup and any socket end event. Clients exit (and restart forever) if unsuccessful at connecting to all services. Services and clients exit and restarts on exceptions.

# usage
start the show
```bash
$ npm start
```
api
```bash
GET /people # returns people
POST /people?name=<string> # creates person
GET /people/pets?owner=<string> # returns pets by owner
GET /status # check status for all services
```
connect directly to service
```bash
$ echo -ne '{"cmd":"status"}' | nc localhost 5002
```

# todos
- [ ] try nc interactive mode
- [ ] use PM2 `watch` for dev
- [ ] add action for service server `error`, `close`
- [x] api polling for connection
- [x] new service abstraction
- [ ] service exit and api reconnect on socket end
- [ ] api retry connecting when service socket end
- [ ] catch `uncaughtException`, print error and exit?
- [x] run w PM2
- [ ] use `--max-memory-restart <mem>`
- [x] service status end point
- [ ] connect to services in parallell
- [ ] use cluster
- [ ] cluster always keep n workers
- [x] persistant connections between api and services
- [ ] auto-reconnect on reload
- [ ] refuse http requests during api reconnection
- [ ] make people own pets
- [ ] use persistant db
- [x] make a router
- [ ] proper error handling
- [x] figure out how to make `req.pipe(people, { end:false }).pipe(res)` work without ending the people stream
