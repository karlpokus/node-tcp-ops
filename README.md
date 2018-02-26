# node-tcp-ops
A proposal for a resilient, highly available and scalable service architecture.

# requirements
- [ ] scalable on the fly
- [x] no inter-service dependencies
- [ ] no dependency on startup order

# implementation
Clients calls an api via http, the api calls service x via tcp and relays data back to client. Available services are people and pets. Ports: api 5001/http, people tcp/5002, pets tcp/5003.

# usage

```bash
# start
$ npm run start
# services
GET /people # returns people
POST /people?name=<string> # creates person
GET /people/pets?owner=<string> # returns pets by owner
# check
GET /status # checks sockets
```

# todos
- [x] api polling for connection
- [x] new service abstraction
- [ ] service exit and api reconnect on socket end
- [ ] api retry connecting when service socket end
- [x] run w PM2
- [ ] use `--max-memory-restart <mem>`
- [x] service status end point
- [ ] connect to services in parallell
- [ ] use cluster
- [ ] cluster always keep n workers
- [x] persistant connections between api and services
- [ ] auto-reconnect on reload
- [ ] make people own pets
- [ ] use persistant db
- [x] make a router
- [ ] proper error handling
- [x] figure out how to make `req.pipe(people, { end:false }).pipe(res)` work without ending the people stream
