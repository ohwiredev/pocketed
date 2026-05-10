# Collections Page Requirements

## Page Goal

Give users a way to group their saved videos into named collections so they can
organise and browse their library by theme — for example "Workout ideas",
"Travel inspo", or "Things to learn."

---

## Layout

The page has two states:

### Empty state

User has no collections yet.

- Illustration or icon
- Heading: "No collections yet"
- Subtext: "Group your saved videos into collections to find them faster"
- A single "Create collection" button

### Populated state

User has at least one collection.

- A grid of collection cards (2 columns on mobile, 3–4 on desktop)
- A "New collection" button — top right corner or floating action button

---

## Collection Card

Each card in the grid shows:

| Element             | Details                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Cover**           | A 2x2 mosaic of the four most recently saved video thumbnails in that collection. If fewer than 4 videos, fill remaining slots with a solid teal placeholder |
| **Collection name** | Bold, below the cover                                                                                                                                        |
| **Video count**     | e.g. "12 videos" in smaller muted text below the name                                                                                                        |
| **Tap action**      | Navigates to `/collection/:id`                                                                                                                               |

---

## Create Collection Flow

Tapping "New collection" opens a **modal** (not a new page) with:

- A text input: "Collection name"
- A "Create" button — disabled until the name field has at least 1 character
- A "Cancel" button or tap outside to dismiss
- On submit, the new collection appears immediately in the grid (optimistic UI)
- Maximum collection name length: 50 characters

---

## Collection Detail Page `/collection/:id`

When a user taps a collection card they go to the detail page which shows:

- Collection name as the page heading with an edit (pencil) icon beside it
- Video card grid of all videos in that collection — same card design as the
  home page
- An "Add videos" button that opens a modal to pick from saved videos not
  already in this collection
- A back button to return to `/collections`

---

## Edit and Delete

### Rename a collection

- Tapping the pencil icon on the detail page makes the collection name inline
  editable
- Pressing enter or tapping away saves the new name

### Delete a collection

- Accessible via a three-dot menu on the collection card (long press on mobile,
  hover on desktop)
- Deleting a collection does **not** delete the videos inside it — they remain
  in the user's library
- A confirmation prompt before deleting: "Delete this collection? Your videos
  will not be deleted."

---

## Adding Videos to a Collection

Two entry points:

1. From the **collection detail page** via the "Add videos" button
2. From the **video detail page** via the "Add to collection" button Both open
   the same modal:

- A searchable list of the user's saved videos not already in that collection
- Checkbox selection — user can add multiple at once
- "Add selected" button at the bottom
- Videos appear in the collection immediately on confirm

---

## Removing a Video from a Collection

- On the collection detail page, each video card has a three-dot menu with
  "Remove from collection"
- Removing a video from a collection does **not** delete it from the library
- No confirmation prompt needed — this is a low-stakes action

---

## Data Requirements

### Reads from

- `collections` — all collections belonging to the current user
- `collection_videos` — to get the video count and thumbnail previews per
  collection
- `videos` — to get thumbnail URLs for the mosaic cover

### Writes to

- `collections` — on create, rename, delete
- `collection_videos` — on add or remove a video from a collection

---

## Edge Cases

| Scenario                                                | Behaviour                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| Collection name already exists                          | Allow it — no uniqueness constraint needed                            |
| User tries to add a video already in the collection     | Hide it from the add modal                                            |
| All videos in a collection are deleted from the library | Collection remains but shows empty state                              |
| User has no saved videos when creating a collection     | Create the collection, show empty state with "Save some videos first" |
| Very long collection name                               | Truncate with ellipsis on the card, show full name on detail page     |
