# node-tcp-ops
A proposal for a resilient, highly available and scalable service architecture.

# requirements
- [ ] scalable on the fly
- [ ] no inter-service dependencies
- [ ] no dependency on startup order

# implementation
Clients calls an api via http, the api calls service x via tcp and relays data back to client. Available services are people and pets. Ports: api 5001/http, people tcp/5002, pets tcp/5003.

# usage

```bash
# start
$ npm run start
# people
GET /people # returns all
POST /people?name=<string> # creates new person
```

# todos
- [x] run w PM2
- [ ] use cluster
- [ ] cluster always keep n workers
- [x] persistant connections between api and services
- [ ] auto-reconnect on reload
- [ ] make people own pets
- [ ] use persistant db
- [ ] make a router
- [x] figure out how to make `req.pipe(people, { end:false }).pipe(res)` work without ending the people stream
