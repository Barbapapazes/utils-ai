import { test } from '@japa/runner'
import { SimpleTokenizer } from '../src/tokenizer.js'

test.group('SimpleTokenizer', () => {
  test('should return the number (integer) of tokens', ({ assert }) => {
    const tokenizer = new SimpleTokenizer()

    const count = tokenizer.count('hello world')

    assert.equal(count, 3)
  })
})
