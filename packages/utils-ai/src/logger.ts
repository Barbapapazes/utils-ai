import { createConsola } from 'consola'

export const logger = createConsola({
  fancy: true,
  defaults: {
    tag: 'utils-ai',
  },
})
