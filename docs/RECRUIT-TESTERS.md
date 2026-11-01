# Getting The Shift in front of students

**Goal for round one:** 20 nursing students finish at least one shift and send the debrief survey. Not 200 visitors. 20 finishers.

Each link below carries its own tag, so the feedback export (`source` column) and PostHog show which channel brought people who actually finished. Send people straight to the game (`/play/`), not the landing page: one less tap.

| Channel | Link |
|---|---|
| Classmates / people you know | https://the-shift-claude-rework.vercel.app/play/?utm_source=friends&utm_campaign=beta1 |
| Instructors / programs | https://the-shift-claude-rework.vercel.app/play/?utm_source=faculty&utm_campaign=beta1 |
| Reddit | https://the-shift-claude-rework.vercel.app/play/?utm_source=reddit&utm_campaign=beta1 |
| Discord / GroupMe | https://the-shift-claude-rework.vercel.app/play/?utm_source=discord&utm_campaign=beta1 |
| TikTok / Instagram bio | https://the-shift-claude-rework.vercel.app/play/?utm_source=social&utm_campaign=beta1 |

## The messages

### Text or DM to a student you know (highest yield, do these first)

> Hey! I built a free game that simulates a nursing shift: you take report, prioritize 4 patients, and one of them quietly gets worse. It's built around the NGN clinical judgment steps for NCLEX. Would you play one shift (~15 min) and tap the 3 questions at the end? Honest answers help way more than nice ones.
> [friends link]

Ask each one: *"Know 2 classmates who'd try it?"* That's how you get from 5 to 20.

### Class GroupMe / Discord (ask a student to post it, it lands better than you posting)

> Free NCLEX/NGN practice that's actually a game: work a med-surg, psych, peds or ED shift, decide who needs you first, and see the consequences. It's in beta and the creator (an RN) reads every piece of feedback. Takes ~15 min, works on your phone, no account needed.
> [discord link]

### Reddit (r/StudentNurse, r/NCLEX; read each sub's self-promo rules first)

**Title:** I'm an RN and built a free shift simulator for NGN clinical judgment. Looking for brutal feedback from students.

> I'm a psych RN (Hopkins MSN). Question banks never taught me the part that's actually hard: four patients at once and noticing the one who's quietly getting worse. So I built a game where you take report, walk the hall, prioritize, and your patients improve or deteriorate based on what you notice. Every decision maps to the six NGN clinical judgment steps.
>
> It's free, browser-based, works on your phone, no sign-up. It's a beta and **not clinically validated yet**, so if you find something clinically wrong, there's a "Report a problem" button on every decision and I read all of them.
>
> What I want to know: too easy or too hard? Does it help with NGN-style thinking? What's confusing?
>
> [reddit link]

Then answer every comment within a few hours. Engagement in the first hour decides whether the post gets seen.

### Email to a nursing instructor or program

**Subject:** Free NGN clinical judgment simulator: would your students try it?

> Hi Professor [name],
>
> I'm an RN (Johns Hopkins MSN, inpatient psych) and I've built The Shift, a free browser game where students work a simulated shift: take report, prioritize four patients, and see consequences of what they notice or miss. Each decision maps to the NCSBN clinical judgment model, and the debrief shows performance by NGN step.
>
> It's in beta. I'm looking for a handful of students to play one 15-minute shift and answer three questions. If it's useful, instructors can also make a class code and see results (no student emails required).
>
> Would you be open to sharing it with a section, or taking a look yourself first?
> [faculty link]  ·  Instructor guide: [link to docs/INSTRUCTOR-GUIDE.md or a PDF]
>
> Thanks,
> Nick Forell, RN

## Week one

1. **Day 1:** run `supabase/feedback.sql`, merge, test one row yourself (docs/FEEDBACK-LOOP.md).
2. **Day 1–2:** text 10 students you know. Ask each for two more.
3. **Day 3:** Reddit post in one sub. Hold the second sub for a few days and use what you learned.
4. **Day 3:** email 3 instructors.
5. **Day 5:** export the CSV and hand it to Claude (docs/FEEDBACK-LOOP.md). Fix the top 2–3 things.
6. **Day 7:** tell the people who gave feedback what you changed. That's what turns testers into fans.

## Don'ts

- Don't drop the "not clinically validated" line until reviewer sign-offs are in (docs/PILOT-CHECKLIST.md §5).
- Don't ask for feedback on everything. The three debrief questions plus "Report a problem" is enough.
- Don't add features from round-one notes before you see a pattern across at least 3 players.
