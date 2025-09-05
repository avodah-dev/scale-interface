# Starting Prompt - Your First Message to an AI Assistant

## Quick Start (Copy & Paste This)

Use this as your first message when starting with any AI assistant (Claude, ChatGPT, Cursor, etc.):

---

**For a New Project:**

```
I want to set up my project for better human-AI collaboration using the Agentic Engineering Coordination patterns.

My project is: [brief description]
Main challenge: [what you're struggling with]

Please help me:
1. Create a CLAUDE.md navigation file for my project structure
2. Set up a simple mission tracker for managing tasks
3. Suggest which documentation would help most
4. Show me how these patterns work together (composable coordination)

I want to start simple and add complexity only as needed. I understand that these patterns work individually but compose together for multiplied benefits.
```

---

**For an Existing Project:**

```
I want to improve my project's ability to work with AI assistants. 

Current structure:
- Main code in: [e.g., src/, app/, etc.]
- Documentation: [where it exists, if any]
- Current pain points: [what's not working well]

Please:
1. Assess my project's current "agentic maturity" 
2. Suggest 2-3 specific improvements
3. Help me implement the highest-value change first

Focus on practical improvements that will show immediate benefits.
```

---

## What Happens Next

The AI will typically:

1. **Ask clarifying questions** about your project structure and goals
2. **Suggest specific files to create** (usually starting with CLAUDE.md)
3. **Provide templates** customized for your project
4. **Guide you through implementation** step by step

## If You Want More Structure

After the initial setup, you can ask:

```
"I'd like to understand the maturity levels and see where my project fits. Can you:
1. Explain the 5 levels of agentic maturity
2. Assess where my project currently is
3. Show me what the next level looks like"
```

## For Advanced Users

If you've downloaded the full starter kit:

```
"I have the Agentic Engineering Coordination starter kit. I'd like to:
1. Review the core concepts
2. Choose appropriate patterns from the toolkit reference
3. Set up the patterns that match my project's complexity

My project is currently at Level [X] maturity and I want to reach Level [Y]."
```

## Tips for Best Results

### Be Specific About Pain Points
Instead of: "Help me organize my code"  
Try: "My agents keep getting confused about which file handles user authentication"

### Start With One Problem
Instead of: "Set up everything"  
Try: "Help me document my API folder so agents can navigate it"

### Provide Context
Instead of: "Add documentation"  
Try: "Add navigation docs for my React app with 50+ components"

## Common First Improvements

Based on your situation, the AI might suggest:

**If agents get lost**: Create navigation documentation (_info.md files)
**If tasks are unclear**: Set up mission tracker with clear specs
**If changes break things**: Add completion protocols with quality checks
**If working with multiple AIs**: Create agent-ramp context loaders
**If domain is complex**: Document anti-patterns and gotchas

## Example Successful First Session

```
User: I want to set up my project for better human-AI collaboration using the Agentic Engineering Coordination patterns.

My project is: A Next.js e-commerce site with 200+ components
Main challenge: AI assistants keep putting code in wrong places and missing our patterns

Please help me:
1. Create a CLAUDE.md navigation file for my project structure
2. Set up a simple mission tracker for managing tasks
3. Suggest which documentation would help most

AI: I'll help you set up better AI coordination for your Next.js e-commerce site. Let's start with understanding your structure...

[AI asks about folder structure, then creates customized CLAUDE.md with your specific paths]

[AI sets up mission tracker with example missions relevant to e-commerce]

[AI suggests documenting your component patterns first since that's where confusion happens]
```

## Remember

- **Start simple** - You can always add more structure later
- **Focus on friction** - Fix what's actually slowing you down
- **Iterate quickly** - Try something, see if it helps, adjust
- **Connect patterns** - Navigation + Missions + Documentation = Multiplied effectiveness
- **Share what works** - Your patterns might help others

## Getting More Help

If you need deeper guidance, reference these resources in your conversation:
- `core-concepts.md` - Understanding the principles
- `toolkit-reference.md` - Menu of patterns to implement  
- `examples/` - See working examples
- Bond-calculator project - Example of Level 4 maturity

---

*This prompt works with any AI assistant. The patterns are tool-agnostic and focus on improving human-AI coordination regardless of which AI you're using.*