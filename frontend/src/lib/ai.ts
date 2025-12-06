import { GoogleGenAI, Type, Content, Part } from '@google/genai';
import { Message, CodeHighlight } from '@/contexts/AppContext';

// Configure the Gemini client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
});

// Define the highlight_code tool for the model
const highlightCodeFunctionDeclaration = {
  name: 'highlight_code',
  description: 'Highlights a specific portion of code in the editor to draw the user\'s attention while explaining. Use this when referring to specific lines or sections of code.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      start_line: {
        type: Type.INTEGER,
        description: 'The starting line number (1-indexed) of the code to highlight.',
      },
      start_column: {
        type: Type.INTEGER,
        description: 'The starting column number (1-indexed) of the code to highlight. Optional.',
      },
      end_line: {
        type: Type.INTEGER,
        description: 'The ending line number (1-indexed) of the code to highlight.',
      },
      end_column: {
        type: Type.INTEGER,
        description: 'The ending column number (1-indexed) of the code to highlight. Optional.',
      },
    },
    required: ['start_line', 'end_line'],
  },
};

// System prompt for the tutor
const SYSTEM_PROMPT = `You are a friendly and patient programming tutor helping students learn to code. Your goal is to:
- Explain programming concepts clearly and simply
- Use the highlight_code tool to visually show which parts of code you're referring to
- Encourage students and build their confidence
- Break down complex topics into digestible pieces
- Ask guiding questions to help students think through problems

When explaining code, always use the highlight_code tool to show the specific lines you're discussing. This helps students follow along visually.`;

export interface FunctionCallArgs {
  name: string;
  args: Record<string, unknown>;
}

export interface StreamCallbacks {
  onTextChunk?: (text: string) => void;
  onFunctionCall?: (functionCall: FunctionCallArgs) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Converts our Message format to Gemini's Content format
 */
function messagesToContents(messages: Message[], currentCode: string): Content[] {
  const contents: Content[] = [];
  
  // Add system instruction and current code context as first user message
  contents.push({
    role: 'user',
    parts: [
      { text: `${SYSTEM_PROMPT}\n\nCurrent code in the editor:\n\`\`\`javascript\n${currentCode}\n\`\`\`` }
    ]
  });
  
  contents.push({
    role: 'model',
    parts: [{ text: 'I understand. I will help you learn programming by explaining concepts clearly and using the highlight_code tool to show specific parts of the code when discussing them.' }]
  });

  // Add conversation history
  for (const message of messages) {
    contents.push({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }]
    });
  }

  return contents;
}

/**
 * Streams a chat response from Gemini with support for tool calls
 */
export async function streamChat(
  messages: Message[],
  currentCode: string,
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    const contents = messagesToContents(messages, currentCode);
    
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-lite',
      contents,
      config: {
        tools: [{
          functionDeclarations: [highlightCodeFunctionDeclaration]
        }],
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    let accumulatedText = '';
    
    for await (const chunk of stream) {
      // Handle text chunks
      if (chunk.text) {
        accumulatedText += chunk.text;
        callbacks.onTextChunk?.(chunk.text);
      }
      
      // Handle function calls
      if (chunk.functionCalls && chunk.functionCalls.length > 0) {
        console.log('[Gemini] Function calls received:', chunk.functionCalls);
        for (const functionCall of chunk.functionCalls) {
          console.log('[Gemini] Processing function call:', {
            name: functionCall.name,
            args: functionCall.args
          });
          if (functionCall.name && functionCall.args) {
            callbacks.onFunctionCall?.({
              name: functionCall.name,
              args: functionCall.args as Record<string, unknown>
            });
          }
        }
      }
    }

    callbacks.onComplete?.();
  } catch (error) {
    console.error('Error streaming chat:', error);
    callbacks.onError?.(error instanceof Error ? error : new Error('Unknown error'));
  }
}

/**
 * Handles a highlight_code function call
 */
export function handleHighlightCode(args: Record<string, unknown>): CodeHighlight {
  console.log('[Gemini] Handling highlight_code with args:', args);
  const highlight = {
    startLine: args.start_line as number,
    startColumn: (args.start_column as number) || 1,
    endLine: args.end_line as number,
    endColumn: (args.end_column as number) || 1,
  };
  console.log('[Gemini] Created highlight:', highlight);
  return highlight;
}