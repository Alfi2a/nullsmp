# Totem Of Null — Wiki

## Why it broke on GitHub but worked locally

Your computer (Windows/Mac) treats file names as **case-insensitive**, so
`RoseChestplateTexture.png` and `rosechestplatetexture.png` are "the same
file" to it. GitHub Pages serves files from a **case-sensitive** Linux
server, so a reference to `RoseChestplateTexture.png` will 404 if the actual
file on disk is `rosechestplatetexture.png` — the image (and anything after
it that depends on the page loading cleanly) breaks silently.

`script.js` was pointing at `textures/RoseChestplateTexture.png`, but the
actual file is `textures/rosechestplatetexture.png`. That mismatch is fixed
in this copy. Going forward, keep every filename you reference in lowercase
and type it exactly the same way everywhere.

## How to deploy this to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Upload **all** of these files, keeping the folder structure exactly as-is:
   ```
   index.html
   itemtemplate.html
   script.js
   styles.css
   textures/
     itemslogo.png
     entityslogo.png
     rosechestplatetexture.png
   ```
   The `textures` folder must exist with that exact lowercase name — don't
   let GitHub's drag-and-drop upload flatten it into the repo root.
3. Go to **Settings → Pages** in your repository.
4. Under "Build and deployment", set **Source** to "Deploy from a branch",
   pick the `main` branch and the `/ (root)` folder, then **Save**.
5. Wait a minute or two, then visit the URL GitHub shows you
   (`https://<your-username>.github.io/<repo-name>/`).

## What else changed

- Server IP updated to `totemofnull2.aternos.me` everywhere.
- Branding updated to "Totem Of Null Wiki" on both pages (the item page was
  still saying the generic "Server Wiki").
- Search now shows an actual dropdown of matching items/entities as you
  type, with icons and links straight to the result — instead of only
  silently hiding/showing cards further down the homepage.

## Adding new items

Open `script.js` and add a new entry to the `wikiItems` object, following
the `chestplate-of-rose-thorns` example. Put any new texture in `textures/`
using an all-lowercase filename, and reference it the same way in the
`icon` field.

## Adding entities

The `entities` array in `script.js` is currently empty — that's why the
Entities section and entity search results are blank. Add objects there
(same shape as items) to populate it.
