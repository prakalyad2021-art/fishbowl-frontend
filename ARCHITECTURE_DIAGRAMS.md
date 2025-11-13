# System Architecture Diagrams

This document contains PlantUML code for professional system architecture diagrams of the Fishbowl application.

## How to Use

1. **Online Editor**: Go to http://www.plantuml.com/plantuml/uml/ and paste the code
2. **VS Code Extension**: Install "PlantUML" extension and preview
3. **Local Tool**: Install PlantUML and run: `plantuml architecture.puml`

## Diagram Files

### 1. `architecture.puml` - High-Level System Architecture
**Best for:** Overview of all services and their relationships

**Shows:**
- All 10 AWS services
- Frontend components
- Data flow between services
- Authentication flow
- Real-time subscription flow

### 2. `architecture_detailed.puml` - Detailed Data Flow Architecture
**Best for:** Step-by-step data flow with numbered sequences

**Shows:**
- User interactions
- Authentication sequence (steps 1-5)
- Query flow (steps 6-11)
- Real-time subscription (steps 12-17)
- Media upload (steps 18-23)
- Chat messaging (steps 24-28)
- Mood updates (steps 29-34)
- Scheduled tasks (steps 35-40)
- Monitoring (steps 41-44)

### 3. `architecture_deployment.puml` - AWS Deployment Architecture
**Best for:** AWS-specific deployment view with official AWS icons

**Shows:**
- AWS service icons (official)
- Deployment topology
- Service connections
- Notes on each service

## Recommended for Report

**Use `architecture_detailed.puml`** - It's the most comprehensive and shows:
- All services
- Detailed data flows
- Numbered sequences (easy to explain)
- Professional appearance
- Complete system overview

## Export Options

1. **PNG**: High resolution for reports
2. **SVG**: Vector format (scalable)
3. **PDF**: Direct inclusion in reports

## Customization

All diagrams use PlantUML syntax. You can:
- Modify colors
- Add/remove components
- Change layout (left-right, top-bottom)
- Add notes and legends

---

## Quick Preview Links

Copy the code from any `.puml` file and paste at:
- http://www.plantuml.com/plantuml/uml/
- https://www.planttext.com/

