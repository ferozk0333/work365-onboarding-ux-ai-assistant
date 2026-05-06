# Feature Spec: Onboarding Progress Tracker

## Overview

A persistent UI element (always visible, never hidden behind the assistant panel) that shows the user's current onboarding stage and what comes next. It updates as milestones are completed.

---

## User Stories

- As a new customer, I want to see exactly where I am in the onboarding process at a glance, without opening any panel.
- As a new customer, I want to know what the next step is so I'm never stuck wondering "what do I do now?"
- As a new customer, I want to see which stages I've already completed so I feel a sense of progress.

---

## Onboarding Stages (Mock Data)

The prototype uses a fixed set of stages. In a real system these would be driven by Work365 backend data.

```
Stage 1: Account Setup
  - Step 1.1: Admin account created
  - Step 1.2: Billing details confirmed
  - Step 1.3: Team contacts added

Stage 2: Data Import
  - Step 2.1: Customer list uploaded
  - Step 2.2: Subscription data validated
  - Step 2.3: Historical invoices reviewed

Stage 3: Configuration
  - Step 3.1: Billing contracts configured
  - Step 3.2: CSP Navigator connected
  - Step 3.3: Azure billing set up (if applicable)

Stage 4: Go-Live Validation
  - Step 4.1: Test billing run completed
  - Step 4.2: Provisioning checked
  - Step 4.3: First invoice approved

Stage 5: Training & Handoff
  - Step 5.1: Module training completed
  - Step 5.2: Self-service portal configured
  - Step 5.3: Handoff call scheduled
```

---

## UI Behaviour

### Layout Options (decide in design phase)
- **Option A:** Left sidebar — vertical step list with stage groupings
- **Option B:** Top progress bar — horizontal strip showing stage names, with expandable step details below
- Recommendation: Option A (sidebar) — gives more space for step labels, works better with the right-side assistant panel

### Visual States per Step
- **Completed:** checkmark icon, muted/green color, struck-through or normal text
- **Current:** highlighted, bold, with a "You are here" indicator
- **Upcoming:** normal text, lighter color
- **Blocked:** warning icon (e.g., step requires action before proceeding)

### Interactivity
- Clicking a completed stage expands/collapses its steps.
- Clicking the current step shows a tooltip or inline description of what action is needed.
- No navigation — the tracker is informational only (does not route to different pages in this prototype).

### Update Behaviour
- For the prototype: clicking a "Mark complete" button on a step advances progress (simulates real completion).
- Tracker re-renders on state change without full page reload.

---

## Data Model

```sql
-- onboarding_progress table
id          INTEGER PRIMARY KEY
stage_id    TEXT NOT NULL         -- e.g. "stage_2"
step_id     TEXT NOT NULL         -- e.g. "step_2_1"
stage_name  TEXT NOT NULL
step_name   TEXT NOT NULL
status      TEXT NOT NULL         -- 'completed' | 'current' | 'upcoming' | 'blocked'
order_index INTEGER NOT NULL
updated_at  DATETIME
```

---

## API Contract

### GET /progress

Returns full progress state.

**Response:**
```json
{
  "data": {
    "current_stage": "stage_2",
    "current_step": "step_2_2",
    "stages": [
      {
        "id": "stage_1",
        "name": "Account Setup",
        "status": "completed",
        "steps": [
          { "id": "step_1_1", "name": "Admin account created", "status": "completed" },
          { "id": "step_1_2", "name": "Billing details confirmed", "status": "completed" },
          { "id": "step_1_3", "name": "Team contacts added", "status": "completed" }
        ]
      },
      {
        "id": "stage_2",
        "name": "Data Import",
        "status": "in_progress",
        "steps": [
          { "id": "step_2_1", "name": "Customer list uploaded", "status": "completed" },
          { "id": "step_2_2", "name": "Subscription data validated", "status": "current" },
          { "id": "step_2_3", "name": "Historical invoices reviewed", "status": "upcoming" }
        ]
      }
    ]
  },
  "error": null
}
```

### PATCH /progress/{step_id}

Marks a step as completed and advances the tracker.

**Request:**
```json
{ "status": "completed" }
```

---

## Backend Notes

- `routers/progress.py` — GET and PATCH handlers
- `models/progress.py` — SQLAlchemy model
- On app startup, if DB is empty, seed with initial progress state (Stage 1, Step 1.1 as current)
- The assistant reads current progress from the DB to inject into chat context

---

## Open Questions

- [ ] Should the tracker show an estimated completion percentage or days remaining?
- [ ] Should blocked steps have a direct "Contact support" link?
