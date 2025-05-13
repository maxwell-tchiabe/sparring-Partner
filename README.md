[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/pogjester/sparring-Partner/blob/main/README.md)
[![zh](https://img.shields.io/badge/lang-zh-green.svg)](https://github.com/pogjester/sparring-Partner/blob/main/README.zh.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/pogjester/sparring-Partner/blob/main/README.fr.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/pogjester/sparring-Partner/blob/main/README.es.md)

# Sparring Partner 🤖

An advanced AI companion system built with Python and Next.js that provides interactive learning, conversation, and personalized assistance. The platform uses a sophisticated graph-based memory system and multiple AI modules to create an engaging and adaptive user experience.

## Features

- **Advanced Memory System**:
  - Short-term memory using SQLite
  - Long-term memory with graph-based storage
  - Sophisticated memory management and recall
- **Multi-Module Architecture**:

  - Image processing capabilities
  - Speech recognition and synthesis
  - Scheduled tasks and reminders
  - Intelligent chat interface

- **Modern React/Next.js Frontend**:

  - Responsive dashboard with insights
  - Real-time chat interface
  - Administrative controls
  - Progress tracking and notifications

- **Extensible Backend**:
  - MongoDB integration
  - Graph-based knowledge representation
  - Modular system for adding new capabilities
  - Robust error handling and scheduling

## System Architecture

### Backend Components

1. **Core System** (`/backend/src/ai_companion/core/`):

   - Core system settings and configurations
   - Exception handling
   - Prompt management
   - Task scheduling

2. **FastAPI Server** (`/backend/src/ai_companion/interfaces/api/`):

   - RESTful API endpoints
   - Request validation and error handling
   - API documentation with Swagger/OpenAPI
   - Authentication and middleware

3. **Memory Management** (`/backend/src/ai_companion/modules/memory/`):

   - Short-term memory using SQLite
   - Long-term memory with graph database
   - Memory optimization and retrieval

4. **Module System**:

   - Image processing
   - Speech processing
   - Scheduled tasks
   - Memory management

5. **Database Layer**:
   - MongoDB integration
   - Graph database management
   - State persistence

### Frontend Components

1. **Core Pages** (`/frontend/src/app/`):

   - Dashboard view
   - Chat interface
   - Administrative controls
   - User settings

2. **Components** (`/frontend/src/components/`):

   - Chat interface elements
   - Dashboard widgets
   - Common UI components
   - Administrative tools

3. **Services and Utils**:
   - API integration
   - Context management
   - Utility functions
   - Type definitions

## Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- MongoDB (optional)
- Docker (optional)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -e .
```

4. Configure environment variables:

```bash
# Create .env file with required settings
touch .env
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

### Docker Setup

Use Docker Compose to run the entire stack:

```bash
docker-compose up --build
```

## Development

### Running the Application

1. Start the backend FastAPI server:

```bash
cd backend
# Using uvicorn directly
uvicorn ai_companion.interfaces.api.main:app --host 0.0.0.0 --port 8080 --reload

# Or using Docker
docker-compose up backend
```

The FastAPI server provides:

- REST API at `http://localhost:8080/api/v1`
- WebSocket endpoints at `ws://localhost:8080/ws`
- Interactive API documentation at `http://localhost:8080/docs`
- Alternative API documentation at `http://localhost:8080/redoc`

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

3. Access the application at `http://localhost:3000`

### Adding New Features

1. **Backend Modules**:

   - Add new modules in `/backend/src/ai_companion/modules/`
   - Update core system if needed
   - Add appropriate tests

2. **Frontend Components**:
   - Create new components in `/frontend/src/components/`
   - Add new pages in `/frontend/src/app/`
   - Update services and types as needed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
