# Planet Intelligence Maps - Setup Guide

## Overview

This application integrates environmental intelligence into Google Maps, turning everyday navigation into opportunities for environmental action. It overlays WWF deforestation data and biodiversity risk zones onto routes to help users make planet-positive choices.

## Features

- **Route Planning**: Enter start and destination points
- **Environmental Intelligence**: See deforestation zones, biodiversity hotspots, and wildlife corridors along your route
- **Micro-Actions**: Plant trees, choose eco-routes, slow down for wildlife, support restoration projects
- **Impact Tracking**: Track trees planted, forest restored, wildlife protected, and carbon offset
- **Gamification**: Unlock achievements and build streaks
- **Legacy Building**: See your cumulative positive impact for future generations

## Google Maps API Setup

To enable the interactive map functionality:

1. **Get a Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Directions API (optional, for real route calculation)
     - Geocoding API (optional, for address search)
   - Create credentials (API Key)

2. **Configure the API Key**:
   - Open `/src/app/components/MapView.tsx`
   - Replace `YOUR_API_KEY_HERE` with your actual Google Maps API key:
   
   ```typescript
   const { isLoaded } = useJsApiLoader({
     id: 'google-map-script',
     googleMapsApiKey: 'YOUR_ACTUAL_API_KEY_HERE',
   });
   ```

3. **Restrict Your API Key** (Recommended):
   - In Google Cloud Console, restrict your API key to your domain
   - Set HTTP referrer restrictions to prevent unauthorized use

## Environmental Data

The application currently uses mock environmental data based on:
- **WWF GLOBIL** deforestation fronts
- **Biodiversity risk layers** for Pacific Northwest region
- **Wildlife corridor** data

### Production Data Integration

To integrate real environmental data:

1. **WWF Data**: Contact [WWF](https://www.worldwildlife.org/) for access to GLOBIL deforestation data
2. **Biodiversity Layers**: Integrate with services like:
   - [Global Forest Watch](https://www.globalforestwatch.org/)
   - [IUCN Red List API](https://apiv3.iucnredlist.org/)
   - Regional conservation databases

3. **Update the data file**: `/src/app/data/environmentalData.ts`

## How It Works

### Behavior Change Loop

1. **Plan Route**: User enters start and destination
2. **Detect Risk Zones**: System identifies environmental zones along the route
3. **Make It Felt**: Shows local stories about forest loss and wildlife impact
4. **Offer Micro-Actions**: Presents 1-2 simple actions users can take
5. **Reward & Legacy**: Tracks impact and builds a sense of legacy for loved ones

### Psychological Methods

1. **Decision-Time Nudging**: Environmental information at the moment of route planning
2. **Immediate Reward**: Instant feedback and achievement unlocks
3. **Social Proof**: Shareable impact summaries

## Demo Mode

Try the app without entering data:
- Click "Try Demo Route" button
- Automatically loads Seattle → Portland route
- Shows 4-5 environmental zones with real impact stories

## Future Enhancements

- **Real-time Route Calculation**: Integrate Google Directions API
- **Eco-Route Optimization**: Calculate alternative routes that minimize environmental impact
- **Payment Integration**: Enable actual donations to conservation projects
- **Community Features**: Share trips and compete with friends
- **Mobile App**: Native iOS/Android versions
- **Offline Mode**: Download environmental data for offline use

## Technology Stack

- **React 18.3.1**: UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Styling
- **Google Maps API**: Interactive mapping
- **Motion (Framer Motion)**: Animations
- **Recharts**: Data visualization
- **Sonner**: Toast notifications

## Contributing

This is a hackathon prototype. To make it production-ready:

1. Replace mock data with real environmental datasets
2. Implement backend for user accounts and persistent data
3. Add payment processing for tree planting and project support
4. Integrate with actual conservation organizations
5. Add comprehensive error handling and loading states

## License

This project demonstrates environmental technology for positive impact. Feel free to adapt and improve!

---

**Note**: This application is designed to reduce friction in making sustainable choices. The goal is to make the eco-friendly option the easiest option.
