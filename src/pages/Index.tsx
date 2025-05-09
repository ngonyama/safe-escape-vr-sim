
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ScenarioCard from '../components/ScenarioCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenarios = [
    {
      id: 'fire',
      title: 'Fire Drill',
      description: 'Learn how to safely evacuate during a fire emergency and use fire extinguishers.',
      difficulty: 'Medium',
      duration: '5-10 min',
      image: '/scenarios/fire.jpg',
    },
    {
      id: 'evacuation',
      title: 'Emergency Evacuation',
      description: 'Practice evacuating a building during various emergency situations.',
      difficulty: 'Easy',
      duration: '3-5 min',
      image: '/scenarios/evacuation.jpg',
    },
    {
      id: 'hazards',
      title: 'Hazard Identification',
      description: 'Identify workplace hazards and safety violations in an office environment.',
      difficulty: 'Hard',
      duration: '10-15 min',
      image: '/scenarios/hazards.jpg',
    },
  ];

  const handleStartSimulation = () => {
    if (selectedScenario) {
      navigate(`/scenario/${selectedScenario}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="SafeEscape VR" className="h-8 w-auto mr-2" />
            <h1 className="text-2xl font-bold text-safety-gray">VR</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-safety-gray mb-6">
            Safety Simulation
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice emergency procedures in realistic 3D environments. 
            No downloads required. Works on computers, phones, and VR headsets.
          </p>
          <div className="flex justify-center">
            <Button 
              className="bg-safety-blue hover:bg-opacity-90 text-white px-8 py-3 text-lg rounded-md"
              onClick={() => document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Choose a Scenario
            </Button>
          </div>
        </div>
      </section>

      {/* Scenario Selection */}
      <section id="scenarios" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-safety-gray mb-2 text-center">
            Training Scenarios
          </h2>
          <p className="text-gray-600 mb-12 text-center">
            Select a scenario to begin your training
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {scenarios.map((scenario) => (
              <ScenarioCard 
                key={scenario.id}
                scenario={scenario}
                isSelected={selectedScenario === scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              className="btn-primary text-lg py-3 px-10"
              disabled={!selectedScenario}
              onClick={handleStartSimulation}
            >
              Start Simulation
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-safety-gray mb-8 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-safety-blue">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Choose a Scenario</h3>
              <p className="text-gray-600">Select from our premade training scenarios designed for different workplace situations.</p>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-safety-blue">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Complete Training</h3>
              <p className="text-gray-600">Navigate through the 3D environment and respond to emergency situations correctly.</p>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-safety-blue">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Certified</h3>
              <p className="text-gray-600">Receive a score based on your performance and download your training certificate.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-safety-gray text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">SafeEscape VR</h3>
            <p className="text-gray-300">© 2025 SafeEscape VR. All rights reserved.</p>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white">Terms of Use</a>
            <a href="#" className="text-gray-300 hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
