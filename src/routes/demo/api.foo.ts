import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/api/foo')({
  server: {
    handlers: {
      GET: () => {
        return new Response('bar')
      }
    }
  }
})
