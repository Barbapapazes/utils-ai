export interface Tokenizer {
  /**
   * Count the tokens in the text
   * @param text Text to count
   */
  count(text: string): number
}

export class SimpleTokenizer implements Tokenizer {
  count(text: string): number {
    return text.length / 4
  }
}
