# Design rationale

**Status:** the owner picked wordmark option "A+D 3" on 2026-11-08 from the brand canvas (https://claude.ai/artifact/NYMFjgMGqApZaEs4CgvoPx). Owner feedback: the first pass was too Western, so this direction is a subtle Western.

1. **Wordmark:** "DIGGS" in Archivo Black, all caps. "Ultra" in Yellowtail script, rust, tilted −7° and hooked under the end of DIGGS. It lives in `src/components/wordmark.tsx` and is sized in em, so it scales anywhere.
2. **Palette:** warm off-white `#f5f1ea`, ink `#161412`, rust `#8a3b1f` (the "Ultra" color and main buttons), sage `#56634b` as a secondary. Dark "night ops" mode: ink background, off-white text, softer ember rust `#d2774c`.
3. **Type:** Archivo Black for headlines, Inter for body and UI. Yellowtail appears only in the wordmark: one Western touch, used once. All three are SIL Open Font License and self-hosted via `next/font`.
4. **Texture and motion:** none. The paper grain and letterpress effects were removed. Only hover color changes; `prefers-reduced-motion` is respected.
5. **Imagery:** real race photos from Diggs's coverage, high contrast, with night shots for night-ops moments. No stock photos.

**Still open:** a finished logo file (SVG) if the owner wants one made from this wordmark.
