# Taste

- Organizes language/parser support in per-language subdirectories (e.g. `src/languages/v/`) with a single top-level entry per language, keeping the shared language list clean so more languages can be added without pollution. Confidence: 0.75
- Prefers committing generated/intermediate build artifacts (e.g. generated Lezer parser files like `v.parser.js`, `v.parser.terms.js`) to version control rather than gitignoring them. Confidence: 0.7
