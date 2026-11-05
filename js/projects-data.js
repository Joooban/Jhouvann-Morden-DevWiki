'use strict';

/* ═══════════════════════════════════════════════════
   PROJECTS — single source of truth for project detail
   pages, hover previews, and GitHub badges.

   description: array of paragraph strings
   highlights:  array of bullet strings (may be empty)
   repo:        "owner/name" on GitHub, or null if private
═══════════════════════════════════════════════════ */
window.PROJECTS = {

  'draftcast': {
    title: 'Draftcast — League of Legends Win Predictor',
    tagline: 'Explainable win predictor for ranked League games, built on 24k matches from the Riot API, showing that the first 15 minutes matter far more than the draft.',
    description: [
      'A web app that asks how much a ranked League of Legends game is decided in champion select, compared with the first 10 or 15 minutes. You pick a draft or type in the scoreboard, and Draftcast gives each team\'s win chance in plain language ("Blue is favored: 68%, mostly because Blue leads by 2,300 gold"), along with a waterfall chart showing exactly how much each factor moved it.',
      'It runs on 24,683 high-elo ranked matches collected from the Riot Games API. The answer turned out to be that the draft barely matters: it\'s close to a coin flip, while the state of the game at 15:00 predicts the winner 74% of the time. Along the way it also found that a dragon is worth more than a tower and that Blue side has no real advantage.'
    ],
    tags: ['Python', 'scikit-learn', 'LightGBM', 'pandas', 'FastAPI', 'React', 'TypeScript', 'Vite', 'SQLite', 'Riot API', 'Render'],
    repo: 'Joooban/Draftcast',
    live: 'https://draftcast.onrender.com',
    liveLabel: 'draftcast.onrender.com (free Render tier, first load takes ~30s)',
    highlights: [
      'Logistic regression for three modes: draft (15 features: champion win rates, five lane matchups, bot-lane synergy, champion classes, damage types), game state at 10:00 or 15:00 (13 features), and combined',
      'LightGBM benchmarked against it and trailed by 0.004–0.015 AUC everywhere, so it never cleared the +0.01 bar set for switching; the interpretable model runs the app',
      'Leakage control: out-of-fold win rates, a test set taken from the newest patch, and a unit test that checks no test-patch match feeds the saved stats',
      'Exact explanations, not approximations: each feature adds coefficient × standardized value in log-odds, so the waterfall bars sum to the prediction',
      'Blank fields handled by fitting a model on only the fields given, then scoring and caching it, so the accuracy shown is always for the model that made the prediction',
      'Rate-limited, resumable collector: at least 1.25s between calls, honors Retry-After, saves progress in SQLite',
      '140 Python tests, including an end-to-end run of the whole pipeline on synthetic data',
      'FastAPI backend serves the React build, deployed as one Render service from render.yaml'
    ],
    sections: [
      {
        heading: 'Data',
        items: [
          'Official Riot API, ranked solo/duo, SG2 server, Emerald and above, covering about 3 patches (16.18–16.21)',
          'Collected 25,454 matches; 24,683 were usable after removing remakes, early surrenders and games with unclear roles'
        ]
      },
      {
        heading: 'Results (test patch 16.21)',
        table: {
          head: ['Model', 'AUC', 'Accuracy'],
          rows: [
            ['Draft only', '0.529', '51.7%'],
            ['Game state at 10:00', '0.755', '68.7%'],
            ['Game state at 15:00', '0.821', '74.2%'],
            ['Combined', '0.823', '74.5%']
          ]
        }
      },
      {
        heading: 'Statistics',
        items: [
          'At 15:00, with gold held equal, the odds ratio is 1.32 per dragon vs 0.92 per tower (Wald test, p ≈ 10<sup>−50</sup>)',
          'Blue side wins 49.6% of games (p = 0.17), so there\'s no real side advantage',
          'Drift check: draft accuracy drops within a single patch (AUC 0.534 → 0.515), while the game-state model holds steady'
        ]
      }
    ]
  },

  'lead-finder': {
    title: 'Lead Finder — Lead Generation & Outreach CRM',
    tagline: 'Web app that finds local businesses, digs up their contact details, scores how much they need marketing help, and tracks outreach.',
    description: [
      'Lead Finder is a full-stack lead generation tool built for EIZOU FILMS, a creative agency in Davao City. It finds businesses by type and area through OpenStreetMap (Nominatim and Overpass), crawls each business\'s own website, respecting robots.txt, to find email addresses and social links, and checks each email domain\'s mail records (MX).',
      'Each lead receives a 0–100 "hot score" in which every point carries a stated reason, such as no website, an outdated site, or no social media. Leads move through a drag-and-drop pipeline (New, Sent, Replied, Won, Lost) with follow-up reminders, templated emails that open in Gmail, a map view, analytics, and saved searches that re-run weekly. The app runs entirely on free tiers: Vercel, Supabase and OpenStreetMap.',
      '<b>Problem.</b> Finding and qualifying small-business leads by hand meant hours of searching maps, checking websites and tracking replies in spreadsheets.'
    ],
    tags: ['Next.js', 'React 19', 'TypeScript', 'PostgreSQL', 'Supabase', 'Drizzle ORM', 'Tailwind CSS', 'dnd-kit', 'Leaflet', 'Recharts', 'Vitest', 'Playwright', 'Vercel'],
    repo: 'Joooban/lead-finder',
    live: 'https://lead-finder-5myo.vercel.app',
    liveLabel: 'lead-finder-5myo.vercel.app (private tool, sign-in required)',
    highlights: [
      'Row-level security on every table: queries run as the signed-in user inside a transaction that sets the role and claims, and composite foreign keys stop rows from referencing another user\'s data',
      'A Postgres work queue instead of a paid job service: FOR UPDATE SKIP LOCKED claims, stale-claim recovery, retry limits and time budgets that fit serverless limits',
      'SSRF protection in the crawler: blocks private, loopback, link-local and IPv4-mapped addresses, checks every redirect hop, and never fetches Facebook, Instagram or TikTok',
      'Resilience: public map servers fall back to a mirror, every request has a timeout, and stuck searches are detected and marked failed',
      '331 tests across 50 files: pure modules written test-first, database tests running real migrations against in-memory Postgres (PGlite), HTTP mocked with MSW, browser tests in Playwright',
      'Each build phase went through an independent code review'
    ],
    sections: [
      {
        heading: 'What it does',
        items: [
          '<b>Search:</b> pick a niche and an area. Nominatim resolves the area to a boundary, and a single Overpass query returns the businesses. Duplicates and do-not-contact entries are skipped',
          '<b>Enrichment:</b> a polite crawler respects robots.txt, uses an identifying User-Agent, and caps each request at 10 seconds, 2 MB, 3 redirects and 4 pages per site. It extracts emails (including obfuscated <i>name [at] domain</i> forms), social links and site facts (HTTPS, mobile viewport, builder, © year, load time). Emails are verified by syntax, a disposable-domain list and DNS MX lookup, without SMTP probing',
          '<b>Scoring:</b> a pure, configurable rules engine (13 weighted signals with mutual exclusions) gives a score from 0 to 100 plus a "why" breakdown. Weights are editable, and saving them rescores every lead in one batched transaction',
          '<b>Pipeline:</b> a Kanban board (dnd-kit) with optimistic updates, an activity timeline, notes, tags, follow-up dates and do-not-contact',
          '<b>Outreach:</b> templates with merge fields ({business_name}, {top_reason}…), with Copy and Open-in-Gmail buttons',
          '<b>Insight:</b> a Leaflet map with clustered pins (supercluster), a Recharts dashboard (reply/win rates, funnel, score distribution), CSV export, and a Ctrl+K command palette',
          '<b>Automation:</b> a daily Vercel cron sends follow-up reminders, re-runs saved searches and finishes leftover enrichment'
        ]
      },
      {
        heading: 'By the numbers',
        items: [
          'About 8,200 lines of TypeScript and 3,600 lines of tests',
          '7 build phases, 6 database migrations, 71 commits'
        ]
      }
    ]
  },

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
