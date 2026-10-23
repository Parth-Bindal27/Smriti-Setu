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

## Key Clinical & AI Features (Synthesized from 100+ Global Dementia Repositories)

Smriti Setu incorporates state-of-the-art software patterns, research paradigms, and clinical innovations from over 100 benchmark dementia projects, hackathon winners, and clinical research repositories (including *BELONG*, *Clariti*, *Recall*, *remembr.ai*, *Ikigai*, *DDFR*, *KAYA*, *Relief*, *EchoMyHealth*, *PentaMind*, *Vibe*, and *SMRITI*):

### 1. Private Family Memory Graph & Kinship Reasoner (Recall & BELONG)
- **Multi-Hop Kinship Engine**: Graph database storing nodes (`Person`, `Place`, `Heirloom`, `Tradition`, `LifeEvent`) and directed edges (`FATHER_OF`, `DAUGHTER_OF`, `MARRIED_TO`).
- **Provenance & Ground-Truth Auditing**: Every memory node tracks provenance (`verifiedBy`, `sourceDocument`, `trustScore`), eliminating AI hallucinations.
- **Contradiction Auditor**: Automatically detects conflicting recollections across family members.

### 2. Clariti & MindGuardAI Voice-to-Memory Ingestion Pipeline (Clariti & MindGuardAI)
- **Spoken Anecdote Ingestion**: Caregivers dictate or record family stories directly via Web Speech API or audio uploads.
- **Intelligent Entity & Temporal Extraction**: Automatically identifies historical years, family members, and cultural categories to generate structured memory cards and verified graph edges in real time.

### 3. Multi-Agent Council of Care & Clinical Copilot (Ikigai)
- **3-Agent Deliberation**:
  - *Geriatric Nurse*: Practical comfort, hydration, and sleep hygiene.
  - *Behavioral Neurologist*: Agitation patterns, circadian disruption, and cognitive fatigue.
  - *Occupational Therapist*: Micro-routines, sensory grounding, and tactile engagement.
- **Automated SBAR Reports**: Generates formal clinical summaries (*Situation, Background, Assessment, Recommendation*) ready for neurologist consultations.
- **Real-Time De-Escalation Scripts**: Immediate step-by-step guidance during acute sundowning or memory confusion.

### 4. Acoustic Voice Biomarker Sentinel (EchoMyHealth & KAYA)
- **Speech Telemetry**: Measures acoustic latency (ms), pause-to-speech ratio, and sentence duration.
- **Circadian Acoustic Fatigue**: Tracks longitudinal voice slowing and flags evening sundowning fatigue before behavioral escalation occurs.

### 5. PentaMind Visuospatial Polygon Assessment (PentaMind Research)
- **Intersecting Pentagon Drawing Canvas**: Digitized implementation of the MMSE visuospatial drawing assessment.
- **Vector Analysis**: Real-time scoring of stroke count, polygon closure, and intersection coordinates to objectively observe motor and visuospatial stability over time.

### 6. Relief & Dementia Assistance Virtual Presence Room (Relief)
- **Empathetic Family Loops**: Asynchronous, comforting video and audio recordings from family members (e.g. son Deepak from Golaghat tea estate, granddaughter Maina from Bangalore).
- **One-Tap Warm Responses**: High-contrast, dignified buttons allowing the elder to send warm audio replies or request a live phone call when lonely.

### 7. Safe Harbor Geofencing & Circadian Wandering Barometer
- **Interactive Perimeter Monitoring**: Geofenced safe zones (Veranda, Inner Courtyard, Tea Garden Lane) with live beacon telemetry.
- **Wandering Risk Score**: Circadian barometer combining evening time, door proximity, and restlessness.

### 8. WellRemember Family Postcard Board & AI Dignity Filter
- **Live Postcard Board**: Distant relatives submit postcards with warm greetings and recorded voice messages.
- **Automated Moderation**: Filters out triggering or distressing topics before displaying postcards on the elder's tablet.

### 9. Moti the AI Pet Companion (Pawyaya-Inspired)
- **Tactile Calming Companion**: Stroke and pet an affectionate golden pup ("Moti") with interactive petting physics.
- **Rhythmic Guided Breathing**: Visual and acoustic expansion/contraction circle to calm acute anxiety episodes.

### 10. Heirloom & Everyday Keepsake Scanner (Meeshaim M.-Inspired)
- **Tactile Keepsake Grounding**: Scan everyday heirlooms (1968 brass bowl, 1974 phulam gamusa, 1980 radio) to hear oral histories and personal family connections.

### 11. Preserved Core Clinical & Cultural Sentinel Suite
- **Mandatory Daily Assessment Gate**: Pre-UI clinical gate that validates cognitive baseline before granting access to games.
- **Stroke & Hemorrhage Sentinel**: Automated neurological warning telemetry.
- **3D Spatial VR Reminiscence Studio**: WebXR-ready 3D photo memory chambers with 4-second preview cards.
- **Assam & North Eastern Region (NER) Cultural Immersion**: Authentic heritage modules for Rongali Bihu, Majuli Satras, and Brahmaputra river journeys in Assamese, Bengali, Nepali, and English.

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
