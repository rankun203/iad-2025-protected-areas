'use client';

import { useState } from 'react';
import MapComponent from '@/components/MapComponent';
import ChatModal from '@/components/ChatModal';
import SidePanel from '@/components/SidePanel';
import ApplicationModal from '@/components/ApplicationModal';

interface PermitArea {
  id: string;
  name: string;
  type: string;
}

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [requestedAreas, setRequestedAreas] = useState<PermitArea[]>([]);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  const handleObtainPermit = (area: PermitArea) => {
    // Check if area is already in the list to avoid duplicates
    const isAlreadyRequested = requestedAreas.some(
      (existingArea) => existingArea.id === area.id
    );
    
    if (!isAlreadyRequested) {
      setRequestedAreas([...requestedAreas, area]);
    }
  };

  const handleSubmitApplication = () => {
    setIsApplicationModalOpen(true);
    // Clear the requested areas after submission
    setRequestedAreas([]);
  };

  const handleApplicationModalClose = () => {
    setIsApplicationModalOpen(false);
  };

  return (
    <main className="w-full h-screen overflow-hidden">
      <SidePanel 
        requestedAreas={requestedAreas}
        onSubmitApplication={handleSubmitApplication}
      />
      <div className="ml-80 w-full h-screen">
        <MapComponent 
          onChatToggle={handleChatToggle}
          onObtainPermit={handleObtainPermit}
        />
      </div>
      <ChatModal isOpen={isChatOpen} onClose={handleChatClose} />
      <ApplicationModal 
        isOpen={isApplicationModalOpen}
        onClose={handleApplicationModalClose}
      />
    </main>
  );
}
