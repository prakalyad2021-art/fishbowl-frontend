# Team Contribution Checklist
## Fishbowl Project - Work Distribution

Use this checklist to divide contributions between team members. Check off items as you assign them.

---

## Frontend Development

### Core Setup & Configuration
- [ ] **Project Initialization**
  - [ ] Vite + React 19 setup
  - [ ] Tailwind CSS v4 configuration
  - [ ] React Router 7 setup
  - [ ] AWS Amplify SDK integration
  - [ ] Environment configuration

- [ ] **Authentication Integration**
  - [ ] Cognito Authenticator wrapper
  - [ ] Sign-up/Sign-in UI
  - [ ] Session management
  - [ ] User context setup

- [ ] **Navigation & Layout**
  - [ ] Bottom navigation component
  - [ ] Routing configuration
  - [ ] Page layout structure
  - [ ] Responsive design

### Page Modules

- [ ] **Fishbowl Module (Main Feature)**
  - [ ] Component structure
  - [ ] Fishbowl visual design (CSS animations)
  - [ ] Real-time user presence subscription
  - [ ] Mood update functionality
  - [ ] Fish emoji assignment logic
  - [ ] Active friends list
  - [ ] Thought bubble UI (mood display)
  - [ ] Fish swimming animations

- [ ] **Chatroom Module**
  - [ ] Chat interface design
  - [ ] Real-time message subscription
  - [ ] Message input and send functionality
  - [ ] Media attachment support
  - [ ] Media preview
  - [ ] Message history display
  - [ ] Auto-scroll functionality

- [ ] **Prompts Module**
  - [ ] Daily prompt display
  - [ ] Prompt creation logic
  - [ ] Response input interface
  - [ ] Response feed display
  - [ ] 24-hour expiration logic
  - [ ] Real-time response updates

- [ ] **Media Module**
  - [ ] Instagram-style feed design
  - [ ] Media upload modal
  - [ ] File selection and preview
  - [ ] S3 upload integration
  - [ ] Post creation with captions
  - [ ] Comment system
  - [ ] Delete functionality

- [ ] **Journal Module**
  - [ ] Journal entry form
  - [ ] Entry list display
  - [ ] Tag system implementation
  - [ ] Search functionality
  - [ ] Tag filtering
  - [ ] Delete functionality

- [ ] **Calendar Module**
  - [ ] Calendar interface
  - [ ] Event creation form
  - [ ] User tagging UI
  - [ ] Event list display
  - [ ] Date filtering
  - [ ] Real-time event updates

- [ ] **Stats Module**
  - [ ] Statistics calculation
  - [ ] Chart integration (Recharts)
  - [ ] Data visualization
  - [ ] Time period filtering

### Utilities & Helpers

- [ ] **Data Client (`src/utils/dataClient.js`)**
  - [ ] AppSync client setup
  - [ ] User CRUD operations
  - [ ] Message operations
  - [ ] Mood operations
  - [ ] Media post operations
  - [ ] Journal operations
  - [ ] Calendar operations
  - [ ] Stats operations

- [ ] **Storage Client (`src/utils/storageClient.js`)**
  - [ ] S3 upload functionality
  - [ ] Identity ID handling
  - [ ] Media URL generation
  - [ ] File deletion
  - [ ] Error handling

---

## Backend Development

### AWS Amplify Gen 2 Setup

- [ ] **Backend Configuration**
  - [ ] Amplify backend setup
  - [ ] TypeScript configuration
  - [ ] Backend resource definitions
  - [ ] Environment setup

- [ ] **Authentication (`amplify/auth/resource.ts`)**
  - [ ] Cognito User Pool configuration
  - [ ] Identity Pool setup
  - [ ] Password policy
  - [ ] Email verification

- [ ] **GraphQL Schema (`amplify/data/resource.ts`)**
  - [ ] User model definition
  - [ ] Message model definition
  - [ ] Mood model definition
  - [ ] Prompt model definition
  - [ ] PromptResponse model definition
  - [ ] MediaPost model definition
  - [ ] MediaComment model definition
  - [ ] JournalEntry model definition
  - [ ] CalendarEvent model definition
  - [ ] UserStats model definition
  - [ ] Authorization rules for all models
  - [ ] Relationships (@hasMany, @belongsTo)

- [ ] **Storage (`amplify/storage/resource.ts`)**
  - [ ] S3 bucket configuration
  - [ ] Access rules definition
  - [ ] Path patterns
  - [ ] Permission policies

- [ ] **Lambda Function (`amplify/functions/calendarReminder/`)**
  - [ ] Function handler implementation
  - [ ] DynamoDB query logic
  - [ ] Event processing
  - [ ] Error handling
  - [ ] Function resource definition

- [ ] **EventBridge Configuration**
  - [ ] Rule creation
  - [ ] Schedule expression (cron)
  - [ ] Lambda target setup
  - [ ] Console configuration (manual)

---

## Deployment & DevOps

- [ ] **CI/CD Setup**
  - [ ] `amplify.yml` configuration
  - [ ] Build pipeline setup
  - [ ] GitHub integration
  - [ ] Auto-deployment configuration

- [ ] **AWS Console Configuration**
  - [ ] Amplify app creation
  - [ ] Backend deployment (`ampx sandbox`)
  - [ ] EventBridge rule setup
  - [ ] IAM role verification
  - [ ] S3 bucket verification

- [ ] **Testing & Debugging**
  - [ ] Local testing
  - [ ] Production testing
  - [ ] Error logging setup
  - [ ] Performance optimization

---

## Documentation

- [ ] **Technical Documentation**
  - [ ] Code comments
  - [ ] Function documentation
  - [ ] API documentation
  - [ ] Setup instructions

- [ ] **Project Documentation**
  - [ ] README.md
  - [ ] AWS_SERVICES_USED.md
  - [ ] PROJECT_REPORT.md sections
  - [ ] Architecture diagrams (PlantUML)

- [ ] **Screenshots**
  - [ ] Application screenshots (8 pages)
  - [ ] AWS Console screenshots (9 services)
  - [ ] Architecture diagram exports

---

## Testing & Quality Assurance

- [ ] **Functionality Testing**
  - [ ] Authentication flow
  - [ ] Real-time features
  - [ ] Media uploads
  - [ ] Data persistence
  - [ ] Error handling

- [ ] **Integration Testing**
  - [ ] Frontend-Backend integration
  - [ ] AWS services integration
  - [ ] Real-time subscriptions
  - [ ] Scheduled tasks

- [ ] **Bug Fixes**
  - [ ] Fish emoji persistence
  - [ ] Real-time sync issues
  - [ ] Storage upload permissions
  - [ ] UI/UX improvements

---

## UI/UX Design

- [ ] **Design System**
  - [ ] Color scheme (Frutiger Aero aesthetic)
  - [ ] Typography (Hatsukoi font)
  - [ ] Component styling
  - [ ] Animation design

- [ ] **Page Designs**
  - [ ] Fishbowl page design
  - [ ] Chatroom design
  - [ ] Prompts (Instagram Notes style)
  - [ ] Media feed (Instagram/Tumblr style)
  - [ ] Journal design
  - [ ] Calendar (Google Calendar style)
  - [ ] Stats visualization

- [ ] **Responsive Design**
  - [ ] Mobile optimization
  - [ ] Tablet optimization
  - [ ] Desktop optimization

---

## Contribution Summary Template

After assigning tasks, use this template for the report:

### Member 1: [Name] - [Reg No]
**Primary Responsibilities:**
- [List assigned items from above]

**Key Contributions:**
- [Detail specific implementations]
- [Mention files/modules worked on]
- [Highlight any major features]

### Member 2: [Name] - [Reg No]
**Primary Responsibilities:**
- [List assigned items from above]

**Key Contributions:**
- [Detail specific implementations]
- [Mention files/modules worked on]
- [Highlight any major features]

---

## Quick Assignment Suggestions

**For Balanced Distribution:**

**Member 1 (Frontend Focus):**
- Fishbowl Module
- Chatroom Module
- Media Module
- UI/UX Design
- Frontend utilities

**Member 2 (Backend Focus):**
- Backend setup
- GraphQL schema
- Storage configuration
- Lambda functions
- Deployment & DevOps
- Documentation

**Or Alternative Split:**

**Member 1:**
- Authentication & Setup
- Fishbowl Module
- Prompts Module
- Journal Module
- Stats Module

**Member 2:**
- Chatroom Module
- Media Module
- Calendar Module
- Backend configuration
- Deployment

---

## Notes

- Check off items as you assign them
- Be specific about who did what
- Keep track of files modified
- Document any pair programming sessions
- Note any challenges overcome

---

**Last Updated:** [Date]
**Team Members:** [List names]

