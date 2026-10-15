import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { createNotesHandler } from './server/notes'
import type { Plugin } from 'vite'

const notesHandler = createNotesHandler({storagePath:fileURLToPath(new URL('./.local/visitor-notes.json',import.meta.url))})
const visitorNotes: Plugin = {
  name: 'visitor-note-wall',
  configureServer(server) { server.middlewares.use('/api/notes', notesHandler) },
  configurePreviewServer(server) { server.middlewares.use('/api/notes', notesHandler) },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), visitorNotes],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
