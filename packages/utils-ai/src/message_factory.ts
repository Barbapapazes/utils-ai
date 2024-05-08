export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface MessagesFactory {
  define: (messages: Message[]) => Message[]
}

export class SimpleMessagesFactory implements MessagesFactory {
  define(messages: Message[]): Message[] {
    return messages
  }
}
