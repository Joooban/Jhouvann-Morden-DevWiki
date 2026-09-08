'use strict';

/* ═══════════════════════════════════════════════════
   PROJECTS — single source of truth for project detail
   pages, hover previews, and GitHub badges.

   description: array of paragraph strings
   highlights:  array of bullet strings (may be empty)
   repo:        "owner/name" on GitHub, or null if private
═══════════════════════════════════════════════════ */
window.PROJECTS = {

  'askwhiz': {
    title: 'AskWhiz — Institutional Knowledge Chatbot',
    tagline: 'Undergraduate thesis: a RAG chatbot deployed for MMCM, built on FastAPI with OpenSearch/FAISS retrieval and the Claude API.',
    description: [
      "Morden's undergraduate thesis: a retrieval-augmented generation (RAG) chatbot that answers institutional questions for MMCM, combining vector search over indexed institutional documents with the Claude API for response generation, evaluated using RAGAS."
    ],
    tags: ['FastAPI', 'Amazon OpenSearch', 'Claude API', 'FAISS', 'RAGAS', 'Render'],
    repo: null,
    liveNote: 'Undergraduate thesis project — not publicly released.',
    highlights: []
  },

  'eizou-tracker': {
    title: 'EIZOU Creatives — Production Tracker',
    tagline: 'Full-stack production tracker for a content agency — manages client deliverables, editor workload, deadlines, and multi-platform publish status.',
    description: [
      'A full-stack internal tool built for Eizou Films, a content production agency, to manage the entire lifecycle of client deliverables — from planning through production, review, and publishing across social platforms.',
      "Agencies producing recurring social content (graphics, photos, reels) for multiple clients need to track monthly deliverable quotas per client, where each piece of content sits in the production pipeline, who's working on what, deadlines, revision rounds, and where — or whether — it actually got published. This tool replaces what would otherwise be a spreadsheet."
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    repo: null,
    liveNote: 'Internal tool, deployed privately (Netlify + Render) — not publicly available.',
    highlights: [
      '7-stage task pipeline (Planned → In Production → Internal Review → Client Review → Approved → Scheduled → Published) with priority levels, content type, and quantity tracking',
      'Monthly deliverable quotas per client with live progress bars against actuals',
      'Editor output tracking, a Deadline Watch widget for overdue/upcoming tasks, and versioned revision history',
      'Multi-platform publish tracking (Facebook/Instagram/TikTok) with an interactive, filterable calendar',
      'Diagnosed and fixed a bundle-size issue by code-splitting the calendar view — cut initial JS payload ~44%',
      'Added missing PostgreSQL indexes after identifying full-table-scan queries on foreign keys',
      "Shipped schema changes to a live database with zero downtime using Prisma's diff-review-apply workflow",
      'Entirely hand-authored CSS design system — no Tailwind/MUI — dark, editorial, mono-inspired visual identity'
    ]
  },

  'tasa': {
    title: 'Tasa — Coffee-Life Tracker',
    tagline: 'Flutter app for tracking coffee consumption and spend in the Philippines, with streaks, badges, and shareable monthly summaries — fully local, no backend.',
    description: [
      'A mobile app for logging every cup of coffee you drink — home-brewed or bought at a café — as a lightweight, judgment-free diary. Part brew journal, part café check-in log, part spend tracker, built specifically for the Philippine market: peso-denominated pricing, PH café drinks (Spanish latte, ube latte, sachet 3-in-1) alongside home-brew methods, and a design philosophy that rewards showing up rather than drinking more — no dark-pattern streak guilt.',
      "Originally spec'd and prototyped as a static HTML/CSS/JS mockup, then rebuilt from the ground up as a real, installable Flutter app."
    ],
    tags: ['Flutter', 'Dart', 'Riverpod', 'SQLite'],
    repo: 'Joooban/Tasa',
    highlights: [
      'Instagram-style feed ("Cupboard") — full-width photos, captions, and free-text notes per cup',
      'Streaks with a "Rain Check" safety net that covers one missed day without resetting progress',
      'A shareable, theme-aware "Wrapped" monthly summary with PH-flavored spend comparisons, exportable as a PNG',
      '46+ badges across tiers, computed from pure, unit-tested logic',
      'Fully local — SQLite on-device, no backend, no accounts, no analytics; manual JSON export/import',
      'Every DB schema change ships with an explicit, versioned migration plus automatic pre-migration backups',
      "Debugged a Flutter/Android platform quirk where a DraggableScrollableSheet doesn't resize for the on-screen keyboard"
    ]
  },

  'margatron': {
    title: 'Margatron — Admissions Buddy Chatbot',
    tagline: 'Web-hosted admissions chatbot for MMCM using Gemini API and NLP-based input filtering.',
    description: [
      'A web-hosted admissions chatbot for MMCM prospective students, featuring natural language processing via the Gemini API and nonsense input filtering for more reliable interaction.'
    ],
    tags: ['Python', 'Streamlit', 'Gemini API', 'NLTK'],
    repo: 'vennDiagramm/Group-4-System-Margatron-Admissions-Buddy',
    highlights: []
  },

  'mmcmate': {
    title: 'MMCMate+ Chatbot',
    tagline: 'Campus AI assistant for instant access to MMCM institutional info, with multilingual support and an admin-managed knowledge base.',
    description: [
      'A campus information assistant built using Streamlit and the Gemini API, with an SQLite backend and a Node.js service layer. The system provides MMCM students with rapid access to institutional information through a conversational interface, with multilingual support and an admin-managed knowledge base.'
    ],
    tags: ['Python', 'Streamlit', 'Gemini API', 'Node.js', 'SQLite'],
    repo: 'vennDiagramm/MMCMate_An_AI_Chatbot_for_School_Policy_Assistance',
    highlights: []
  },

  'mpm-forecasting': {
    title: 'MPM Regional Forecasting Application',
    tagline: 'Regional household income forecasting tool applying Meta Prophet and regression models to government datasets.',
    description: [
      "A regional household income forecasting tool integrating Meta's Prophet library and Scikit-learn regression models, applied to government datasets to analyze and project economic indicators across regions."
    ],
    tags: ['Python', 'Streamlit', 'Prophet', 'Scikit-learn', 'Pandas', 'Data visualization'],
    repo: 'Lumerurin/MPM-regional-forecasting-app',
    highlights: []
  },

  'lylas-inventory': {
    title: 'Lylas Smart Inventory Sales',
    tagline: 'Web-based inventory and sales tracking platform with automated low-stock alerts.',
    description: [
      'A web-based item tracking platform featuring stock management functionality and automated alert systems for low-stock threshold detection.'
    ],
    tags: ['Node.js', 'JavaScript', 'SQL'],
    repo: 'Lumerurin/Lylas-Smart-Inventory-Sales',
    highlights: []
  },

  'kitchen-sentinel': {
    title: 'Kitchen Sentinel — Smart Stove & Gas Leak Alert System',
    tagline: 'Mobile app for real-time kitchen hazard detection (gas leaks, flame, motion) with an ESP32 + Arduino sensor node reporting to Firebase.',
    description: [
      'A mobile companion app for real-time kitchen hazard detection targeting elderly users and caregivers. Delivers persistent push notifications for gas leaks, flame presence, and absent motion, paired with an ESP32 + Arduino sensor node — an MQ-2 gas sensor and a PIR motion sensor — reporting live data to Firebase every second.'
    ],
    tags: ['React Native', 'Firebase', 'ESP32', 'Arduino', 'MQ-2', 'PIR', 'IoT', 'Expo'],
    repo: 'vennDiagramm/Kitchen_Sentinel_Smart_Stove_and_Gas_Leak_Alert_System',
    highlights: []
  }

};
