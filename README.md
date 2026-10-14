# Smriti Setu
### AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly People Living with Dementia

Smriti Setu is a personalized cognitive-support platform designed to help elderly people engage with familiar memories, participate in cognitive activities, and maintain meaningful connections with their families.

The platform focuses on personalized memory assistance, interactive cognitive games, gentle reminders, and caregiver-supported engagement. It is designed with accessibility and low-connectivity environments in mind, particularly for underserved communities in the North Eastern Region (NER) of India.

## Problem Statement

People living with dementia may experience difficulties with memory, recognition, communication, and everyday routines. Caregivers often lack accessible, personalized digital tools that can support meaningful engagement using familiar people, places, and experiences.

Existing digital solutions may also require reliable internet access, complex interfaces, or expensive hardware, creating barriers for elderly users and families in resource-constrained environments.

Smriti Setu aims to address these challenges through a simple, personalized, and accessible cognitive-support platform.

## Our Solution

Smriti Setu combines caregiver-provided personal memories, interactive cognitive games, adaptive activity selection, and AI-assisted conversational support in one platform.

The caregiver can create a personalized profile containing family photographs, names, relationships, important memories, and daily routines. The elderly user can interact with these memories through simple games and supportive activities.

The platform uses activity performance to adjust subsequent tasks through a controlled adaptive engine. A locally running language model can provide contextual, empathetic conversational assistance.

## Key Features

### 1. Personalized Memory Assistance
- Store family photographs and personal memories.
- Associate names with family members and relationships.
- Create personalized memory-recall questions.
- Include familiar routines and meaningful information.

### 2. Cognitive Games
- **Family Photo Recall:** Recognize familiar people using personal photographs.
- **Name and Relationship Recall:** Match family members with their names and relationships.
- **Routine Sequencing:** Arrange everyday activities in the correct order.
- **Attention and Pattern Activities:** Practice simple attention, pattern recognition, and object-recognition tasks.

### 3. Adaptive Difficulty
- Track answers, accuracy, response time, hints, and mistakes.
- Adjust activity difficulty according to recorded performance.
- Repeat activities when additional practice may be helpful.
- Use transparent rules to select appropriate activities and difficulty levels.

The adaptive engine is designed to support engagement rather than diagnose dementia or estimate clinical severity.

### 4. AI-Assisted Conversational Support
- Use Ollama with a locally hosted Qwen model.
- Generate contextual responses using available personal information.
- Provide simple, supportive conversational interactions.
- Reduce dependence on external AI APIs.

### 5. Elder-Friendly Interface
- Large buttons and readable text.
- High-contrast layouts and simple navigation.
- Minimal distractions and clear instructions.
- Support for voice-based interaction and multilingual experiences as development progresses.

### 6. Caregiver Dashboard
- Manage personal profiles and family memories.
- Configure routines and reminders.
- Review game history and activity performance.
- Monitor engagement and personalization settings.

### 7. Low-Connectivity Design
- Prioritize lightweight interfaces and locally available data.
- Minimize unnecessary network requests.
- Explore local processing for supported features.
- Design the platform for use in areas with limited internet connectivity.

## System Architecture

The proposed architecture separates the user interfaces, application APIs, adaptive engine, database, and conversational AI service.

        Caregiver Interface
                 |
                 v
          React Frontend
                 |
                 v
        Node.js / Express API
                 |
          +------+------+
          |             |
          v             v
      MongoDB       FastAPI
                    AI Service
                        |
              +---------+---------+
              |                   |
              v                   v
        Adaptive Engine      Ollama + Qwen
              |
              v
       Activity Selection
       and Difficulty
              |
              v
       Game Performance
              |
              v
        MongoDB Storage

The elderly user's interface is designed to remain simple and accessible. The caregiver interface manages personal information, while backend services handle data access, game logic, personalization, and AI-assisted interactions.

## Technology Stack

| Component | Technology |
| Frontend | React.js |
| Backend API | Node.js, Express.js |
| AI service | Python, FastAPI |
| Database | MongoDB |
| Local language model | Ollama, Qwen |
| Adaptive personalization | Rule-based decision engine |
| Interface design | Responsive, accessibility-focused web UI |
| Deployment direction | Progressive Web App (PWA) |

## How It Works

1. Create a profile: The caregiver enters relevant personal information, memories, relationships, and routines.
2. Choose an activity: The platform presents a suitable cognitive game or memory activity.
3. Record performance: The system records answers, response time, hints, and mistakes.
4. Adapt the experience: The adaptive engine evaluates performance using predefined rules.
5. Personalize the next activity: The platform selects an appropriate activity and difficulty.
6. Continue engagement: Personal memories, reminders, and conversational support help maintain a familiar experience.

## Privacy and Safety

- Personal information should only be accessible to authorized users.
- Family photographs and memories should be handled with appropriate consent and access controls.
- AI-generated responses should remain supportive and grounded in available context.
- The platform is a cognitive-support and memory-assistance tool, not a substitute for professional medical care.
- Game scores must not be presented as a medical diagnosis or validated clinical assessment.

## Current Development Status

Smriti Setu is being developed as a prototype.

The project is being built incrementally, beginning with the core application and expanding toward personalized cognitive games, adaptive activity selection, caregiver tools, and local AI integration.

Planned development milestones:
- [ ] Complete the core application structure.
- [ ] Implement caregiver profiles and personal-memory management.
- [ ] Develop the initial cognitive games.
- [ ] Integrate performance tracking and rule-based adaptation.
- [ ] Connect the FastAPI AI service and local Qwen model.
- [ ] Add reminders and conversational support.
- [ ] Improve multilingual accessibility and low-connectivity functionality.
- [ ] Test usability with appropriate caregiver guidance and consent.

*The checklist should be updated as each feature is implemented and tested.*

## Future Scope

- Expand support for regional languages.
- Improve offline functionality and data synchronization.
- Introduce additional personalized cognitive activities.
- Improve caregiver progress summaries.
- Conduct usability evaluations with caregivers and older adults.
- Validate the platform's usability and safety before considering any clinical applications.

## Our Vision

Smriti Setu aims to make memory assistance more personal, accessible, and meaningful by connecting technology with the people, relationships, and everyday experiences that matter most.

**Smriti Setu — Bridging memories, strengthening connections.**
