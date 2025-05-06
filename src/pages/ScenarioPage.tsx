import { useEffect, useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VREnvironment from '../components/VREnvironment';
import ScenarioInstructions from '../components/ScenarioInstructions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Download, FileText, ShieldCheck, ArrowRight } from 'lucide-react';

interface Task {
  id: string;
  description: string;
  completed: boolean;
}

interface PerformanceData {
  category: string;
  score: number;
}

const ScenarioPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Performance metrics (would come from real tracking in a production app)
  const [performanceMetrics, setPerformanceMetrics] = useState({
    accuracy: 0,
    reactionTime: 0,
    decisionQuality: 0,
    safetyAwareness: 0
  });

  // Hazard performance data for chart
  const [hazardPerformance, setHazardPerformance] = useState<PerformanceData[]>([]);

  // Add a complete button functionality
  const [manualComplete, setManualComplete] = useState(false);

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

  // Start timer when instructions are dismissed
  useEffect(() => {
    if (!showInstructions && startTime === null) {
      setStartTime(Date.now());
    }
  }, [showInstructions, startTime]);

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    
    // Check if all tasks are completed or manual complete is triggered
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    if (updatedTasks.every(task => task.completed) || manualComplete) {
      completeScenario(updatedTasks);
    }
  };

  // New function to manually complete the scenario
  const handleManualComplete = () => {
    setManualComplete(true);
    completeScenario(tasks);
  };

  // Extracted scenario completion logic
  const completeScenario = (currentTasks: Task[]) => {
    // Calculate score based on completed tasks
    const completedTasks = currentTasks.filter(task => task.completed).length;
    const totalTasks = currentTasks.length;
    const calculatedScore = Math.round((completedTasks / totalTasks) * 100);
    
    // Calculate time spent
    if (startTime) {
      const endTime = Date.now();
      const timeElapsed = Math.floor((endTime - startTime) / 1000); // in seconds
      setTimeSpent(timeElapsed);
    }
    
    // Generate performance metrics (simulated in this demo)
    generatePerformanceMetrics(calculatedScore);
    
    setScore(calculatedScore);
  };

  const generatePerformanceMetrics = (score: number) => {
    // Simulating randomized but realistic metrics based on the score
    // In a real app, these would be calculated from actual user interactions
    const baseAccuracy = Math.min(100, score + Math.floor(Math.random() * 10) - 5);
    const baseReactionTime = Math.max(60, 100 - score/2 + Math.floor(Math.random() * 20) - 10);
    const baseDecisionQuality = Math.min(100, score - 5 + Math.floor(Math.random() * 15));
    const baseSafetyAwareness = Math.min(100, score + Math.floor(Math.random() * 15) - 5);
    
    setPerformanceMetrics({
      accuracy: baseAccuracy,
      reactionTime: baseReactionTime,
      decisionQuality: baseDecisionQuality,
      safetyAwareness: baseSafetyAwareness
    });
    
    // Generate hazard performance data for the chart
    if (id === 'fire') {
      setHazardPerformance([
        { category: 'Fire Detection', score: Math.min(100, score + Math.floor(Math.random() * 15) - 5) },
        { category: 'Evacuation', score: Math.min(100, score - 10 + Math.floor(Math.random() * 15)) },
        { category: 'Equipment Use', score: Math.min(100, score - 5 + Math.floor(Math.random() * 10)) },
        { category: 'Protocol Adherence', score: Math.min(100, score + Math.floor(Math.random() * 10) - 5) }
      ]);
    } else if (id === 'evacuation') {
      setHazardPerformance([
        { category: 'Route Finding', score: Math.min(100, score + Math.floor(Math.random() * 15) - 5) },
        { category: 'Speed', score: Math.min(100, score - 5 + Math.floor(Math.random() * 10)) },
        { category: 'Procedure', score: Math.min(100, score - 10 + Math.floor(Math.random() * 15)) },
        { category: 'Assistance', score: Math.min(100, score + Math.floor(Math.random() * 10) - 5) }
      ]);
    } else if (id === 'hazards') {
      setHazardPerformance([
        { category: 'Identification', score: Math.min(100, score + Math.floor(Math.random() * 15) - 5) },
        { category: 'Assessment', score: Math.min(100, score - 5 + Math.floor(Math.random() * 10)) },
        { category: 'Prioritization', score: Math.min(100, score - 10 + Math.floor(Math.random() * 15)) },
        { category: 'Reporting', score: Math.min(100, score + Math.floor(Math.random() * 10) - 5) }
      ]);
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
    setStartTime(null);
    setTimeSpent(0);
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
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    };
    
    // Strengths and weaknesses based on performance
    const strengths = [];
    const weaknesses = [];
    const improvements = [];
    
    // Determine strengths and weaknesses based on performance metrics
    if (performanceMetrics.accuracy > 80) strengths.push("Excellent hazard identification accuracy");
    else if (performanceMetrics.accuracy < 60) weaknesses.push("Needs improvement in hazard identification accuracy");
    
    if (performanceMetrics.reactionTime < 70) strengths.push("Quick reaction time to emergency situations");
    else if (performanceMetrics.reactionTime > 80) weaknesses.push("Slower than recommended reaction time");
    
    if (performanceMetrics.decisionQuality > 75) strengths.push("Strong decision making under pressure");
    else if (performanceMetrics.decisionQuality < 60) weaknesses.push("Decision making could be improved");
    
    if (performanceMetrics.safetyAwareness > 80) strengths.push("Exceptional safety awareness");
    else if (performanceMetrics.safetyAwareness < 65) weaknesses.push("Safety awareness needs improvement");
    
    // Standard improvements everyone should consider
    improvements.push("Regular refresher training every 6 months");
    improvements.push("Practice emergency procedures in team settings");
    improvements.push("Review safety guidelines for this specific scenario");
    
    // Recommended next scenarios based on current scenario
    const recommendedScenarios = [];
    if (id === 'fire') {
      recommendedScenarios.push({name: "Emergency Evacuation", id: "evacuation"});
      recommendedScenarios.push({name: "Hazard Identification", id: "hazards"});
    } else if (id === 'evacuation') {
      recommendedScenarios.push({name: "Fire Drill", id: "fire"});
      recommendedScenarios.push({name: "Hazard Identification", id: "hazards"});
    } else {
      recommendedScenarios.push({name: "Fire Drill", id: "fire"});
      recommendedScenarios.push({name: "Emergency Evacuation", id: "evacuation"});
    }
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-safety-gray">Training Complete!</h1>
            <p className="text-gray-600 mt-2">Here's how you performed in the {scenarioData.title}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Overall Score */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Overall Score</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-center">
                <div className="w-32 h-32 rounded-full mx-auto bg-blue-100 flex items-center justify-center border-4 border-safety-blue">
                  <span className="text-4xl font-bold text-safety-blue">{score}%</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Time Metrics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Time Performance</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Time Spent</span>
                      <span className="text-sm font-medium">{formatTime(timeSpent)}</span>
                    </div>
                    <Progress value={Math.min(100, (timeSpent / 180) * 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Reaction Time</span>
                      <span className="text-sm font-medium">{performanceMetrics.reactionTime}%</span>
                    </div>
                    <Progress value={100 - performanceMetrics.reactionTime} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Safety Awareness */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Safety Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-sm font-medium">{performanceMetrics.accuracy}%</span>
                    </div>
                    <Progress value={performanceMetrics.accuracy} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Safety Awareness</span>
                      <span className="text-sm font-medium">{performanceMetrics.safetyAwareness}%</span>
                    </div>
                    <Progress value={performanceMetrics.safetyAwareness} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance by Hazard Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>Breakdown of your performance across different safety categories</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ChartContainer 
                  config={{
                    performance: { theme: { light: "#3b82f6", dark: "#60a5fa" } }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hazardPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                      />
                      <Bar dataKey="score" name="performance" fill="var(--color-performance)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            {/* Key Findings */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Key Findings</CardTitle>
                <CardDescription>Analysis of your performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                      <ShieldCheck size={16} /> Strengths
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {strengths.map((strength, i) => (
                        <li key={i} className="text-gray-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {weaknesses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-amber-600 mb-2 flex items-center gap-2">
                      <FileText size={16} /> Areas for Improvement
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {weaknesses.map((weakness, i) => (
                        <li key={i} className="text-gray-700">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Tasks Completed Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tasks Completed</CardTitle>
              <CardDescription>Review of all scenario objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>{task.description}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={task.completed ? "default" : "outline"}>
                          {task.completed ? "Completed" : "Incomplete"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Recommended Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recommended Next Steps</CardTitle>
              <CardDescription>Suggestions to improve your safety skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-safety-gray mb-3">Suggestions for Improvement</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {improvements.map((improvement, i) => (
                      <li key={i} className="text-gray-700">{improvement}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-safety-gray mb-3">Recommended Training Scenarios</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedScenarios.map((scenario, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => navigate(`/scenario/${scenario.id}`)}
                      >
                        <ArrowRight className="mr-2" size={16} />
                        {scenario.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={handleRestart}
              className="flex items-center"
            >
              <span>Try Again</span>
            </Button>
            
            <Button 
              className="bg-safety-blue text-white flex items-center" 
              onClick={handleDownloadCertificate}
            >
              <Download className="mr-2" size={16} />
              <span>Download Certificate</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleExit} 
              className="flex items-center"
            >
              <span>Return to Home</span>
            </Button>
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
        <div className="mt-4 flex flex-col space-y-2">
          <Button 
            onClick={handleManualComplete}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Complete Training
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExit} 
          >
            Exit
          </Button>
        </div>
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
