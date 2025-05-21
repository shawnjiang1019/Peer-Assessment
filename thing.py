import http.client

conn = http.client.HTTPSConnection("dev-4m08esq3iy51y7tm.us.auth0.com")

payload = "{\"client_id\":\"PBQnnApGyNMQWOrnQgGJQtyViuOgf6pJ\",\"client_secret\":\"WRPTW8ebD_hvUDwB6AKos7S-1xL7PygYvOWp147gvpKpclO9D214CjdCpJb0yOJk\",\"audience\":\"https://peerassessment.com\",\"grant_type\":\"client_credentials\"}"

headers = { 'content-type': "application/json" }

conn.request("POST", "/oauth/token", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))