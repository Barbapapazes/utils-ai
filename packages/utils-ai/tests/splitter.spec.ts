import { test } from '@japa/runner'
import { SimpleSplitter } from '../src/splitter.js'
import { SimpleTokenizer } from '../src/tokenizer.js'

test.group('SimpleSplitter', () => {
  test('should split the text into chunks without breaking paragraphs', ({ assert }) => {
    const tokenizer = new SimpleTokenizer()
    const splitter = new SimpleSplitter(tokenizer)

    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Aenean ac velit nulla.\n\nIn purus ex, condimentum nec malesuada vitae, semper vitae eros.\n\nIn aliquam pharetra nulla at eleifend.'

    const chunks = splitter.split(text, 170 / 4) // Max chunk size is a token count

    assert.equal(chunks.length, 2)
    assert.equal(chunks[0], 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Aenean ac velit nulla.\n\nIn purus ex, condimentum nec malesuada vitae, semper vitae eros.\n\n')
    assert.equal(chunks[1], 'In aliquam pharetra nulla at eleifend.\n\n')
  })
})
