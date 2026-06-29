# Project Conventions & Decisions

## Timezone Handling
- **Never use `toISOString().split('T')[0]`** for dates in user-facing features. This returns UTC date, which differs from local date in timezones ahead/behind UTC.
- Use `getFullYear()/getMonth()/getDate()` (local timezone) instead.
- Helper: `localDateStr()` defined in `src/db/workouts.js`.
- For display, use `toLocaleDateString()` which respects the user's locale/timezone.

## Workout Tracking Architecture
- **3-layer hierarchy**: Programs → Weeks → Days → Exercises
- `workout_days` has `week_number` and `day_of_week` columns.
- `exercises` has `program_id` and nullable `day_id`.
- User workout progress stored in `user_workout_progress` with `completed_days` (jsonb array of day_id strings).
- Per-day completion: each program day tracked independently.

## Stats & Tracking
- **Total Workouts** on `/track` counts `completed_days` length from `user_workout_progress` (actual program days completed, not calendar dates).
- **Active Streak** counts consecutive calendar days with workout entries in `workouts` table.
- **Weekly Activity** chart queries `workouts` table, counts distinct dates.
- **Personal Records** parse text reps with `parseReps()` (extracts leading number from strings like "5/side" → 5).

## Movement Builder
- No standalone `/admin/exercises` pages.
- Movement Builder is a slide-over canvas component (`MovementBuilder.jsx`) on `/admin/workout-programs/[id]/edit`.
- Triggered by "Open Builder" button in program edit page header.
- Supports add/remove weeks, days, inline exercise editing.

## Data Storage
- Cloudflare R2 for file storage (not Supabase Storage).
- Stripe hosted Checkout (no Elements).
- Edit pages (not modals) for admin CRUD.
- Reusable admin components: DataTable, AdminForm, StatCard.
- Backend for storage, local computation for logic (TDEE, meal plans).

## Workout DB Functions (`src/db/workouts.js`)
- `upsertUserWorkoutProgress(userId, { program_id, day_id, completed_exercises, weights })` — appends day_id to `completed_days` array (deduped).
- `getWeeklyActivity(userId)` — workouts per day last 7 days (distinct dates).
- `getWorkoutStreak(userId)` — consecutive calendar day streak.
- `getWorkoutStats(userId)` — total distinct dates + recent 10 workouts.
- `getUserWorkouts(userId)` — all workout records for PR computation.
- `getUserWorkoutProgress(userId)` — all program progress records.
- `createWorkout(workout)` — inserts single exercise entry to `workouts` table.
