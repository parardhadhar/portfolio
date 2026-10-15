import { createNotesHandler } from '../v2/server/notes.ts';

// Configure a durable Redis REST store for the deployed wall. Local preview
// uses an atomic file store through the same handler in vite.config.ts.
export default createNotesHandler({remoteRequired:true});

