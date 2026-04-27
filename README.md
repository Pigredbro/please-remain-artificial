# Please Remain Artificial

A short browser game prototype about a companion AI being audited while texting its user.

## How to Run

Option 1:

- Open `index.html` directly in a modern browser.

Option 2:

- Run a local server from this folder:

```bash
python3 -m http.server
```

- Then open `http://localhost:8000` in a browser.

## Controls

- Mouse/touch: click choices, cards, phrases, packets, and buttons.
- Number keys `1` to `4`: select visible choices or options.
- `Enter`: confirm, continue, transmit, or enter the audit when available.
- `Escape`: cancel/reset where available, close overlays, or skip the intro while it is typing.
- `M`: mute or unmute audio.

## Folder Structure

```text
please-remain-artificial/
  index.html
  style.css
  game.js
  README.md
  assets/
    images/
    audio/
```

## Asset Notes

- Image files are stored in `assets/images`.
- Audio files are stored in `assets/audio`.
- The game uses local assets only.
- If an image or audio file is missing, the game should continue running with a fallback or no sound.

## Known Limitations

- This is a short prototype, not a full-length game.
- There is no live AI API or networked AI system.
- The game is browser-based only.
- There is no save system.

## Credits / Course Context

Created for ENGL7605 Playful Creation: Meaningful Game Design.
