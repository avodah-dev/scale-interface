# Immediate Wins - Tasks You Can Do TODAY

## 10-Minute Wins (Do These First)

### Win #1: Create a Code Tour
**Problem**: "Agent doesn't understand my project structure"
**Solution**: Add this to your CLAUDE.md:
```markdown
## Quick Tour
- Business logic: `src/services/`
- UI components: `src/components/`
- Data models: `src/types/`
- Configuration: `config/`
Start exploring from `src/index.ts`
```
**Result**: Agent stops asking "where is X?" constantly

### Win #2: Document Your Worst File
**Problem**: "Agent always breaks this one complex file"
**Solution**: Add a comment block at the top:
```javascript
/**
 * AGENT NOTICE: This file manages [what it does]
 * - DO NOT modify the state machine directly
 * - All changes go through dispatch() 
 * - See tests for examples: state.test.js
 */
```
**Result**: 80% fewer breaking changes to that file

### Win #3: Create a "Don't Do This" List
**Problem**: "Agent keeps making the same mistakes"
**Solution**: Add to CLAUDE.md:
```markdown
## ⚠️ Never Do These
- Don't use `any` type - we use strict typing
- Don't modify `generated/` files - they're auto-generated
- Don't add new dependencies without asking
- Don't delete test files to "fix" failing tests
```
**Result**: Agent learns your rules immediately

## 30-Minute Wins (After First Success)

### Win #4: Pattern Library
**Problem**: "Agent doesn't follow our patterns"
**Solution**: Create `patterns.md`:
```markdown
# Our Patterns

## Adding a New API Endpoint
1. Define types in `types/api.ts`
2. Add endpoint to `services/api.ts`
3. Create hook in `hooks/useApi.ts`
4. Add tests to `__tests__/api.test.ts`

Example: See commit abc123 for "Add user endpoint"
```
**Result**: Consistent implementation every time

### Win #5: Success Criteria Templates
**Problem**: "Agent says 'done' but it's not really done"
**Solution**: In your missions, always include:
```markdown
## Success Criteria
- [ ] Feature works (manual test)
- [ ] Tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Follows existing patterns
```
**Result**: Complete implementations, not partial ones

### Win #6: Context Preservation
**Problem**: "Agent forgets what we discussed"
**Solution**: End each session with:
```markdown
## Session Summary
Today we:
1. Fixed the login bug (auth.ts:45)
2. Added validation (validator.ts)
3. Next: Update tests for new validation

Key decision: We chose regex over library for email validation
```
**Result**: Next session starts where you left off

## 1-Hour Wins (Building Momentum)

### Win #7: Living Documentation
**Problem**: "Documentation is always outdated"
**Solution**: Reference-first approach:
```markdown
## How Authentication Works
See implementation: `auth/handler.ts:23-45`
See tests: `auth/handler.test.ts`
See types: `types/auth.ts`

Key insight: We use JWT with refresh tokens
```
**Result**: Documentation that can't be outdated

### Win #8: Error Pattern Guide
**Problem**: "Agent doesn't know how to handle our errors"
**Solution**: Document your error philosophy:
```markdown
## Error Handling
- User errors: Return 4xx with helpful message
- System errors: Return 5xx, log details
- Always use error boundaries in React
- Example: `utils/errors.ts:ErrorHandler`
```
**Result**: Consistent error handling

## Measuring Success

You know it's working when:
- ✅ Less time explaining, more time building
- ✅ Agent asks clarifying questions instead of guessing
- ✅ You can hand off tasks completely
- ✅ Code review comments decrease
- ✅ "Where is X?" questions stop

## Pro Tips

1. **Start with your biggest pain point** - What wastes the most time?
2. **Document by reference** - Point to code, don't duplicate
3. **Update when you notice friction** - Don't pre-optimize
4. **Share wins with your team** - Success spreads

## When These Don't Work

If a pattern isn't helping after a week:
- It might be too complex for your maturity level
- Your project might not need it
- Try a simpler version first

Remember: Every project is different. These are starting points, not rules.