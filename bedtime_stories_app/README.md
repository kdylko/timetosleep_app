# Time to Sleep - Bedtime Stories Mobile App

A React Native mobile application for bedtime stories, built with Expo and TypeScript.

## Features

- 📚 Browse bedtime stories by categories
- 🎵 Audio narration support
- 🔍 Search functionality
- 🌙 Child-friendly interface
- 📱 Offline reading capabilities
- 🌍 Multi-language support

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Supabase** for backend and database
- **React Navigation** for navigation
- **React Query** for data fetching
- **React Native Paper** for UI components
- **Expo AV** for audio playback

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bedtime_stories_app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit `.env` file with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. Start the development server:
```bash
npm start
```

### Running on Devices

- **iOS**: `npm run ios`
- **Android**: `npm run android`
- **Web**: `npm run web`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/             # App screens
├── navigation/          # Navigation configuration
├── services/            # API and data services
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript definitions
└── assets/              # Static assets
```

## Development Stages

### Stage 1: Project Setup ✅
- [x] Initialize Expo project
- [x] Configure TypeScript
- [x] Install dependencies
- [x] Set up project structure

### Stage 2: Navigation Setup ✅
- [x] Create navigation structure
- [x] Implement basic screens
- [x] Set up routing

### Stage 3: Supabase Integration ✅
- [x] Set up backend connection
- [x] Create data services
- [x] Implement API calls

### Stage 4: Basic UI Components ✅
- [x] Create core UI components
- [x] Implement story cards
- [x] Set up basic screens

### Stage 5: Story Functionality (In Progress)
- [ ] Implement story listing
- [ ] Add story reading
- [ ] Create search functionality

### Stage 6: Audio Features (Planned)
- [ ] Implement audio playback
- [ ] Add audio controls
- [ ] Create audio player screen

### Stage 7: Offline Support (Planned)
- [ ] Add offline capabilities
- [ ] Implement local storage
- [ ] Create sync functionality

### Stage 8: Polish & Advanced Features (Planned)
- [ ] Add search and filters
- [ ] Implement settings
- [ ] Add performance optimizations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@timetosleep.org or create an issue in the repository.
