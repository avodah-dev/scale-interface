# Mission Tracker - Example Structure

## Minimal Version (Recommended Start)

```
mission-tracker/
├── README.md                 # Workflow rules
├── current-missions.md       # Active priorities
├── ToDo/                    # Future work
│   └── improve-docs.md      # Example mission spec
├── InProgress/              # Active work
│   └── (empty initially)
└── Complete/                # Finished work
    └── (empty initially)
```

## Example Files

### mission-tracker/README.md
```markdown
# Mission Tracker

## Workflow
1. All work starts as mission spec in `ToDo/`
2. Move to `InProgress/` when starting work
3. Move to `Complete/` when done with PR/commit ref

## Rules
- Only 2-3 missions in InProgress at once
- Mission specs must have acceptance criteria
- Reference InProgress spec in first message to agent
```

### mission-tracker/current-missions.md
```markdown
# Current Missions

## Priority Order
1. **Improve Documentation** - Add navigation aids → `ToDo/improve-docs.md`
2. **Add Tests** - Increase coverage → `ToDo/add-tests.md`

## In Progress
- (none yet)

## Recently Completed
- (none yet)
```

### mission-tracker/ToDo/improve-docs.md
```markdown
# Mission: Improve Documentation

**Complexity**: Standard  
**Created**: 2025-01-08

## Objective
Add _*-info.md navigation files to main code folders

## Acceptance Criteria
- [ ] Create _components-info.md with file navigation
- [ ] Create _services-info.md with file navigation  
- [ ] Update CLAUDE.md to reference new info files
- [ ] Each info file under 100 lines

## Approach
1. Analyze folder structure
2. Create navigation table for each
3. Add "Which file do I need?" section
4. Include integration points

## Files Affected
- src/components/_components-info.md (new)
- src/services/_services-info.md (new)
- CLAUDE.md (update)
```

## With Agent Ramps (Optional Enhancement)

```
mission-tracker/
├── README.md
├── Agent-Ramps/             # Optional: specialized protocols
│   ├── ramp-documentation.md
│   └── ramp-feature.md
├── current-missions.md
├── ToDo/
├── InProgress/
└── Complete/
```

### Example: mission-tracker/Agent-Ramps/ramp-documentation.md
```markdown
# Agent Ramp: Documentation Work

## Protocol
1. Read CLAUDE.md for navigation patterns
2. Check reference-first documentation principles
3. Maintain 50-100 line limit per file
4. Use "See File.ts:45" pattern for references

## Deliverables
- Navigation-focused documentation
- No code duplication
- Cross-references between related docs
```

## Evolution Path

### Start Simple
```
ToDo/ → InProgress/ → Complete/
```

### Add When Needed
- Agent-Ramps/ (when you have different work types)
- Archive/ (when Complete/ gets full)
- Templates/ (when you want consistency)

### Signs You Need More Structure
- Missions getting lost or forgotten
- Unclear acceptance criteria
- Inconsistent quality
- Parallel work conflicts

## Tips

1. **Start with 3-5 missions** in ToDo to establish the pattern
2. **Keep specs focused** - one clear objective per mission
3. **Reference files** that will be affected
4. **Update current-missions.md** weekly
5. **Review Complete/** monthly and archive