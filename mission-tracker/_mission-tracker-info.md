# Mission Tracker

**Purpose**: Work coordination and task management for the scale-interface project

## Quick Navigation

| Status | Location | Description |
|--------|----------|-------------|
| Planning | `ToDo/` | Upcoming work items |
| Active | `InProgress/` | Currently being worked on |
| Finished | `Complete/` | Completed missions |
| Overview | `current-missions.md` | Mission status summary |

## Mission Workflow

### 1. Creation (ToDo/)
- New missions start in `ToDo/` folder
- Include clear objective and acceptance criteria
- Reference relevant documentation
- Align with project phases (1a/1b/2/3)

### 2. Activation (InProgress/)
- Move file to `InProgress/` when starting work
- Only one mission should be active per agent/human
- Update `current-missions.md` with status

### 3. Completion (Complete/)
- Move to `Complete/` when acceptance criteria met
- Document any discoveries or follow-up items
- Create new missions for any spawned work

## Mission Structure

Each mission file should include:
```markdown
# Mission: [Clear objective]

**Phase**: [1a/1b/2/3]
**Priority**: [High/Medium/Low]

## Objective
[What needs to be accomplished]

## Context
- Links to relevant docs (_info.md files, CLAUDE.md sections)
- Related missions or dependencies

## Acceptance Criteria
- [ ] Measurable outcome 1
- [ ] Measurable outcome 2

## Affected Components
- Files: [List of files to modify]
- Hardware: [Any hardware requirements]
```

## Cross-References

- **Project docs**: See `../project-management/` for specifications
- **Implementation**: See `../src/` for codebase
- **Coordination**: See `../agent-coordination/` for AI patterns