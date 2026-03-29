import React from 'react';
import { AmalanProvider } from './src/context/AmalanContext';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  return (
    <AmalanProvider>
      <DashboardScreen />
    </AmalanProvider>
  );
}