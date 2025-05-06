
import { useEffect, useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VREnvironment from '../components/VREnvironment';
import ScenarioInstructions from '../components/ScenarioInstructions';

interface Task {
  id: string;
  description: string;
  completed: boolean;
}

const ScenarioPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scenarioData, setScenarioData] = useState<any>(null);

  // In a real app, we'd fetch this from an API
  useEffect(() => {
    // Simulate loading scenario data
    setTimeout(() => {
      if (id === 'fire') {
        setScenarioData({
          title: 'Fire Drill',
          description: 'A fire has broken out in the office. Your task is to safely evacuate the building while following correct fire safety procedures.',
          tasks: [
            { id: '1', description: 'Locate the nearest fire extinguisher', completed: false },
            { id: '2', description: 'Use the fire extinguisher correctly', completed: false },
            { id: '3', description: 'Find and follow the evacuation route', completed: false },
            { id: '4', description: 'Exit the building safely', completed: false }
          ],
          environment: 'office',
        });
        setTasks([
          { id: '1', description: 'Locate the nearest fire extinguisher', completed: false },
          { id: '2', description: 'Use the fire extinguisher correctly', completed: false },
          { id: '3', description: 'Find and follow the evacuation route', completed: false },
          { id: '4', description: 'Exit the building safely', completed: false }
        ]);
      } else if (id === 'evacuation') {
        setScenarioData({
          title: 'Emergency Evacuation',
          description: 'The building needs to be evacuated immediately. Your task is to safely find the exit while following proper evacuation procedures.',
          tasks: [
            { id: '1', description: 'Follow evacuation signs', completed: false },
            { id: '2', description: 'Help others evacuate if possible', completed: false },
            { id: '3', description: 'Exit the building within the time limit', completed: false },
            { id: '4', description: 'Reach the assembly point', completed: false }
          ],
          environment: 'office',
        });
        setTasks([
          { id: '1', description: 'Follow evacuation signs', completed: false },
          { id: '2', description: 'Help others evacuate if possible', completed: false },
          { id: '3', description: 'Exit the building within the time limit', completed: false },
          { id: '4', description: 'Reach the assembly point', completed: false }
        ]);
      } else if (id === 'hazards') {
        setScenarioData({
          title: 'Hazard Identification',
          description: 'Identify at least 5 safety hazards or violations in the office environment.',
          tasks: [
            { id: '1', description: 'Find blocked emergency exit', completed: false },
            { id: '2', description: 'Identify tripping hazards', completed: false },
            { id: '3', description: 'Find faulty electrical equipment', completed: false },
            { id: '4', description: 'Identify improper storage of materials', completed: false },
            { id: '5', description: 'Find missing safety signage', completed: false }
          ],
          environment: 'office',
        });
        setTasks([
          { id: '1', description: 'Find blocked emergency exit', completed: false },
          { id: '2', description: 'Identify tripping hazards', completed: false },
          { id: '3', description: 'Find faulty electrical equipment', completed: false },
          { id: '4', description: 'Identify improper storage of materials', completed: false },
          { id: '5', description: 'Find missing safety signage', completed: false }
        ]);
      }
      setLoading(false);
    }, 1500);
  }, [id]);

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    
    // Check if all tasks are completed
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    if (updatedTasks.every(task => task.completed)) {
      // Calculate score based on completed tasks
      const completedTasks = updatedTasks.filter(task => task.completed).length;
      const totalTasks = updatedTasks.length;
      const calculatedScore = Math.round((completedTasks / totalTasks) * 100);
      setScore(calculatedScore);
    }
  };

  const handleStartScenario = () => {
    setShowInstructions(false);
  };

  const handleExit = () => {
    navigate('/');
  };

  const handleRestart = () => {
    // Reset tasks and score
    setTasks(tasks.map(task => ({ ...task, completed: false })));
    setScore(null);
    setShowInstructions(true);
  };

  const handleDownloadCertificate = () => {
    alert('Certificate downloaded successfully!');
    // In a real app, we'd generate and download a PDF certificate
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-glow rounded-full bg-blue-100 p-8">
          <div className="text-safety-blue text-lg font-medium">Loading scenario...</div>
        </div>
      </div>
    );
  }

  if (!scenarioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">Scenario not found or failed to load.</p>
          <Button onClick={handleExit}>Return to Home</Button>
        </div>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-safety-gray text-center mb-6">Training Complete!</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-medium text-safety-gray mb-2">Your Score</h2>
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-safety-blue">
                <span className="text-3xl font-bold text-safety-blue">{score}%</span>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-medium text-safety-gray mb-4">Tasks Completed</h2>
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-start">
                  <span className={`inline-block w-5 h-5 rounded-full mr-2 mt-0.5 ${task.completed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={task.completed ? 'text-gray-800' : 'text-gray-500'}>{task.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleRestart}>Try Again</Button>
            <Button className="bg-safety-blue text-white" onClick={handleDownloadCertificate}>Download Certificate</Button>
            <Button variant="outline" onClick={handleExit} className="sm:col-span-2">Return to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <ScenarioInstructions 
        scenario={scenarioData} 
        onStart={handleStartScenario} 
        onExit={handleExit}
      />
    );
  }

  return (
    <div className="h-screen w-full relative">
      {/* Task panel overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-w-xs">
        <h3 className="font-bold text-safety-gray mb-2">{scenarioData.title}</h3>
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => !task.completed && handleCompleteTask(task.id)} 
                className="mr-2" 
              />
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.description}
              </span>
            </div>
          ))}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExit} 
          className="mt-4 w-full"
        >
          Exit
        </Button>
      </div>
      
      {/* VR Environment */}
      <Suspense fallback={<div>Loading 3D environment...</div>}>
        <VREnvironment 
          environmentType={scenarioData.environment} 
          scenarioType={id || ''}
          onCompleteTask={handleCompleteTask}
        />
      </Suspense>
    </div>
  );
};

export default ScenarioPage;
