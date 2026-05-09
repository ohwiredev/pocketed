# Product Requirements Document

## Pocketed — Personal Video Library

---

|                  |                           |
| ---------------- | ------------------------- |
| **Product name** | Pocketed                  |
| **Version**      | 1.0                       |
| **Status**       | In development            |
| **Author**       | —                         |
| **Last updated** | May 2026                  |
| **Platform**     | Progressive Web App (PWA) |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals and Success Metrics](#3-goals-and-success-metrics)
4. [Target Users](#4-target-users)
5. [User Flow](#5-user-flow)
6. [Features and Requirements](#6-features-and-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [Database Schema](#8-database-schema)
9. [API and Integrations](#9-api-and-integrations)
10. [Page Structure](#10-page-structure)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Out of Scope](#12-out-of-scope)
13. [Risks and Mitigations](#13-risks-and-mitigations)
14. [Development Phases](#14-development-phases)
15. [Open Questions](#15-open-questions)

---

## 1. Overview

Pocketed is a mobile-first progressive web app that lets users save any video
from TikTok, Instagram, or YouTube and find it again instantly using AI-powered
tagging and search.

The core insight is simple: people discover videos they love while scrolling,
save them somewhere, and then can never find them again. Platform-native save
features are buried, unsearchable, and siloed. Pocketed solves this by being a
single, searchable, cross-platform home for everything a user wants to keep.

**Tagline:** Save any video. Find it in seconds.

---

## 2. Problem Statement

### The problem

Social media platforms are designed for discovery, not retrieval. When a user
saves a video on TikTok, it goes into a private list with no search, no tags,
and no way to filter. The same is true on Instagram and YouTube. After saving
more than a handful of videos, finding a specific one becomes nearly impossible.

Users describe the experience as:

- "I saved it but I can never find it when I need it"
- "I end up re-scrolling for 20 minutes trying to find something I already
  saved"
- "I just save things and forget them"

### Why existing solutions fall short

Platform-native saves are siloed — you cannot search across TikTok and Instagram
at the same time. Competitor apps (ReciMe, Flavorish, Stashcook) focus
exclusively on recipes and extract structured data from videos, which is a
different product category. General bookmarking tools like Pocket or Raindrop
focus on articles and web pages, not short-form video.

There is no well-designed, general-purpose video saving and retrieval tool on
the market.

---

## 3. Goals and Success Metrics

### Product goals

- Give users a reliable way to save any video in under 5 seconds
- Make saved videos findable through natural language search and tags
- Work seamlessly across all devices without requiring a native app install

### Success metrics

| Metric                                | Target                                     |
| ------------------------------------- | ------------------------------------------ |
| Time to save a video                  | Under 5 seconds                            |
| Time to find a saved video            | Under 10 seconds                           |
| Save completion rate                  | Over 80% of initiated saves complete       |
| Day 7 retention                       | Over 40% of new users return within 7 days |
| Videos saved per active user per week | 3 or more                                  |

---

## 4. Target Users

### Primary user

Someone who regularly watches short-form video content on TikTok, Instagram
Reels, or YouTube Shorts and frequently saves videos with the intention of
returning to them — but struggles to find those videos later.

They are comfortable using web apps on both mobile and desktop. They do not want
to install a native app just to save videos.

### User personas

**The collector** Saves a wide variety of content — travel inspiration, fitness
routines, cooking ideas, things to learn. Has hundreds of saved posts across
multiple platforms and can find almost none of them. Wants a single organised
library.

**The recipe saver** Primarily saves cooking videos. Wants to find specific
recipes when they are actually in the kitchen. Currently screenshots or
re-searches for videos they have already found once.

**The fitness enthusiast** Saves workout videos from multiple creators. Wants to
be able to search "upper body no equipment" and get only the relevant videos
they have already saved.

---

## 5. User Flow

### Phase 1 — Onboarding

```
Discover Pocketed → Sign up → Install PWA (mobile) or add bookmarklet (desktop) → Save first video during onboarding → Arrive at home screen with one video already saved
```

The onboarding flow is designed to ensure every new user saves at least one
video before reaching the main app. This eliminates the empty state problem and
creates an immediate aha moment.

### Phase 2 — Save a video

```
User sees video on TikTok / Instagram / YouTube
    ↓
Mobile: tap Share → select Pocketed
Desktop: click bookmarklet in toolbar
Either: paste URL directly into app
    ↓
API detects platform and fetches metadata via oEmbed
    ↓
Claude AI analyses title and description, suggests tags
    ↓
User sees preview card (thumbnail, title, suggested tags)
    ↓
User confirms (optionally edits tags or adds a note)
    ↓
Video saved to database
```

### Phase 3 — Browse and find

```
Open Pocketed → Search by keyword or filter by tag → Browse video card grid → Open video detail → Watch original video / add to collection / edit tags
```

---

## 6. Features and Requirements

### 6.1 MVP features (v1.0)

#### Save a video

- User can paste any TikTok, Instagram, or YouTube URL into the app
- User can save a video via the mobile share sheet (PWA share target)
- User can save a video via a browser bookmarklet on desktop
- On save, the app automatically fetches the video title and thumbnail via
  oEmbed
- On save, Claude AI automatically suggests 3–5 tags based on the video title
  and description
- User can review and edit suggested tags before confirming
- User can add a personal note to any saved video
- If the URL is invalid or unsupported, the user sees a clear error message
- If the video is private or deleted, the user sees a clear error message

#### Browse and search

- User can view all saved videos in a card grid on the home screen
- Each card shows the video thumbnail, title, platform icon, and tags
- User can search across all saved videos by keyword (searches title, tags, and
  notes)
- User can filter by tag using horizontally scrollable filter chips
- Search uses Postgres full-text search — no additional search service required

#### Video detail

- User can open any saved video to see its full detail screen
- Detail screen shows thumbnail, title, platform badge, all tags, personal note,
  and date saved
- User can tap "Watch video" to open the original video on its platform
- User can edit tags and notes on any saved video
- User can delete a saved video

#### User accounts

- User can sign up with email and password
- User can log in and log out
- All data is private — users can only see their own saved videos
- Row level security enforced at the database level

### 6.2 Post-MVP features (v1.1+)

- Collections — group saved videos into named folders (e.g. "Workout ideas",
  "Travel inspo")
- Collection detail page — view and manage all videos within a collection
- Platform filter — filter saved videos by platform (TikTok only, YouTube only,
  etc.)
- PWA offline access — view saved video metadata without an internet connection
- Share a collection — generate a public link to share a collection with another
  user
- Bulk actions — select multiple videos to delete or add to a collection

### 6.3 Explicitly excluded from v1.0

- Video playback inside the app (always opens the original platform)
- Importing existing saved posts from TikTok, Instagram, or YouTube
- Social features (following other users, public profiles)
- Mobile native app (iOS or Android)
- Browser extension

---

## 7. Technical Architecture

### Stack

| Layer             | Technology                               |
| ----------------- | ---------------------------------------- |
| Frontend          | React + Vite                             |
| Hosting           | Netlify                                  |
| Database          | Supabase (PostgreSQL)                    |
| Auth              | Supabase Auth                            |
| File storage      | Supabase Storage (thumbnails)            |
| Backend functions | Supabase Edge Functions                  |
| AI tagging        | Claude API (claude-sonnet-4-6)           |
| Metadata fetching | oEmbed APIs (TikTok, Instagram, YouTube) |

### Architecture overview

All three client types connect through a single API layer. No client
communicates directly with external services.

```
Web app ──────────────────┐
Mobile PWA (share sheet) ──┼──→ API layer → Metadata enricher → Auto-tagger → Database
Bookmarklet ──────────────┘
```

### Save methods

**Mobile — PWA share target**

Registered in `manifest.json`. When the user taps Share on any app, Pocketed
appears in the system share sheet. Tapping it opens the app with the URL
pre-loaded and kicks off the save flow automatically.

```json
{
    "share_target": {
        "action": "/save",
        "method": "GET",
        "params": { "url": "url" }
    }
}
```

**Desktop — Bookmarklet**

A bookmark containing JavaScript that grabs the current page URL and opens
Pocketed's save page with it pre-filled.

```javascript
javascript: (function () {
    window.open(
        "https://pocketed.app/save?url=" +
            encodeURIComponent(window.location.href),
        "_blank",
    );
})();
```

**Direct — Paste URL**

An input field on the save page and home screen where users can paste any video
URL directly.

---

## 8. Database Schema

### `videos`

| Column        | Type      | Notes                        |
| ------------- | --------- | ---------------------------- |
| id            | uuid      | Primary key                  |
| user_id       | uuid      | Foreign key → auth.users     |
| url           | text      | Original video URL           |
| title         | text      | Fetched via oEmbed           |
| thumbnail_url | text      | Fetched via oEmbed           |
| platform      | text      | tiktok / instagram / youtube |
| notes         | text      | User's personal note         |
| created_at    | timestamp | Auto-set on insert           |

### `tags`

| Column   | Type | Notes                                 |
| -------- | ---- | ------------------------------------- |
| id       | uuid | Primary key                           |
| video_id | uuid | Foreign key → videos (cascade delete) |
| label    | text | e.g. "travel", "fitness", "tokyo"     |

### `collections`

| Column     | Type      | Notes                    |
| ---------- | --------- | ------------------------ |
| id         | uuid      | Primary key              |
| user_id    | uuid      | Foreign key → auth.users |
| name       | text      | e.g. "Workout ideas"     |
| created_at | timestamp | Auto-set on insert       |

### `collection_videos`

| Column        | Type | Notes                                      |
| ------------- | ---- | ------------------------------------------ |
| collection_id | uuid | Foreign key → collections (cascade delete) |
| video_id      | uuid | Foreign key → videos (cascade delete)      |
| —             | —    | Composite primary key on both columns      |

### Row level security

All four tables have RLS enabled. Users can only read, write, update, and delete
their own data. The `tags` and `collection_videos` tables are secured by joining
back to the parent table's `user_id`.

---

## 9. API and Integrations

### oEmbed endpoints

| Platform  | Endpoint                                                      |
| --------- | ------------------------------------------------------------- |
| TikTok    | `https://www.tiktok.com/oembed?url={url}`                     |
| Instagram | `https://graph.facebook.com/v17.0/instagram_oembed?url={url}` |
| YouTube   | `https://www.youtube.com/oembed?url={url}&format=json`        |

oEmbed returns the video title, author name, and thumbnail URL without requiring
scraping or platform API keys (for TikTok and YouTube). Instagram requires a
Facebook developer app token.

### Claude AI tagging

When a video is saved, the following prompt is sent to `claude-sonnet-4-6`:

```
A user saved a video with the following details:
Title: {title}
Platform: {platform}

Return a JSON object only with:
- category: one word (fitness/travel/cooking/comedy/learning/music/fashion/gaming/other)
- mood: one or two words (e.g. "motivating", "relaxing", "funny")
- tags: array of 3-5 short searchable keywords

Return JSON only, no explanation.
```

The response is parsed and each tag is inserted into the `tags` table linked to
the video.

### Error handling

| Scenario                 | Behaviour                                                      |
| ------------------------ | -------------------------------------------------------------- |
| Unsupported platform     | Return 400: "We don't support this link yet"                   |
| Private or deleted video | Return 400: "We couldn't read that link. Is the video public?" |
| Invalid URL format       | Reject client-side before API call                             |
| oEmbed API down          | Save URL and title only, skip thumbnail                        |
| Claude API unavailable   | Save video without tags, user can add manually                 |

---

## 10. Page Structure

### Routes

| Route             | Page                                 | Auth required |
| ----------------- | ------------------------------------ | ------------- |
| `/`               | Landing page                         | No            |
| `/login`          | Login                                | No            |
| `/signup`         | Sign up                              | No            |
| `/onboarding`     | Onboarding flow                      | Yes           |
| `/home`           | Home — video card grid               | Yes           |
| `/search`         | Search results                       | Yes           |
| `/save`           | Save flow (share target entry point) | Yes           |
| `/video/:id`      | Video detail                         | Yes           |
| `/collections`    | Collections list                     | Yes           |
| `/collection/:id` | Collection detail                    | Yes           |
| `/profile`        | Profile and settings                 | Yes           |

### Key components

| Component        | Purpose                                           |
| ---------------- | ------------------------------------------------- |
| `VideoCard`      | Thumbnail, title, platform icon, tags             |
| `TagPill`        | Reusable tag badge used across the app            |
| `SaveSheet`      | Bottom sheet modal for the save confirmation flow |
| `SearchBar`      | Global search input with debounce                 |
| `FilterChips`    | Horizontally scrollable tag filter row            |
| `BottomNav`      | Persistent navigation bar on authenticated pages  |
| `CollectionCard` | Collection name, video count, thumbnail mosaic    |

---

## 11. Non-Functional Requirements

### Performance

- Save flow (from URL paste to confirmed save) completes in under 5 seconds on a
  standard mobile connection
- Home screen loads in under 2 seconds for up to 500 saved videos
- Search returns results in under 1 second

### Accessibility

- All interactive elements are keyboard navigable
- Colour contrast meets WCAG AA standards
- Images include descriptive alt text

### Security

- All data access enforced by Supabase row level security
- No video URL or user data is stored in local storage or cookies beyond the
  auth session
- API keys for Claude and oEmbed are stored as Supabase Edge Function
  environment variables — never exposed to the client

### Cross-device compatibility

- Fully functional on iOS Safari, Android Chrome, desktop Chrome, Firefox, and
  Safari
- PWA share target works on iOS Safari 17+ and Android Chrome
- Bookmarklet works on all major desktop browsers

### Hosting and cost

- Netlify free tier covers frontend hosting for the initial launch
- Supabase free tier covers database, auth, storage, and edge functions up to
  50,000 monthly active users
- No custom domain required during development — Netlify subdomain is sufficient
  for testing

---

## 12. Out of Scope

The following are explicitly not being built in v1.0:

- In-app video playback — videos always open on their original platform
- Bulk import of existing saved posts from any platform
- Social or sharing features between users
- Native iOS or Android app
- Browser extension
- Offline video download or caching
- Monetisation or subscription tiers
- Analytics dashboard for users

---

## 13. Risks and Mitigations

| Risk                                         | Likelihood | Impact | Mitigation                                                                  |
| -------------------------------------------- | ---------- | ------ | --------------------------------------------------------------------------- |
| oEmbed API changes or breaks                 | Medium     | High   | Fall back to saving URL and user-provided title; monitor for failures       |
| Instagram oEmbed requires Facebook app token | High       | Medium | Use a Facebook developer app in production; document setup clearly          |
| TikTok in-app browser wraps URLs             | Medium     | Medium | Detect and clean URL patterns server-side before oEmbed call                |
| Claude API latency slows save flow           | Low        | Medium | Run auto-tagging asynchronously; save the video first and tag in background |
| PWA share target not supported on older iOS  | Medium     | Low    | Fall back to bookmarklet; document both methods clearly during onboarding   |
| Supabase free tier limits hit early          | Low        | Medium | Monitor usage; Supabase Pro is $25/month and covers significant growth      |

---

## 14. Development Phases

### Phase 1 — Foundation (Week 1–2)

- Set up React + Vite project
- Connect Supabase (database, auth, storage, RLS)
- Deploy to Netlify
- Build landing page ✅
- Build auth pages (sign up, log in, log out)

### Phase 2 — Core save flow (Week 3–4)

- Build `/save` page and URL input flow
- Implement platform detection and oEmbed metadata fetching via Edge Functions
- Integrate Claude API for auto-tagging
- Build save confirmation screen with tag editing and notes

### Phase 3 — Browse and search (Week 5–6)

- Build home screen with video card grid
- Implement keyword search (Postgres full-text search)
- Implement tag filtering with filter chips
- Build video detail screen with edit and delete

### Phase 4 — Save methods (Week 7)

- Implement PWA manifest and share target for mobile
- Create bookmarklet script and build bookmarklet installation flow in
  onboarding

### Phase 5 — Collections and polish (Week 8+)

- Build collections list and collection detail pages
- Add video-to-collection assignment flow
- UI polish: loading states, empty states, error states
- Cross-device and cross-browser testing

---

## 15. Open Questions

| Question                                                          | Owner       | Status |
| ----------------------------------------------------------------- | ----------- | ------ |
| Does Instagram oEmbed work without a Facebook app token?          | Engineering | Open   |
| Should onboarding be skippable?                                   | Product     | Open   |
| What is the maximum number of tags per video?                     | Product     | Open   |
| Should deleted videos be soft-deleted or hard-deleted?            | Engineering | Open   |
| Do we need a "report broken video" feature for when URLs go dead? | Product     | Open   |
| What happens when a user hits the Supabase free tier limit?       | Engineering | Open   |

---

_Pocketed PRD v1.0 — May 2026_
