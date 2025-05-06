
import { Button } from "@/components/ui/button";

interface ScenarioInstructionsProps {
  scenario: {
    title: string;
    description: string;
    tasks: {
      id: string;
      description: string;
    }[];
  };
  onStart: () => void;
  onExit: () => void;
}

const ScenarioInstructions = ({ scenario, onStart, onExit }: ScenarioInstructionsProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-safety-gray mb-6">{scenario.title}</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium text-safety-gray mb-2">Instructions</h2>
          <p className="text-gray-600 mb-4">{scenario.description}</p>
          
          <div className="bg-blue-50 border-l-4 border-safety-blue p-4">
            <h3 className="font-medium text-safety-blue mb-2">Controls</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Use WASD or arrow keys to move around</li>
              <li>Use mouse or touch to look around</li>
              <li>Click on objects to interact with them</li>
              <li>ESC key to pause the simulation</li>
            </ul>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-medium text-safety-gray mb-2">Objectives</h2>
          <ul className="space-y-2">
            {scenario.tasks.map(task => (
              <li key={task.id} className="flex items-start">
                <span className="inline-block w-5 h-5 rounded-full bg-gray-200 mr-2 mt-0.5"></span>
                <span>{task.description}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button variant="outline" onClick={onExit}>
            Return to Home
          </Button>
          <Button 
            className="bg-safety-blue hover:bg-blue-600 text-white" 
            onClick={onStart}
          >
            Start Scenario
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioInstructions;
