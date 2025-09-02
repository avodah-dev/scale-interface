# UQSA Manufacturing Scale System - Meeting Summary
**Date:** August 19, 2025  
**Attendees:** 
- **Technical Team:** You (primary consultant), Nate (partner)
- **Client Team:** Kimmy (owner), Jake (family/employee), Jenny (family/employee), Diane (quality consultant)
- **Referenced:** Crystal (quality manager - not present)

## Meeting Overview
This was a discovery meeting to understand UQSA's manufacturing processes and design a digital scale system to replace manual production tracking. The conversation revealed a complex operation with two distinct workflows that needed different technical approaches.

## Current State Problems
- **Manual paperwork burden:** Employees fill out hourly production tallies on paper
- **Quality bottleneck:** Crystal (quality manager) manually checks and weighs everything
- **Delayed reporting:** Production issues only discovered the next day
- **Data entry errors:** Sue manually tallies and calculates hourly rates from paper
- **Resource constraints:** When Crystal is absent, production slows significantly

## Business Context
- Kimmy wants real-time production visibility to catch issues immediately
- Current system requires Crystal to check every station hourly and weigh parts
- Production targets are measured in parts per hour (not boxes)
- They have experience with scale automation from previous Baltimore facility
- Previous vendor told them automation "couldn't be done" - this frustrated Kimmy

## Two Distinct Workflows Identified

### Workflow 1: Assembly Operations
- **Process:** Employee assembles parts → puts in tray → Crystal checks 100% → dumps into box on scale → records count
- **Scale Usage:** Material handler (Crystal) operates the scale
- **Quality:** 100% inspection required
- **Recording:** Crystal presses button to record box weight/count

### Workflow 2: Sorting Operations  
- **Process:** Employee sorts parts → puts directly in box on scale → records when full
- **Scale Usage:** Employee operates their own scale
- **Quality:** Random audit checks only
- **Recording:** Employee presses button when box is complete

## Key Technical Decisions Made

### Hardware Approach
- Each station gets its own scale (one scale per employee)
- Industrial tablet/interface at each station (~$200 target per station)
- WiFi connectivity for real-time data
- Conveyor system for completed boxes

### Software Modes
**Assembly Mode:**
- Scale shows parts per hour calculation
- Waits for material handler to weigh and confirm
- No real-time counting during assembly

**Sorting Mode:**
- Real-time piece counting as parts added
- Employee confirms when box is complete
- Live production monitoring

### Data Recording Strategy
- **Primary:** Button press confirmation for all counts
- **Backup:** System tracks highest weight per minute
- **Failsafe:** If button missed, system can estimate from weight patterns
- Always calculate and display parts per hour (not just box counts)

## Concerns Addressed
- **Accuracy:** Button press prevents false readings from hands/leaning on scale
- **Workflow Disruption:** Minimal - just adds one button press to existing process  
- **Employee Trust:** Start with most trusted employee/station for pilot
- **Scale Sensitivity:** Use button confirmation to avoid accidental weight triggers

## Resistance Points Overcome
- Jake initially skeptical about employee compliance with button pressing
- Kimmy wanted completely touchless system, but accepted button requirement for accuracy
- Discussion about tray vs. direct-to-box workflow (decided to keep trays for quality control)

## Value Proposition Confirmed
- Real-time production monitoring
- Eliminate manual paperwork and data entry
- Catch production issues immediately vs. next day
- Free up Crystal's time for other quality tasks
- Accurate, automated reporting for Sue's spreadsheets

## Technical Confidence
- You emphasized that scale integration is well-established technology
- Referenced successful similar implementation (golf ball sorting system)
- Assured them anything is technically possible once basic system is working