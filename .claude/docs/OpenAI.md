# OpenAI Node.js SDK Documentation

The official TypeScript and JavaScript library for the OpenAI API.

## Installation

```bash
npm install openai
```

## Basic Usage

### Responses API (Primary)

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const response = await client.responses.create({
  model: 'gpt-4o',
  instructions: 'You are a coding assistant that talks like a pirate',
  input: 'Are semicolons optional in JavaScript?',
});

console.log(response.output_text);
```

### Chat Completions API

```typescript
const completion = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'developer', content: 'Talk like a pirate.' },
    { role: 'user', content: 'Are semicolons optional in JavaScript?' },
  ],
});

console.log(completion.choices[0].message.content);
```

## Streaming

### Server Sent Events (SSE) Streaming

```typescript
const stream = await client.responses.create({
  model: 'gpt-4o',
  input: 'Say "Sheep sleep deep" ten times fast!',
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
```

### Streaming with Runner

```typescript
const runner = client.chat.completions
  .stream({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Say this is a test' }],
  })
  .on('message', (message) => console.log(message));

const finalContent = await runner.finalContent();
```

## Structured Outputs

### Using Zod for Auto-parsing

```typescript
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const Step = z.object({
  explanation: z.string(),
  output: z.string(),
});

const MathResponse = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

const completion = await client.chat.completions.parse({
  model: 'gpt-4o-2024-08-06',
  messages: [
    { role: 'system', content: 'You are a helpful math tutor.' },
    { role: 'user', content: 'solve 8x + 31 = 2' },
  ],
  response_format: zodResponseFormat(MathResponse, 'math_response'),
});

const message = completion.choices[0]?.message;
if (message?.parsed) {
  console.log(message.parsed.steps);
  console.log(`answer: ${message.parsed.final_answer}`);
}
```

## Function Calling

### Using runTools

```typescript
const runner = client.chat.completions
  .runTools({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'How is the weather this week?' }],
    tools: [
      {
        type: 'function',
        function: {
          function: getCurrentLocation,
          parameters: { type: 'object', properties: {} },
        },
      },
      {
        type: 'function',
        function: {
          function: getWeather,
          parse: JSON.parse,
          parameters: {
            type: 'object',
            properties: {
              location: { type: 'string' }
            }
          }
        }
      }
    ]
  })
  .on('message', (message) => console.log(message));

const finalContent = await runner.finalContent();
```

### With Zod Validation

```typescript
import { zodFunction } from 'openai/helpers/zod';

const GetWeatherParameters = z.object({
  location: z.enum(['Boston', 'New York City', 'Los Angeles', 'San Francisco']),
});

const runner = client.chat.completions
  .runTools({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: "How's the weather in LA?" }],
    tools: [
      {
        type: 'function',
        function: {
          function: getWeather,
          parse: GetWeatherParameters.parse,
          parameters: zodToJsonSchema(GetWeatherParameters),
        },
      },
    ],
  });
```

## File Handling

### File Uploads

```typescript
import fs from 'fs';
import { toFile } from 'openai';

// Using Node.js streams (recommended)
await client.files.create({ 
  file: fs.createReadStream('input.jsonl'), 
  purpose: 'fine-tune' 
});

// Using Web File API
await client.files.create({ 
  file: new File(['my bytes'], 'input.jsonl'), 
  purpose: 'fine-tune' 
});

// Using fetch Response
await client.files.create({ 
  file: await fetch('https://somesite/input.jsonl'), 
  purpose: 'fine-tune' 
});

// Using toFile helper for buffers
await client.files.create({
  file: await toFile(Buffer.from('my bytes'), 'input.jsonl'),
  purpose: 'fine-tune',
});
```

## Assistants API

### Creating and Running an Assistant

```typescript
const assistant = await client.beta.assistants.create({
  name: "Math Tutor",
  instructions: "You are a personal math tutor.",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-4o"
});

const thread = await client.beta.threads.create();

const run = client.beta.threads.runs
  .stream(thread.id, { assistant_id: assistant.id })
  .on('textCreated', (text) => process.stdout.write('\nassistant > '))
  .on('textDelta', (textDelta) => process.stdout.write(textDelta.value))
  .on('toolCallCreated', (toolCall) => 
    process.stdout.write(`\nassistant > ${toolCall.type}\n\n`)
  );
```

### Polling Methods

```typescript
// Create and poll until completion
const run = await client.beta.threads.runs.createAndPoll(
  thread.id,
  { assistant_id: assistant.id }
);

// Submit tool outputs and poll
const runWithOutputs = await client.beta.threads.runs.submitToolOutputsAndPoll(
  thread.id,
  run.id,
  { tool_outputs: [...] }
);
```

## Error Handling

```typescript
try {
  const job = await client.fineTuning.jobs.create({
    model: 'gpt-4o',
    training_file: 'file-abc123'
  });
} catch (err) {
  if (err instanceof OpenAI.APIError) {
    console.log(err.request_id);
    console.log(err.status); // 400
    console.log(err.name); // BadRequestError
    console.log(err.headers); // {server: 'nginx', ...}
  } else {
    throw err;
  }
}
```

## Request Configuration

### Timeouts

```typescript
// Global timeout
const client = new OpenAI({
  timeout: 20 * 1000, // 20 seconds (default is 10 minutes)
});

// Per-request timeout
await client.chat.completions.create(
  { messages: [...], model: 'gpt-4o' },
  { timeout: 5 * 1000 }
);
```

### Retries

```typescript
// Global retry configuration
const client = new OpenAI({
  maxRetries: 0, // default is 2
});

// Per-request retry
await client.chat.completions.create(
  { messages: [...], model: 'gpt-4o' },
  { maxRetries: 5 }
);
```

### Custom Fetch Options

```typescript
const client = new OpenAI({
  fetchOptions: {
    // Any standard RequestInit options
    headers: { 'Custom-Header': 'value' }
  },
});
```

## Pagination

```typescript
// Automatic iteration across all pages
for await (const fineTuningJob of client.fineTuning.jobs.list({ limit: 20 })) {
  console.log(fineTuningJob);
}

// Manual pagination
let page = await client.fineTuning.jobs.list({ limit: 20 });
for (const fineTuningJob of page.data) {
  console.log(fineTuningJob);
}

while (page.hasNextPage()) {
  page = await page.getNextPage();
  // Process page data
}
```

## Azure OpenAI

```typescript
import { AzureOpenAI } from 'openai';
import { getBearerTokenProvider, DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const scope = 'https://cognitiveservices.azure.com/.default';
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

const openai = new AzureOpenAI({
  azureADTokenProvider,
  apiVersion: '2024-10-01-preview',
});

const result = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Say hello!' }],
});
```

## Realtime API (Beta)

### WebSocket Connection

```typescript
import { OpenAIRealtimeWS } from 'openai/beta/realtime/ws';

const rt = new OpenAIRealtimeWS({ 
  model: 'gpt-4o-realtime-preview-2024-12-17' 
});

rt.on('error', (err) => {
  console.error('Error:', err);
});

rt.socket.on('open', () => {
  rt.send({
    type: 'session.update',
    session: {
      modalities: ['text'],
      model: 'gpt-4o-realtime-preview',
    },
  });

  rt.send({
    type: 'conversation.item.create',
    item: {
      type: 'message',
      role: 'user',
      content: [{ type: 'input_text', text: 'Hello!' }],
    },
  });

  rt.send({ type: 'response.create' });
});

rt.on('response.text.delta', (event) => process.stdout.write(event.delta));
rt.on('response.done', () => rt.close());
```

## Advanced Features

### Accessing Request IDs

```typescript
const completion = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Say this is a test' }],
  model: 'gpt-4o',
});
console.log(completion._request_id); // req_123
```

### Raw Response Access

```typescript
const { data: modelResponse, response: raw } = await client.responses
  .create({ model: 'gpt-4o', input: 'say this is a test.' })
  .withResponse();

console.log(raw.headers.get('X-My-Header'));
console.log(modelResponse);
```

### Proxy Configuration

```typescript
// Node.js with undici
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new OpenAI({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});

// Bun
const client = new OpenAI({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

## API Reference Summary

### Main APIs

- **Responses**: `client.responses.create()`, `.retrieve()`, `.delete()`, `.cancel()`
- **Chat Completions**: `client.chat.completions.create()`, `.parse()`, `.stream()`, `.runTools()`
- **Embeddings**: `client.embeddings.create()`
- **Files**: `client.files.create()`, `.retrieve()`, `.list()`, `.delete()`, `.content()`
- **Fine-tuning**: `client.fineTuning.jobs.create()`, `.retrieve()`, `.list()`, `.cancel()`
- **Assistants**: `client.beta.assistants.create()`, `.retrieve()`, `.update()`, `.list()`, `.delete()`
- **Threads**: `client.beta.threads.create()`, `.retrieve()`, `.update()`, `.delete()`
- **Runs**: `client.beta.threads.runs.create()`, `.stream()`, `.poll()`, `.submitToolOutputs()`
- **Vector Stores**: `client.beta.vectorStores.create()`, `.files.upload()`, `.fileBatches.uploadAndPoll()`

### Helper Methods

- **Polling**: Methods ending in `AndPoll()` for long-running operations
- **Streaming**: Methods with `.stream()` for real-time data
- **Parsing**: `.parse()` with Zod schemas for structured outputs
- **Tool Running**: `.runTools()` for automated function calling