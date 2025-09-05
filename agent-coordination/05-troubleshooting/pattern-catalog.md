# Coordination Toolkit - Optional Patterns

Choose patterns that match your project's complexity and needs. Start with 1-2 patterns, add more as coordination challenges arise.

## 📚 Documentation System (_info.md pattern)
**When to use**: Multi-file projects where agents need navigation help  
**Complexity**: Low  
**Setup time**: 1-2 hours  
**Value**: Dramatically reduces agent confusion and repeated questions

### Skeleton Template
Create `_[folder-name]-info.md` in each major folder:

```markdown
# [Folder Name] - Navigation Guide

**Purpose**: [One-line description of what this folder contains]

## Which File Do I Need?

| Task | File | Purpose |
|------|------|---------|
| [Common task 1] | `filename.ts` | [What it does] |
| [Common task 2] | `other-file.ts` | [What it does] |
| [Common task 3] | `helper.ts` | [Shared utilities] |

## Key Files

- **main-file.ts** ([~100 lines]): Core logic for [what]
  - `mainFunction()`: [What it does]
  - `helperFunction()`: [What it does]

- **types.ts** ([~50 lines]): Type definitions
  - `MainType`: [What it represents]
  - `ConfigType`: [Configuration structure]

## Integration Points

- Uses: `../other-folder/helper.ts` for [what]
- Used by: `../parent/orchestrator.ts` for [what]
- Related docs: `../docs/concept.md`

## Common Issues

- **Issue**: [Common problem]  
  **Solution**: [How to fix]
```

### Implementation Tips
- Keep under 100 lines for efficiency
- Focus on navigation, not explanation
- Update when structure changes significantly

---

## 🎯 Mission Tracker System
**When to use**: Managing multiple tasks or coordinating agent work  
**Complexity**: Medium  
**Setup time**: 2-3 hours  
**Value**: Clear task organization and handoff capability

### Skeleton Structure
```
mission-tracker/
├── ToDo/
│   ├── _ToDo-info.md
│   └── [mission-name].md
├── InProgress/
│   ├── _InProgress-info.md
│   └── [active-mission].md
├── Complete/
│   ├── _Complete-info.md
│   └── [done-mission].md
├── _mission-tracker-info.md
└── completion-protocol.md
```

### Mission Spec Template
`mission-tracker/ToDo/implement-feature-x.md`:

```markdown
# Mission: [Feature/Fix Name]

## Objective
[Clear description of what needs to be accomplished]

## Acceptance Criteria
- [ ] [Specific measurable outcome]
- [ ] [Another measurable outcome]
- [ ] Tests pass / lint clean

## Context
- Related to: [Link to issue/doc]
- Depends on: [Other work if any]
- Complexity: [S/M/L]

## Technical Approach
[Brief outline if known, or "TBD - agent to determine"]

## Notes
[Any special considerations, gotchas, or context]
```

### Folder Info Templates

`_ToDo-info.md`:
```markdown
# ToDo Queue

Missions ready to start. Move to InProgress when beginning work.
Prioritize based on current project goals.
```

`_InProgress-info.md`:
```markdown
# Active Missions

Currently being worked on. Include status updates here.
Only 1-2 missions should be active at once.
```

---

## 🚀 Agent-Ramp System (Advanced)
**When to use**: Multiple specialized agents or complex handoffs  
**Complexity**: High  
**Setup time**: 4-5 hours  
**Value**: Rapid agent onboarding and role clarity

### Skeleton Structure
```
mission-tracker/Agent-Ramp/
├── _Agent-Ramp-info.md
├── ramp-technical.md
├── ramp-documentation.md
├── ramp-review.md
└── ramp-oversight.md (if using coordinator)
```

### Ramp Template
`ramp-technical.md`:

```markdown
# Technical Implementation Ramp

## Quick Context
You're implementing code changes in [project]. Start with CLAUDE.md for navigation.

## Key Locations
- Source code: `src/`
- Tests: `tests/` or `__tests__/`
- Types: `src/types/`

## Before Starting
1. Read the mission spec in `mission-tracker/InProgress/`
2. Check existing patterns in similar files
3. Verify test approach with user

## Common Patterns
- [Pattern 1]: [How it's typically done]
- [Pattern 2]: [Another common approach]

## Quality Checklist
- [ ] Tests added/updated
- [ ] Linting passes
- [ ] Documentation updated if needed
- [ ] No console.logs left

## Handoff Notes
If handing to another agent, document:
- What was completed
- What remains
- Any blockers or decisions needed
```

---

## 🚫 Anti-Patterns Documentation
**When to use**: Domain has common misconceptions or pitfalls  
**Complexity**: Low  
**Setup time**: Build as you learn (ongoing)  
**Value**: Prevents repeated mistakes

### Template
`docs/anti-patterns.md`:

```markdown
# Anti-Patterns and Common Pitfalls

## [Domain Area]

### ❌ Anti-Pattern: [What people incorrectly assume]
**Why it seems right**: [Reasoning that leads to this]  
**Why it's wrong**: [Actual situation]  
**Correct approach**: [What to do instead]  
**Example**: [Specific case showing the issue]

### ❌ Anti-Pattern: [Another misconception]
**Why it seems right**: [...]  
**Why it's wrong**: [...]  
**Correct approach**: [...]  
**Example**: [...]
```

---

## 📊 System Maturity Assessment
**When to use**: Want to track and improve coordination capabilities  
**Complexity**: Medium  
**Setup time**: 2 hours initial, 30 min per assessment  
**Value**: Objective progress tracking and improvement identification

### Skeleton Structure
```
system-coordination-maturity/
├── README.md
├── assessment-method.md
├── logs/
│   └── YYYY-MM-DD-assessment.md
└── checklists/
    ├── level-1.md
    ├── level-2.md
    └── level-3.md
```

### Assessment Template
`logs/2024-01-15-assessment.md`:

```markdown
# Maturity Assessment

Date: 2024-01-15
Assessed by: [Name/Agent]

## Scores (0-3 scale)
- Level 1 (Autocomplete): [0-3]
- Level 2 (Conversational): [0-3]  
- Level 3 (Agent-First): [0-3]
- Level 4 (Multi-Agent): [0-3]
- Level 5 (Autonomous): [0-3]

Overall: Level [N] (highest where all lower levels ≥2)

## Evidence
- Level 1: [Specific examples]
- Level 2: [Specific examples]
- Level 3: [Specific examples]

## Gaps Identified
1. [Gap]: [How to address]
2. [Gap]: [How to address]

## Next Actions
- [ ] [Specific improvement]
- [ ] [Another improvement]
```

---

## 📋 Decision Tables Pattern
**When to use**: Multiple valid approaches for similar problems  
**Complexity**: Low  
**Setup time**: 30 minutes per table  
**Value**: Rapid decision making without analysis paralysis

### Template
Add to relevant documentation:

```markdown
## Which Approach Should I Use?

| Scenario | Approach | Why | Example |
|----------|----------|-----|---------|
| [Condition 1] | Use [Method A] | [Reasoning] | `code.example()` |
| [Condition 2] | Use [Method B] | [Reasoning] | `other.pattern()` |
| [Condition 3] | Use [Method C] | [Reasoning] | See `file.ts` |
| [Edge case] | Special handling | [Why different] | [Example] |
```

---

## 📈 Mission Metrics Pattern (Experimental)
**When to use**: Want to track mission complexity and agent effectiveness  
**Complexity**: Low  
**Setup time**: 5 minutes per mission  
**Value**: Learn what works, identify friction points

### Template
Add to mission specs:

```markdown
## Metrics (Pre-Mission)
- Complexity: [S/M/L/XL]
- Estimated Interactions: [1-2 / 3-5 / 6-10 / 10+]
- Risk Level: [Low/Medium/High]
- Parallelizable: [Yes/No - why]

## Metrics (Post-Mission)
- Actual Interactions: [number]
- Files Changed: [number]
- Lines Modified: [+lines/-lines]
- Major Corrections: [0/1/2+]
- Blockers Hit: [list any]
- Time to Complete: [hours/days]

## Learnings
[What worked well, what didn't, what to do differently]
```

### Usage Notes
- Start simple - even just tracking S/M/L complexity helps
- Build up metrics as you learn what matters
- Look for patterns after 10-20 missions
- Share learnings with team

---

## 🎓 Implementation Guide

### Start Small (Week 1)
1. Add `CLAUDE.md` to root
2. Create 2-3 `_info.md` files in critical folders
3. Set up basic `mission-tracker/` structure

### Expand as Needed (Month 1)
- Add more `_info.md` files as agents get confused
- Document first anti-patterns as they're discovered
- Consider agent-ramp if using multiple AI assistants

### Mature Practices (Month 2+)
- Run first maturity assessment
- Implement specialized ramps
- Add decision tables to complex areas

### Remember
- Each pattern is independent - use what helps
- Adapt templates to your project's needs
- Less documentation that's accurate beats more that's stale