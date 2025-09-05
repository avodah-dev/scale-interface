# Starter Kit Initialization Prompt

## For Engineers Using This Starter Kit

When you're ready to assess and improve your project's agentic engineering coordination maturity, use this prompt with your preferred AI assistant:

---

## Initialization Prompt for AI Assistant

I've installed the Agentic Engineering Coordination Starter Kit in my project. Please perform a progressive assessment and help me improve my codebase's ability to coordinate human-agent collaboration.

**Context**: These patterns are proven in production systems. Multi-agent orchestration with 10+ specialized agents is successfully deployed in frameworks like BMAD-METHOD, validating that Level 4-5 maturity is achievable and valuable.

**Your task**:

1. **Perform Progressive Assessment**
   - Start with basic scan of project structure
   - Look for any documentation patterns (README files, docs folders, inline comments, documentation near code)
   - Check for process infrastructure (issue tracking, task folders, project management patterns)
   - Identify development tools (.cursor/, .vscode/, .github/, etc.)
   - Note any existing coordination patterns (setup guides, contribution docs, etc.)

2. **Determine Current Maturity Level (1-5)**
   - Level 1: Basic consistency and patterns
   - Level 2: Single-file agent capability
   - Level 3: System-scale with documentation infrastructure
     * Watch for natural separation of planning vs execution
   - Level 3→4 Transition: Phase separation emerges
     * Planning work (exploration) vs execution work (production)
     * Different context needs become apparent
   - Level 4: Multi-agent coordination patterns
     * Note: At this level, consider context density specialization
     * Planning/analysis tasks can use rich context
     * Execution/coding tasks need lean, focused context
   - Level 5: Autonomous observation (rare)

3. **Generate Assessment Report** including:
   - Current maturity level with specific evidence
   - Strengths to build upon
   - Gaps to address
   - **Composable Coordination Score**:
     * Individual patterns in use (0-3 points)
     * Connections between patterns (0-3 points)
     * Synergy effects observed (0-3 points)
   - 3-5 specific improvement missions

4. **Propose First Mission**
   - Apply Mission Initiation Protocol:
     * Analyze complexity (Simple/Standard/Complex)
     * Identify affected files and dependencies
     * Create mission spec with acceptance criteria
     * Suggest appropriate structure based on complexity
   - Ask clarifying questions if needed
   - Create mission documentation in suggested format

5. **Establish Working Patterns**
   - Suggest creating a central navigation document (CLAUDE.md) with problem-type routing
   - Propose a lightweight mission-tracker for work coordination
   - Recommend documentation approach:
     * Create folder-level navigation files (_*-info.md pattern)
     * Use reference-first approach (point to code, don't duplicate)
     * Keep documentation concise (100-line guideline)
   - Suggest how to integrate documentation with existing patterns

**Key Principles to Apply**:
- Documentation should navigate to code, not duplicate it (reference-first)
- Missions are work done by smart entities (not just "issues")
- Start with lightest structure that provides value
- Preserve context window through concise documentation
- Match process weight to project complexity
- **Patterns compose together** - Navigation + Missions + Documentation = Multiplied effectiveness

**Assessment Priorities** (in order):
1. Navigation infrastructure (how do agents find things?)
2. Documentation patterns (are they agent-friendly?)
3. Process structure (is work trackable?)
4. **Connection patterns** (are components linked together?)
   - Does navigation reference missions?
   - Do missions link to documentation?
   - Does documentation point back to navigation?
5. Consistency patterns (predictable for agents?)
6. Tool-specific optimizations (if applicable)

**Please begin by**:
1. Asking me about the project's purpose and current challenges
2. Performing the progressive assessment
3. Showing me the assessment results
4. Proposing the first improvement mission
5. Helping me implement it using the Mission Lifecycle Protocol

**Available Frameworks** in the starter kit:
- Central Navigation Hub (CLAUDE.md pattern)
- Mission Tracker (lightweight Kanban)
- Mission Lifecycle Protocol (consistent transitions)
- Reference-First Documentation (navigation over duplication)
- Info File Pattern (50-100 line folder documentation)
- SDLC Process (heavier alternative for complex projects)

**Output Format**:
Please provide assessment as a markdown report that I can save as `maturity-assessment-[date].md` and a proposed first mission as `missions/[mission-name].md`.

---

## For Engineers: How to Use This

1. **Copy the prompt above** (everything between the horizontal rules)
2. **Paste it** into your AI assistant (Claude, ChatGPT, Cursor, etc.)
3. **Answer the assistant's questions** about your project
4. **Review the assessment** and proposed improvements
5. **Choose a mission** to start with
6. **Follow the Mission Lifecycle Protocol** for implementation

## What Happens Next

The AI assistant will:
- Analyze your project structure
- Identify patterns and gaps
- Propose specific improvements
- Help you implement them systematically

Each mission will improve your project's ability to coordinate human-agent work, gradually increasing maturity level and development velocity.

## Customization

You can modify the prompt to:
- Focus on specific areas (e.g., "Priority on documentation infrastructure")
- Skip certain assessments (e.g., "No tool-specific recommendations needed")
- Request different output formats (e.g., "Generate as GitHub issues")
- Adjust for team size (e.g., "This is a solo project" or "Team of 10")

## Success Metrics

After using the starter kit, you should see:
- Clearer navigation for agents (and humans)
- More consistent project structure
- Better documentation that doesn't duplicate code
- Trackable missions with clear outcomes
- Improved agent session success rate

## Remember

The goal isn't to implement everything at once. Start with the highest-value improvement, measure the impact, then continue iterating. Each improvement makes the next one easier.