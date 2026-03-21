Define your queries anywhere inside `queries` or `app`
By default these directories are monitored for automatic type generation.
This can be configured in `sanity.cli.ts` in studio.

You can define your groq queries using `groqd` or as plain `qroq` strings.
You can consume queries with `client.fetch` (regular API) or `sanityFetch` (live API).

Note: you only need to watch for changes inside `web` if you are using regular `groq` queries.
(`groqd` only uses the schema file from `studio`)

This template includes `SanityBlock` and `SanityImage` components for rendering rich text and images from Sanity.
Feel free to modify them to suit your needs.
