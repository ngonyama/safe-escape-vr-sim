
import { Card } from "@/components/ui/card";

interface ScenarioProps {
  scenario: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    image: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

const ScenarioCard = ({ scenario, isSelected, onClick }: ScenarioProps) => {
  return (
    <Card 
      className={`scenario-card ${isSelected ? 'ring-2 ring-safety-blue ring-offset-2' : ''}`}
      onClick={onClick}
    >
      {/* Placeholder image for now */}
      <div className="h-48 bg-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            scenario.difficulty === 'Easy' ? 'bg-safety-green text-white' : 
            scenario.difficulty === 'Medium' ? 'bg-safety-orange text-white' : 
            'bg-safety-red text-white'
          }`}>
            {scenario.difficulty}
          </span>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
        <p className="text-gray-600 mb-4">{scenario.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-4">⏱️ {scenario.duration}</span>
        </div>
      </div>
    </Card>
  );
};

export default ScenarioCard;
