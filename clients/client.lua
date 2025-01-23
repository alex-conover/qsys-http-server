Server = require("HttpServer")

local function pprint(obj)
    if type(obj) == "table" then
        print(require("rapidjson").encode(obj, { pretty = true }))
    elseif type(obj) ~= "string" then
        print(tostring(obj))
    else
        print(obj)
    end
end

local server = Server.New()

--Set Middleware
server:use(Server.Cors())
server:use(Server.Json())

--Hello World Route
server:get("/", function(req, res)
    pprint(req)
    res.send("Hello World!")
end)


--Start WS Handler
server:ws("/ws", function(ws)
  ws.Connected = function()
    pprint("Websocket Connected | Client IP: " .. ws.PeerAddress)
    ws.Write(ws, "Hello, from QSYS Lua Websocket Server!")
  end

  ws.Data = function( data )
    -- add data handler func here
    pprint("Rx: " .. data)
  end

  ws.Error = function(err)
    pprint("WebSocket error: " .. err)
  end

  ws.Closed = function()
    pprint("WebSocket closed")
  end

end)



--Start HTTP Listenr
server:listen(8001)
