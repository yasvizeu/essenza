// ssr-entry.ts (ou server.ts)

import '@angular/localize/init'; // ← Isso é CRUCIAL aqui!

// Depois importe sua aplicação:
import './src/main.ts'; // ou './src/main.server.ts' se tiver setup SSR
