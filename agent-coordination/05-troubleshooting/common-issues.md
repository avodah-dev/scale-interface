# Troubleshooting Guide - When Things Aren't Working

## Common Problems & Solutions

### "The agent keeps forgetting our conversation"
**Symptoms**: Repeating questions, losing context, contradicting earlier decisions

**Solutions**:
1. **Immediate**: Summarize key decisions at the end of each session
2. **Better**: Create a `decisions.md` file for important choices
3. **Best**: Update CLAUDE.md with permanent rules learned

**Example fix**:
```markdown
## Architecture Decisions
- Database: PostgreSQL (not MySQL) - decided 2024-01-15
- Style: CSS Modules (not styled-components) - see ADR-001
- State: Zustand (not Redux) - for simplicity
```

### "The agent writes code that doesn't match our style"
**Symptoms**: Different patterns, inconsistent formatting, wrong approaches

**Solutions**:
1. **Immediate**: Show an example of the right way
2. **Better**: Create a patterns.md file
3. **Best**: Add linting rules that the agent can check

**Example fix**:
```markdown
## Code Style Quick Reference
Instead of: `if (x) { return true } else { return false }`
Use: `return Boolean(x)`

Instead of: `let data = []; data.push(item)`
Use: `const data = [item]`
```

### "CLAUDE.md isn't helping"
**Symptoms**: Agent still confused, not referencing it, asking same questions

**Diagnosis Questions**:
- Is it too long? (Should be <200 lines)
- Is it too abstract? (Needs specific examples)
- Is it outdated? (Check last update date)

**Fix**:
1. Ask the agent: "What would help you navigate better?"
2. Add the top 3 things it mentions
3. Remove anything it never references

### "Mission tracker feels like overhead"
**Symptoms**: Not updating it, feels like busywork, slowing down

**This means**: You're probably Level 1-2 maturity. Mission tracker is Level 3+.

**Solutions**:
1. **Stop using it** - Seriously, it's optional
2. **Simplify**: Just use a TODO.md file
3. **Wait**: Revisit when managing 3+ parallel tasks

### "Agent makes the same mistake repeatedly"
**Symptoms**: Fixing the same issue multiple times, not learning from corrections

**Solutions**:
1. **Document the anti-pattern**:
```markdown
## ❌ Common Mistakes
- Using `interface{}` in Go - use specific types
- Modifying props directly in React - use state
- SQL queries in loops - use batch operations
```

2. **Add to pre-flight checklist**:
```markdown
## Before Starting Any Task
- [ ] Check if this modifies generated code
- [ ] Check if this needs a migration
- [ ] Check if this affects the API contract
```

### "Too many files, agent gets overwhelmed"
**Symptoms**: Agent asks to see everything, context window errors, confusion

**Solutions**:
1. **Create boundaries**:
```markdown
## Module Boundaries
- Auth system: Only modify files in `src/auth/`
- Payment: Only modify files in `src/payment/`
- Never modify both in one task
```

2. **Use progressive disclosure**:
```markdown
## Start Here
For auth issues: See `src/auth/_auth-info.md`
For payment issues: See `src/payment/_payment-info.md`
For everything else: See `src/_src-info.md`
```

### "The patterns don't fit our project"
**Symptoms**: Fighting the framework, everything feels forced

**This is normal!** The starter kit is DNA, not a prescription.

**Solutions**:
1. **Extract what works**: Maybe just CLAUDE.md is enough
2. **Adapt patterns**: Modify templates to fit your needs
3. **Create your own**: Your patterns > generic patterns

## When to Abandon a Pattern

Stop using a pattern if:
- ❌ You've tried for a week and it's not helping
- ❌ It's adding friction without value
- ❌ Your team actively dislikes it
- ❌ You spend more time maintaining it than it saves

## Level-Specific Issues

### Level 1-2 Projects
**Don't worry about**:
- Multi-agent orchestration
- Complex mission tracking
- Phase separation

**Focus on**:
- Clear file names
- Consistent patterns
- Simple CLAUDE.md

### Level 3 Projects
**Common issues**:
- Context window management
- Cross-file coordination
- State management

**Solutions**:
- Story sharding
- Better _info.md files
- Clear boundaries

### Level 4+ Projects
**Challenges**:
- Agent specialization
- Handoff protocols
- Context density

**Solutions**:
- See philosophy docs
- Study BMAD-METHOD
- Experiment with phases

## Getting Help

If nothing here helps:

1. **Ask the agent**: "What information would help you succeed at this task?"
2. **Check maturity**: You might be trying Level 4 patterns at Level 2
3. **Simplify**: The simplest solution that works is the right solution
4. **Share learnings**: What you discover helps others

## Remember

- 🌱 Patterns are seeds, not rules
- 🔄 Try, measure, adapt
- ⏱️ Give patterns a week before abandoning
- 📈 Progress isn't always linear

The goal isn't perfection - it's sustainable improvement.