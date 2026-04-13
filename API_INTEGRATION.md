# LLD Crew API Integration Guide

This document outlines how the frontend application can securely interact with the backend AI evaluation engine. Since the backend runs on **Gradio 4+**, its API endpoints respond using **Server-Sent Events (SSE)**. 

Because LLM evaluation pipelines can take 30–120 seconds to complete, SSE helps keep the HTTP connection alive and prevents standard browser timeouts.

---

## 1. The Two-Step API Lifecycle

The `/gradio_api/call/LLD` endpoint requires a two-step process to trigger and consume the pipeline:
1. **POST Request (Initiation)**: Submit the user data and receive a unique `event_id`.
2. **GET Request (Streaming)**: Connect to the SSE stream using the `event_id` to listen for heartbeats and the final JSON payload.

### Step 1: Initiating the Job (CURL)

First, you make an `application/json` POST request containing the `data` array exactly as mapped in the Python Gradio inputs: `[Diagram XML, User Prompt]`.

```bash
# 1. Send the payload and extract the event_id
curl -X POST http://127.0.0.1:7860/gradio_api/call/LLD \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      "<diagram><classes><class name=\"Test\" type=\"class\"></class></classes></diagram>",
      "Please analyze my UML diagram."
    ]
  }'

# Response Example:
# {"event_id": "c540af89679a429bb56021cec12b0663"}
```

### Step 2: Listening for the Result (CURL)

Using the `event_id` received from Step 1, immediately make an HTTP GET request to stream the SSE (Server-Sent Events).

```bash
# 2. Attach to the Event Stream
curl -N http://127.0.0.1:7860/gradio_api/call/LLD/c540af89679a429bb56021cec12b0663

# Stream Output Example:
# event: heartbeat
# data: null
# 
# event: heartbeat
# data: null
# 
# event: complete
# data: [{"score": {"overall_score": 10}, "description": "..."}]
```

The server keeps sending `event: heartbeat` every 15 seconds to prevent network timeouts. When the workflow finishes, you will receive `event: complete`. The `data` line immediately following it contains the stringified JSON array.

---

## 2. Programmatic Integration (Next.js / Frontend JS)

To implement this manually in your Next.js application, you will first use standard `fetch` to get the Event ID, and then construct an `EventSource` (or use SSE stream readers) to listen to the backend events.

### JavaScript Example Payload

```javascript
/**
 * Submit diagram to AI backend to get evaluated.
 * 
 * @param {string} xmlDiagram - The raw XML string from the frontend diagram canvas
 * @param {string} userContext - Any additional prompt context the user typed
 */
async function evaluateDiagram(xmlDiagram, userContext) {
  
  // STEP 1: POST the inputs to initiate the CrewAI evaluation task
  const initialResponse = await fetch("http://127.0.0.1:7860/gradio_api/call/LLD", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [xmlDiagram, userContext]
    })
  });

  const { event_id } = await initialResponse.json();

  if (!event_id) {
    throw new Error("Failed to receive event_id from AI Engine");
  }

  // STEP 2: Initiate an EventSource connection to listen to the SSE stream 
  return new Promise((resolve, reject) => {
    
    // Connect to the stream using native browser EventSource
    const eventstream = new EventSource(`http://127.0.0.1:7860/gradio_api/call/LLD/${event_id}`);

    // Listen for the "complete" event from Gradio
    eventstream.addEventListener("complete", (event) => {
      // Clean up the connection to preserve memory
      eventstream.close();
      
      // Parse Gradio's array payload
      // result[0] will be the raw python output parsed back into JS objects
      const parsedData = JSON.parse(event.data);
      const outputJson = parsedData[0];
      
      resolve(outputJson);
    });

    // Listen for error occurrences during validation
    eventstream.addEventListener("error", (event) => {
      eventstream.close();
      reject(new Error("AI Engine Encountered an Error"));
    });

    // Optional: Log heartbeats to update UI loading states (e.g., "AI is thinking...")
    eventstream.addEventListener("heartbeat", () => {
      console.log("Still processing...");
    });
  });
}
```

### Alternative: Using the Official Gradio Client

If the frontend team prefers a more robust NPM package instead of writing manual `EventSource` wrappers, they can install the official Gradio JS bindings:

```bash
npm install @gradio/client
# or
yarn add @gradio/client
```

Usage with the client becomes a single asynchronous function call:

```javascript
import { Client } from "@gradio/client";

async function executeCrew() {
  const client = await Client.connect("http://127.0.0.1:7860");
  
  const result = await client.predict("/LLD", { 
    diagram: "<diagram>...</diagram>", 
    user_input: "Analyze this diagram" 
  });

  console.log(result.data); // The parsed output JSON object
}
```

*(Note: If you encounter issues resolving Next.js polyfills with the `@gradio/client` within Edge or Server Components, revert to the manual `fetch` + `EventSource` implementation depicted above.)*
