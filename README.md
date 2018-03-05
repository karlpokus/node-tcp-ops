# node-tcp-ops
A proposal for a fast, resilient and scalable service architecture. No dependencies.

# requirements
- [x] scalable on the fly
- [x] no inter-service dependencies
- [x] no dependency on startup order
- [x] automagic reconnection

# implementation
- http-client (like a browser)
- http-server and tcp-client (api)
- tcp-server (services)

The browser calls the api which calls service x which responds and the api relays data back to the client. Ports: api http/5001, people tcp/5002, pets tcp/5003.

Clients connect to services on startup and try to reconnect on any socket end event. Services ignore socket end events as they can have multiple connections running. Clients exit (and restart forever) if unsuccessful at connecting to all services. Services and clients exit and restarts on exceptions.

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
GET /hash?str=<string> # get md5 for supplied string from remote api
```
connect directly to service
```bash
# one shot
$ echo -ne '{"cmd":"status"}' | nc <host> <port>
# or interactive mode
$ nc <host> <port>
> {"cmd":"status"}
```

# tests
```bash
$ npm test
```

# todos
- [x] do tests
- [ ] remove watcher from tests
- [ ] validate inputs
- [ ] compare bufferSize to payload before write
- [x] add remote api service
- [ ] add timeout to remote api calls
- [ ] add basic auth
- [ ] add websockets
- [ ] use TLS
- [ ] deploy somewhere, monitor (w appmetrics or keymetrics) and run load-cron
- [x] try nc interactive mode
- [x] use PM2 `watch` for dev
- [ ] add handler for service server `error`, `close`
- [x] api polling for connection
- [x] new service abstraction
- [x] service exit and api reconnect on socket end
- [ ] catch `uncaughtException`, print error and exit?
- [x] run w PM2
- [ ] add middleware to router
- [ ] use `--max-memory-restart` and `--max-restarts`
- [x] service status end point
- [x] connect to services in parallell
- [x] use cluster
- [ ] cluster always keep n workers
- [x] persistant connections between api and services
- [ ] refuse http requests during api reconnection
- [x] make people own pets
- [ ] use persistant db
- [x] make a router
- [x] proper error handling
- [x] figure out how to make `req.pipe(people, { end:false }).pipe(res)` work without ending the people stream
