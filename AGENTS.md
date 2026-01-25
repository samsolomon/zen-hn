# AGENTS.md

Purpose
- This repository currently contains only `README.md` and no build or source files.
- There are no detected build, lint, or test tools to document yet.
- This guide focuses on safe defaults and discovery steps for agentic work.

Repository state
- Root contains: `README.md`, `LICENSE`.
- No `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Makefile`, or similar.
- No Cursor rules in `.cursor/rules/` or `.cursorrules`.
- No Copilot rules in `.github/copilot-instructions.md`.

Commands (discovery first)
- If new files are added, re-scan the repo for build tools.
- Suggested discovery commands (run from repo root):
- `ls`
- `rg "(test|lint|build|format)" -g "*"`
- `rg "(pytest|vitest|jest|go test|cargo test|mix test|mvn test|gradle test)" -g "*"`
- `rg "(Makefile|Justfile|Taskfile|package.json|pyproject.toml|Cargo.toml|go.mod)" -g "*"`

Build / lint / test commands
- Build: Not defined yet.
- Lint: Not defined yet.
- Test: Not defined yet.
- Single test: Not defined yet.

When tools are introduced, update this section with:
- Install command (e.g., `npm install`, `pip install -r requirements.txt`).
- Build command (e.g., `npm run build`, `make build`).
- Lint command (e.g., `npm run lint`, `ruff check .`).
- Test command (e.g., `npm test`, `pytest`).
- Single test command (e.g., `pytest path/to/test.py::test_name`).

Code style guidelines (default until real conventions exist)
General
- Prefer clarity over cleverness; keep functions short and focused.
- Avoid introducing new dependencies unless required.
- Keep modules single-purpose; avoid mixed responsibilities.
- Minimize global state and side effects.

Formatting
- Follow the formatter of the ecosystem once present.
- Default to 2-space indentation for JSON/YAML; 4-space for code unless project says otherwise.
- Keep lines under 100 characters where feasible.
- Use trailing newlines in text files.

Imports
- Group standard library, third-party, then local imports.
- Use stable, deterministic ordering within groups.
- Avoid wildcard imports.
- Prefer explicit names over long alias chains.

Types
- Prefer explicit types in public APIs when the language supports it.
- Avoid `any` or equivalent; narrow types early.
- Use domain-specific types over primitives when helpful (e.g., `UserId` over `string`).

Naming
- Use descriptive, intention-revealing names.
- Functions and methods use verbs; data uses nouns.
- Use consistent casing: `camelCase` for JS/TS, `snake_case` for Python, etc.
- Avoid abbreviations unless well-known in the codebase.

Error handling
- Fail fast on invalid input; validate at boundaries.
- Prefer typed or structured errors when supported.
- Add context when rethrowing errors; preserve original error.
- Avoid silent failures; log or surface actionable messages.

Logging
- Log at boundaries or critical transitions.
- Avoid logging secrets, tokens, or PII.
- Use structured logging when available.

Testing
- Keep tests deterministic; avoid reliance on wall-clock time.
- Use factories or fixtures to reduce test setup noise.
- Prefer testing behavior over implementation details.

Project structure
- Keep files small; split modules when responsibilities grow.
- Co-locate tests with code or in a `tests/` directory once introduced.
- Avoid circular dependencies; keep layering clear.

API design
- Prefer explicit inputs/outputs over hidden globals or singletons.
- Use stable, versioned interfaces when exposing public APIs.
- Validate external input at boundaries; return consistent error shapes.

Performance
- Choose clear algorithms first; optimize only with evidence.
- Avoid unnecessary allocations and repeated work in hot paths.
- If caching is added, document eviction and invalidation behavior.

Security
- Treat all external input as untrusted.
- Never log secrets or PII; redact when necessary.
- Prefer least-privilege defaults for any new config.

Dependencies
- Add new dependencies only when clearly justified.
- Prefer well-maintained libraries with active releases.
- Document why a new dependency was added in the PR or README.

Data and migrations
- Keep data shape changes backward-compatible when possible.
- If migrations are added, make them idempotent and reversible.
- Document any required manual steps.

Configuration
- Keep config in dedicated files or env vars, not hard-coded.
- Document any required env vars in `README.md` when added.

Git hygiene
- Do not rewrite history unless explicitly requested.
- Keep commits focused; do not mix unrelated changes.
- If a file contains secrets, do not commit it.

Documentation
- Add or update docs when behavior changes.
- Prefer short, actionable instructions.

CI and automation
- Keep scripts deterministic and suitable for non-interactive shells.
- Fail fast on missing prerequisites; print actionable errors.

Review checklist (quick self-check)
- Does the change match existing patterns and naming?
- Are error cases handled and user-visible?
- Are new configs documented?
- Are tests added or at least a manual verification note?

If you add tooling, also add in this file:
- Exact commands to build, lint, and test.
- How to run a single test.
- Any repo-specific conventions (imports, formatting, naming).

Agent workflow defaults
- Read `README.md` first.
- Scan root for tool configs and scripts.
- Only run commands you can justify from repo context.
- Keep edits minimal and consistent with existing style.

Future section placeholders
- Build prerequisites:
- Lint rules:
- Test framework:
- Single-test examples:
- Formatting tools:
- Module layout:
- API conventions:
- Error taxonomy:
