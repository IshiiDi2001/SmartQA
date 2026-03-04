# ~ SmartQA ~
### AI-Driven Test Case Generator Integrated with Jira Cloud

---

## Overview

**SmartQA** is an AI-powered Quality Engineering platform that integrates directly with Jira Cloud to automatically generate structured, professional test cases from user stories.

It connects to Jira via OAuth, dynamically detects project-specific custom fields, processes user stories, and generates well-structured test cases that can be exported to Excel or written back into Jira.

This project demonstrates real-world QA automation, Agile workflow integration, and intelligent AI-driven testing support.

---

## Core Features

### Secure Jira OAuth Integration
- Connect to Jira Cloud using OAuth 2.0
- Automatically retrieve Jira Cloud ID
- Fetch accessible resources dynamically

---

### Fetch Jira User Stories
- Uses Jira REST API v3
- Fetches Stories via JQL
- Automatically parses:
  - Summary
  - Description (ADF → Text conversion)
  - Acceptance Criteria
  - Labels

---

### Dynamic Custom Field Detection (Enterprise Feature)

Instead of hardcoding Jira custom field IDs, SmartQA:

- Fetches all Jira fields dynamically
- Automatically detects:
  - Acceptance Criteria field
  - Generated Test Cases field
- Works across different Jira projects without configuration changes

This makes the solution scalable and production-ready.

---

### AI-Based Test Case Generation
- Converts user story + acceptance criteria into:
  - Test Case ID
  - Title
  - Step-by-step actions
  - Expected Result
- Structures test cases per story
- Handles multiple stories in one session

---

### Export Options

#### Export to Excel
- Generates structured `.xlsx` file
- Columns include:
  - User Story
  - Test Case ID
  - Title
  - Steps
  - Expected Result
- Uses ExcelJS for professional formatting

---

#### Export Back to Jira
- Updates Jira Story
- Writes generated test cases into:
  - "Generated Test Cases" custom field
- Uses dynamic field ID detection
- Supports secure OAuth-based update calls

---

## System Architecture
Jira Cloud

↓

OAuth Authentication

↓

Fetch User Stories (JQL)

↓

Parse ADF → Text

↓

AI Test Case Generation

↓

Display in UI

↓

Export to: Excel / Jira Custom Field


---

## Tech Stack

### Backend
- Node.js
- Express.js
- Axios
- ExcelJS
- Jira REST API v3
- OAuth 2.0

### Frontend
- React
- TailwindCSS

### Concepts Used
- Agile / Scrum workflows
- Quality Engineering principles
- REST API integration
- Dynamic configuration handling
- JSON parsing & transformation
- Structured test design

---

## Key Functional Modules

### 1️ Jira Story Fetch Module
- Retrieves Jira Cloud ID
- Executes JQL search
- Converts ADF (Atlassian Document Format) to readable text
- Detects dynamic custom fields

---

### 2️ AI Test Case Engine
- Accepts story + acceptance criteria
- Generates structured JSON output
- Prevents malformed JSON errors
- Supports multiple test cases per story

---

### 3️ Jira Export Engine
- Uses: `PUT /rest/api/3/issue/{issueKey}`
- Updates custom field dynamically
- Handles OAuth token securely

---

### 4️ Excel Export Engine
- Generates professional test case sheet
- Structured QA documentation format

---

## Why This Project Matters

In real Agile teams:

- User stories are written in Jira
- QA engineers manually read stories
- Test cases are written separately in Excel or test tools
- This is time-consuming and error-prone

SmartQA:

✔ Automates test design  
✔ Reduces missed scenarios  
✔ Ensures consistent structure  
✔ Saves QA effort  
✔ Demonstrates AI + QA integration  

This reflects modern Quality Engineering practices.

---

##  Enterprise-Grade Improvements Implemented

- Dynamic Jira field detection
- ADF parsing logic
- Multi-story test case grouping
- Structured export formatting
- Clean UI rendering with scrollable test cards
- Story-based test grouping (e.g., SQ-2 User Login Story)

---

## Future Enhancements

- Link test cases to stories using Jira issue linking
- Support Xray / Zephyr integration
- Add test case versioning
- Add execution status tracking
- Add coverage analytics dashboard

---

## Author

**Ishini Dimani**  
Aspiring Associate Quality Engineer  
Focused on AI + QA Automation + Agile Engineering
