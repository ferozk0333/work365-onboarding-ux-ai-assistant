# Feature Spec: Learning Sessions

## Overview

After key onboarding milestones are reached (specifically after Stage 4: Go-Live Validation), the progress tracker surfaces optional training lessons. Users opt into lessons relevant to them. Each lesson is short, interaction-based, delivered inside the assistant panel. Lessons are replayable at any time.

---

## User Stories

- As a new customer who just went live, I want to take a short lesson on subscription management so I can handle it myself without always calling support.
- As a new customer, I want to be able to replay a lesson I took last week because I forgot part of it.
- As a new customer, I want to choose which lessons are relevant to my situation — not be forced through all of them.

---

## Lesson Library (MVP)

Three lessons for the prototype:

### Lesson 1: Understanding Your Billing Cycle
- **Trigger:** Available after Stage 4 (Go-Live Validation) complete
- **Duration:** ~5 min
- **Topics:** Billing contracts, anchor dates, proration, invoice generation
- **Format:** 4–5 assistant messages with comprehension check questions

### Lesson 2: Managing Subscriptions
- **Trigger:** Available after Stage 4 complete
- **Duration:** ~5 min
- **Topics:** Adding/removing seats, mid-cycle changes, subscription states, the Un-invoiced Changelog
- **Format:** 4–5 assistant messages with scenario-based questions

### Lesson 3: Using the Self-Service Portal
- **Trigger:** Available after Stage 5 Step 2 (portal configured) complete
- **Duration:** ~5 min
- **Topics:** Portal access, order approvals, invoice downloads, user management
- **Format:** 4–5 assistant messages with walkthrough prompts

---

## Lesson Structure

Each lesson is a structured conversation script stored in `backend/knowledge_base/lessons/` as JSON or markdown:

```json
{
  "lesson_id": "lesson_billing_cycle",
  "title": "Understanding Your Billing Cycle",
  "available_after": "stage_4",
  "steps": [
    {
      "type": "assistant_message",
      "content": "Welcome to the Billing Cycle lesson! Let's start with the basics. A **billing contract** in Work365 defines when and how your invoices are generated..."
    },
    {
      "type": "comprehension_check",
      "question": "Quick check: what do you think determines the date your invoice is generated each month?",
      "hint_after_seconds": 30,
      "hint": "Think about the term 'anchor date' — we just mentioned it above."
    },
    {
      "type": "assistant_message",
      "content": "Exactly — it's the **billing anchor date**. Here's why that matters for you..."
    }
  ]
}
```

---

## UI Behaviour

### Discovery (Progress Tracker)
- When lessons become available, a "Training available" badge appears in the progress tracker (Stage 5 area).
- Clicking it shows a list of available lessons with: title, estimated duration, completion status.

### Starting a Lesson
- User clicks "Start" on a lesson card.
- Assistant panel opens (if closed).
- A system message appears: "Starting lesson: Understanding Your Billing Cycle"
- Lesson steps are delivered sequentially by the assistant.

### Replaying a Lesson
- Any completed lesson shows a "Replay" button in the lesson list.
- Replay starts fresh — clears lesson-specific message history, does not affect other chat history.

### Lesson Completion
- After the final step, the assistant says: "You've completed this lesson! Feel free to ask me any follow-up questions."
- Lesson is marked complete in the DB.
- User can still ask free-form questions after a lesson ends.

---

## Data Model

```sql
-- lessons table (static, seeded on startup)
id          TEXT PRIMARY KEY      -- e.g. "lesson_billing_cycle"
title       TEXT NOT NULL
available_after TEXT NOT NULL    -- stage ID that unlocks this lesson
duration_min INTEGER
content_path TEXT NOT NULL       -- path to JSON lesson script

-- lesson_progress table
id          INTEGER PRIMARY KEY
lesson_id   TEXT NOT NULL
status      TEXT NOT NULL        -- 'locked' | 'available' | 'in_progress' | 'completed'
current_step INTEGER DEFAULT 0
completed_at DATETIME
```

---

## API Contract

### GET /lessons

Returns all lessons with their availability and completion status.

**Response:**
```json
{
  "data": {
    "lessons": [
      {
        "id": "lesson_billing_cycle",
        "title": "Understanding Your Billing Cycle",
        "status": "available",
        "duration_min": 5,
        "current_step": 0
      }
    ]
  },
  "error": null
}
```

### POST /lessons/{lesson_id}/start

Begins or resumes a lesson. Returns the first (or current) step content.

### POST /lessons/{lesson_id}/next

Advances to the next step. The assistant renders the content from the lesson script, not from live LLM generation (keeps lessons deterministic and fast).

### PATCH /lessons/{lesson_id}/complete

Marks a lesson as completed.

---

## Implementation Notes

- Lesson content is **pre-written** (not LLM-generated at runtime) — this ensures consistency across users and fast delivery.
- The `POST /chat` endpoint has a `lesson_mode: true` flag — when set, the assistant uses lesson script content instead of RAG.
- Free-form questions during a lesson still go through the full RAG pipeline.

---

## Open Questions

- [ ] Should lessons be completable out of order, or gated (must finish Lesson 1 before Lesson 2)?
- [ ] Should comprehension check questions be evaluated by the LLM or just acknowledged and moved forward?
- [ ] How many lessons for user testing? 3 is MVP minimum — can add more before May 6.
