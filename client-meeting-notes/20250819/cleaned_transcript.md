# UQSA Meeting Transcript - August 19, 2025
**Meeting: Live Meeting with Unlimited (UQSA)**

## Attendees
- **Technical Team:** You (consultant), Nate (partner)  
- **UQSA Team:** Kimmy (owner), Jake, Jenny, Diane (quality consultant)
- **Referenced:** Crystal (quality manager - absent), Sue (handles spreadsheets)

---

## Opening Discussion - Historical Context

**Kimmy:** We used to have to hire a tech to come in to help with scale settings so we could get the right reading. What we just accomplished would have cost a tech couple hours to come in and tune things. So that's cool.

*[Discussion about names and introductions]*

**Kimmy:** I have had a hard time last week managing my weight tracking. The way we do things now - if you open my drawer, there's got to be six, seven different kinds of reports and paperwork. 

## Current Process Overview

**Kimmy:** This is the report that gets turned into Sue. It's part number 1, 2, 3, 4. They did a total of 5,000 pieces. The employee wages with taxes and insurance - we include that because we pay on top of that. So let's say it was $2,150 for the hourly wage.

**You:** Do you have that information stored somewhere else or do you know those numbers?

**Kimmy:** Sue has all this information. It's literally on a piece of paper that gets put into a system. Then she would put in that they worked on it for eight hours. It tells us that the company did $312.50 an hour. I created this probably 20 years ago.

**Kimmy:** After all of that gets filled out, we take it to calculate profit. We have Victoria (staffing company) employees, so we count those employee hours the same way - punch in their wage, what we charge the customer. After that, we figure out if we made $2,000 that day and Victoria was $1,000, so we did $3,000 that day.

**Kimmy:** I go to Excel and start my monthly report for each day. I put Unlimited's profit, Victoria's profit, and fill them all in through the week. By the end it gives me the grand total of what Unlimited is making for the month with wages taken out.

## Current Pain Points

**Kimmy:** Whatever you can do to reduce manual entry, that's what I want to get to. Sue takes every single payroll report, gets all the non-productive employees, puts that in monthly. She takes the production reports and manually calculates everything.

**Kimmy:** By the end of the year I can see what we've made as a company. We follow it monthly and try to beat previous performance. I'm out there doing parts - if I did 250 pieces an hour, I want to do 300 pieces next time. Same with monthly targets.

## Technical Discussion Begins

**You:** The way I see the target interface and connection points - right now you have the scale doing real time reporting. There's the physical interface that allows the employee ID and part number and performance to be monitored and put together. You're going to have an independent screen where you can select part numbers and employee names and IDs.

**You:** You'd want to have active and inactive part numbers so people don't accidentally fat finger a part that's not current.

**Kimmy:** Some of our part numbers are very close - like 41378, 41379. We have that issue.

**You:** They would have to punch those in, or somebody has to put in that this is the part they're working on. If there's a known list, they could select from existing options to remove those kinds of mistakes.

**Kimmy:** Even if we did have barcodes, we could do it several ways to make it as low risk as possible. One way is to deactivate old numbers unless you guys reuse part numbers for years.

**Kimmy:** We do reuse them. Sometimes we get one-time sorts or rework. There are times when the customer will say it's the same part number but we have to do an extra step because they screwed up - there's a slug mark in the part. So we'd quote it as OTS (one time sort) and we can add the part number at that time.

## Workflow Deep Dive - Assembly vs Sorting

**You:** Will you be able to add part numbers? And would you make the main screen assign the part number and then whatever employee gets assigned to it signs in, already aligned to their part number? Or do you want them to sign in and also enter the part number?

**Kimmy:** I think the employee should have to punch their number in and then punch the part number for what they're working on.

**You:** My concern is if someone goes out there and puts in 41445 instead of 41444, that's going to show they worked on the wrong part.

**Kimmy:** What we could do is set up sections. Station six is going to be working on 41245s. The scale shows 41245s and then the employee comes and sits down and puts their number in. Could they do it that way instead of having to put the part number in each time?

**You:** Yes, we could do that. I imagine you can pull the part number from the scale. So in the morning during their meeting, they figure out what's going to be at each station, then program it into the system. The employee would only have to punch their ID.

**You:** The scale would be the source. It's really easy to show a picture of the part number so they could quickly verify it's the right one. If you register a part with the system, you can take a quick picture so that flashes up when they're starting their station.

**Kimmy:** Not a picture of the number, but a picture of the actual part, right? We have pictures of all parts because we have them in our work instructions.

## Box Counting and Reset Process

**You:** At some point, either at a target count, they dump the parts, right? The scale gets to a tray, the tray is full, and they have to do something with the parts and it resets to zero. Is that correct?

**Kimmy:** When they dump the parts, so the employee is working on parts, they put parts in the tray. Then Crystal or whoever is on the floor at the time - they always 100% check everything. Then they dump the tray into the box. It's constant - they're going around all the time doing this. If that part has to be at 450 pieces, they dump 450 in there, close it up, put a new box on.

**You:** So part numbers not only have an hourly target, they also have a box target number.

**Kimmy:** Part number 41245 is 150 pieces per box. So that part number would have to be programmed at 150 pieces per box.

## Data Recording Methodology

**You:** We care about that hour - how many pieces in that hour. Once that hour is up, I need it to tally whatever pieces they got, because you're going to empty the box no matter what. The tray goes into the box, box goes to the pallet and gets labeled. We don't care how many boxes - we care about that hour.

**Kimmy:** The sorter's job is only to put parts in the tray. There is somebody else (Crystal) who puts trays in boxes, somebody else who weighs it up. Crystal comes around, looks at all the parts, dumps them in the box. That sorter is continuing with another tray while she's doing that.

**You:** Are they using the actual scale?

**Kimmy:** Some do, some don't. It depends. The scale is being used by the material handler (Crystal).

**You:** I think a sorter per scale seems like a good relationship. Your material handlers get everything out of the way so the sorter can be as effective as possible, and they audit.

## Two Different Workflows Identified

**Kimmy:** Crystal goes around from table to table. That's her job - she goes around checking. But there are some jobs that go right into packaging. Some jobs we don't have to sort or scale - we just have to take it from the station and pack it into a box. We dump it on the table and that job, they just package it. They still have to get so many per hour.

**You:** So there's two modes. There's live scale reporting where the part is being put on a scale - that's real time. And there's a second mode when the material handler comes and says "here's your tray, I'm putting it on the scale, there's 400 pieces" and records it.

**Kimmy:** I'm trying to get away from having to do all those different steps. I want the scale to come into the computer. I don't care if it's Crystal putting them in the box or the employee putting them in the box. I want to get away from all the paperwork.

**You:** So Crystal comes over at the hour mark, takes the tray, and dumps it after checking. You want the piece count for that hour, not the box count. A box might only hold 100 but they've got to do 1500 pieces that hour. It doesn't matter about the box - just the hour.

## Button Press Discussion

**You:** My concern is that if you don't have someone press at least one button, if somebody touches a scale or inadvertently puts something on it, it's going to report numbers that aren't accurate. Having one button on the screen that says "record this number" - it's going to tell you 450, you put 450 on, if there's 450 it's going to say there's 450 pieces here. All she has to do is say "yep" and touch the button.

**Kimmy:** Crystal would touch the button. So she comes in, sets it on there, sees that the screen says 450, she says "great" and touches the button.

**You:** I need some way of knowing that what you put on the scale was actually what you wanted to count. Otherwise somebody could put their hand on it and I'll count that.

## Real-Time Monitoring Goals

**Kimmy:** When she pulls that box off, she's got to let the scale know before she pulls the box off - she'll hit that button to say "okay, this is it."

**You:** We can do that. Every time she goes to move something, she just says "got it."

**Kimmy:** I want to be able to go in and see that hour what that person's done, or in three hours. If we want alerts when they're under production, when we pull the report it comes up red - there's an issue. You don't even have to pull the report, it's going to tell you.

**You:** For the sorting one, as long as it's attached to the scale, that'll just be live. I just need to know at some point that the scale is full and somebody takes it off the scale. I can track every time - every second it does it, it says there's 4 pieces, 3 pieces. Every second it's going to calculate, so we'll be able to see within that hour.

## Parts Per Hour Calculation

**You:** The main reason we need the button when the box is full is because somebody might put their hand on it and it calculates incorrectly.

**Kimmy:** When they put that box down, that's where we put rules around when something gets recorded. We can either say if it goes from 500 down to zero and doesn't go back up to 500 for a long enough time, we'll say "oh that must have been a completed box." Or we can have the button where they say "done."

**You:** We can track everything. If it goes from 500 to zero, we usually put a time constraint on it. So if they lift it off to shuffle it, it doesn't record a double count.

**Kimmy:** What you're saying is you can figure it out. That part doesn't really matter to the program - who does what. That doesn't matter, we can figure that out in-house. But for you, you need to know what needs to be done. I want to be able to go in and see that hour what that person's done.

## Historical Context and Motivation

**Kimmy:** This is the second time I'm trying to do this. When I bought all those scales, I was getting rid of all the tallying. Each employee was supposed to have a scale, count the parts, do their box, and it would state right there "250 pieces." They push it down, grab another box, put it on. That's how the tallying came about originally.

**Kimmy:** When I bought scales for each employee, I started doing that. Then when we found out this couldn't be done with those scales (which it can be done), that's when things turned back to the way it used to be. But originally it was set up for each employee to have a scale.

**Kimmy:** I want the scalers to do as little as possible with paperwork. I want to be able to see real-time and not rely on Crystal or the scalers. If they know this is being calculated and we can see real-time production, you're going to see production improve. If they know they're being monitored in real-time, their production will increase.

## Final Workflow Decisions

**Kimmy:** So each employee is going to have a scale. The scaler is going to program that scale with how many pieces, the part number, zeros it out. The employee is going to have an employee number, so when they sit down, we know employee 1 is Maria. She hits 1, it's ready for her.

**You:** For assembly: Crystal goes over and dumps the parts in the box, 250 are in there, she hits the button. For sorting: the employee is going to have to push the button instead of Crystal because Crystal won't be there all the time.

**Kimmy:** The employee's box is full, they take that box and push it down the conveyor. When that box is full, they would have to hit that button so the scale knows that box is done.

## Technical Implementation Approach

**You:** There's two scenarios. One is the assembler is not putting it on the scale, so the scale shows 000. But then the material person comes by and weighs it, so we have a peak and it goes down to nothing. Each time they weigh it, we record that number.

**You:** The other version is where somebody's putting things directly onto the scale. We take a read every second for 60 seconds, then take the highest number from that minute. That's going up because something is being added. At some point it drops to zero and we know they changed boxes.

**Kimmy:** At the end of the eight hours, it's all going to calculate out to a per-hour number. So that extra 5 pieces from a hand being on there isn't going to matter for that minute, because it will end up normalizing.

## Hardware Discussion

**You:** What you described gives you the benefit of parts per hour immediately (real-time), and this gives you parts per hour as new boxes are put in. You're still going to get updates, just more by hour instead of by minute.

*[Discussion about industrial tablet hardware - 7" screen, under $200 for complete unit, WiFi enabled]*

**Kimmy:** PTM has something similar hooked up to their scales and printers.

## Project Approach and Next Steps

**You:** We always recommend when we do something like this - build just one first. You put it in one station and try it out. Tell us what you like, what you don't like, and see how it works.

**Kimmy:** That's how we did it in Baltimore originally.

**You:** We don't want you to buy a bunch of interfaces that you don't end up using. Get one, get it connected, test it out for a week or a day. Test it with your sorter, test it with your assembler. See what you like, what you didn't like. Once you get that, then we say "all right, let's do all 12 of them."

**You:** This gives you a chance to say "this just isn't going to work" or "I don't want to train this" or if you do like it, then "let's do all 12." It also helps us because we make an initial estimate on how much we think one will be, then we'll have a lot more accuracy in how much 12 would be.

## Closing Confidence Statement

**You:** Nate and I are known for saying we haven't had somebody ask us to do something technical that isn't possible. We're concerned with making sure the scale reports very accurately. I just want to make sure you're getting what you expect.

**You:** If at the end of the day it overcounted by 5 parts total because somebody accidentally leaned on it for one count, and if that's a risk you're willing to take to automate it versus somebody pressing a button, then it can be a totally touchless system.

**Kimmy:** The scale is the source of truth. When that box comes off that scale, they're looking at it and weighing it. That's it, it's done.

**You:** I think I have enough information that I can show you some screens, outline the workflow, and give you an estimate. The next step would be to create a visual so you'll see what it could look like - what we think a physical screen might look like.

**Kimmy:** When you get that proposal and Jake needs to be involved, he can watch the demonstration in real time and if there are any changes that need to be made, he can let you know.

**You:** Sometimes a 2-3 minute video with images is worth a half hour conversation. We do that all the time with clients. Once we get it into this system, the sky's the limit on what you can dream up, but let's get the first win. Let's crush the first station, get your team used to it, get the data flowing, make everybody's job easier for a couple weeks and use that momentum to start reimagining what's possible.

---

**Meeting End**