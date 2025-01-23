// Replace 'ws://your-websocket-server' with your WebSocket server address
const ws = new WebSocket("ws://localhost:8001/ws");

// Set the interval for sending pings (e.g., every 30 seconds)
const pingInterval = 30000;
let pingTimeout;

// Function to send a ping and set up a timeout for the pong response
function sendPing() {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send("ping");
    console.log("Ping sent to server.");

    // Set a timeout to detect if pong is not received
    pingTimeout = setTimeout(() => {
      console.error("Pong not received within 30 seconds. Closing connection.");
      ws.close();
    }, pingInterval);
  }
}

// Event listener for successful connection
ws.onopen = () => {
  console.log("Connected to the WebSocket server.");

  // Start sending pings at regular intervals
  setInterval(sendPing, pingInterval);
};

// Event listener for incoming messages
ws.onmessage = (event) => {
  const message = event.data;
  console.log("Received message:", message);

  // Handle pong responses
  if (message === "pong") {
    console.log("Pong received from server.");
    // Clear the pong timeout upon receiving a pong
    clearTimeout(pingTimeout);
  } else {
    // Process other messages as needed
  }
};

// Event listener for connection closure
ws.onclose = (event) => {
  console.log(
    `Connection closed. Code: ${event.code}, Reason: ${event.reason}`,
  );
  // Attempt reconnection or handle closure as needed
};

// Event listener for errors
ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

// Function to send messages to the server
function sendMessage(message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
    console.log("Message sent to server:", message);
  } else {
    console.error("Unable to send message. WebSocket is not open.");
  }
}
