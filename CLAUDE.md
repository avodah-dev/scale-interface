# CLAUDE.md

Navigation and coordination guide for AI agents working on the Scale Interface System.

## Project Mission

**Building a 13-station production monitoring system for a sorting and assembly warehouse**

The system enables real-time tracking of employee productivity through Sterling 7600 industrial scales, with touchscreen interfaces at each station and a central dashboard for supervisors to oversee production metrics.

## Repository Structure

### First-Level Folders

- **`agent-coordination/`** - Framework and patterns for human-AI collaboration
- **`mission-tracker/`** - Task management and work coordination system
- **`project-management/`** - Documentation, hardware specs, proposals, and research
- **`src/`** - TypeScript implementation of scale communication system

### Key Project Files

- **`config.json`** - System configuration for serial communication and logging
- **`package.json`** - Node.js dependencies and scripts
- **`tsconfig.json`** - TypeScript compiler configuration
- **`biome.json`** - Code formatting and linting rules

## Development Guidelines

**ALWAYS run `pnpm run check` after making any code changes** to ensure:
- Code passes all linting rules
- Formatting is consistent with project standards
- No TypeScript errors are introduced

If `pnpm run check` fails, run `pnpm run check:fix` to auto-fix issues, then verify the changes.

## Quick Start Navigation

| Need                | Go To                          | Purpose                              |
|---------------------|--------------------------------|--------------------------------------|
| Current tasks       | `mission-tracker/`             | Active work items and priorities     |
| Hardware info       | `project-management/hardware/` | Equipment specifications             |
| Code implementation | `src/`                         | TypeScript scale interface           |
| AI coordination     | `agent-coordination/`          | Collaboration patterns               |
| Project docs        | `project-management/docs/`     | Architecture and decisions           |

## Current Project Status

- **Phase 1a**: ✅ Mock scale testing completed - All success criteria met
- **Phase 1b**: ✅ Hardware validation completed - FTDI adapter tested
- **Phase 2**: ✅ Sterling 7600 validation completed (2025-08-19) - 0% packet loss, <30ms response
- **Phase 3**: 🎯 Full system development - 13 stations + dashboard (current focus)

## Common Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm start               # Run the application
pnpm run check           # Lint and format check
pnpm run check:fix       # Auto-fix formatting issues

# Testing Modes
pnpm start --mode=testing --diagnostics    # Mock scale testing
pnpm start --mode=scale --diagnostics      # Real hardware testing
pnpm start --mode=scale --time=300         # Extended hardware test

# Logging
grep "scale_reading" logs/scale-data-*.log | tail -20  # View recent readings
```

## Navigation Patterns

### For Implementation Work
1. Check `mission-tracker/` for current tasks
2. Review relevant `_info.md` files in target folders
3. Make changes following existing patterns
4. Run `pnpm run check` after code changes
5. Update mission status when complete

### For Research & Understanding
1. Start with folder-level `_info.md` files
2. Follow cross-references to related components
3. Check `project-management/` for specifications
4. Review `agent-coordination/` for collaboration patterns

### For Hardware & Testing
1. See `project-management/hardware/` for equipment specs
2. Check `src/controllers/` for mock vs real controllers
3. Use `config.json` to switch between modes
4. Review test results in `project-management/pre-contract-research/`

## Key Resources

- **Development phases**: `project-management/docs/development-phases.md`
- **Technical requirements**: `project-management/docs/technical-requirements.md`
- **Hardware inventory**: `project-management/hardware/_hardware-info.md`
- **Sterling 7600 manual**: `project-management/hardware/sterling-7600-manual.md`