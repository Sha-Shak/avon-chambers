# Seed content only - not used by the app

The app itself reads Insights and Careers content from Sanity, not from
files in this folder (see `src/lib/content.ts`). These `.md` files are the
original seed content, kept here only so `scripts/migrate-to-sanity.ts` has
something to migrate on first run.

Once you've run the migration and confirmed the content looks right in
`/studio`, this whole `src/content/` folder is safe to delete.
