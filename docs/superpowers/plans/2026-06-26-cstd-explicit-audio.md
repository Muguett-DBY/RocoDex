# Plan: CSTD Explicit Audio

## Stage

Long 6-stage run, stage 6 / 6, `IMPROVE`.

## Steps

1. Add a failing policy test for removing automatic BGM activation from the landing component.
2. Remove the global audio activation listener and page-load BGM attempt.
3. Adjust sound control behavior so it explicitly starts idle enabled audio and stops active audio.
4. Update idle status copy.
5. Run focused tests, full local gates, browser audio-policy verification, diff check, commit, push, CI, and Vercel checks.

## Verification Targets

- `npm test -- src/lib/cstd-audio-policy.test.ts`
- `npm test -- src/lib/cstd-intro-sound.test.ts`
- `npm run lint`
- `npm test`
- `npm run build`
- Browser check with a fake `Audio` constructor proving no audio construction before clicking the sound control and BGM construction after clicking.
