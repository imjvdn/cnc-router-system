import React, { useState } from 'react';
import { ChevronRight, FileText, Settings, Zap, Wrench, BookOpen, FolderOpen } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number[] }>({});
  const [showQuizResults, setShowQuizResults] = useState<{ [key: string]: boolean }>({});

  const navigationItems = [
    { id: 'introduction', label: 'Introduction', icon: BookOpen },
    { id: 'title-sheet', label: 'Title Sheet', icon: FileText },
    { id: 'component-list', label: 'Component List', icon: Settings },
    { id: 'wire-pull', label: 'Wire Pull', icon: Zap },
    { id: 'schematics', label: 'Schematics', icon: Wrench },
    { id: 'additional-docs', label: 'Additional Documents', icon: FolderOpen },
  ];

  const quizzes: { [key: string]: Quiz } = {
    'title-sheet': {
      title: 'Title Sheet Knowledge Check',
      questions: [
        {
          question: 'What is the primary purpose of the title sheet in technical documentation?',
          options: [
            'To provide installation instructions',
            'To identify the project and key information',
            'To list all components used',
            'To show wiring diagrams'
          ],
          correctAnswer: 1
        },
        {
          question: 'Which information is typically NOT found on a title sheet?',
          options: [
            'Project name and number',
            'Revision history',
            'Detailed component specifications',
            'Drawing scale and date'
          ],
          correctAnswer: 2
        },
        {
          question: 'Who is responsible for approving the title sheet before production?',
          options: [
            'Machine operator',
            'Quality control inspector',
            'Project engineer or manager',
            'Maintenance technician'
          ],
          correctAnswer: 2
        }
      ]
    },
    'component-list': {
      title: 'Component List Assessment',
      questions: [
        {
          question: 'What is the most important aspect when reviewing a component list?',
          options: [
            'Alphabetical order of components',
            'Color coding of items',
            'Accuracy of part numbers and quantities',
            'Font size and formatting'
          ],
          correctAnswer: 2
        },
        {
          question: 'Which component specification is critical for CNC router operations?',
          options: [
            'Component weight',
            'Manufacturing date',
            'Electrical ratings and mechanical tolerances',
            'Packaging dimensions'
          ],
          correctAnswer: 2
        },
        {
          question: 'How should obsolete components be handled in the component list?',
          options: [
            'Remove them completely',
            'Mark as obsolete with replacement part info',
            'Move to the bottom of the list',
            'Change their color to red'
          ],
          correctAnswer: 1
        }
      ]
    },
    'wire-pull': {
      title: 'Wire Pull Procedures Quiz',
      questions: [
        {
          question: 'What is the first step before beginning any wire pull operation?',
          options: [
            'Gather all necessary tools',
            'Verify power is disconnected and locked out',
            'Check wire gauge requirements',
            'Measure cable lengths needed'
          ],
          correctAnswer: 1
        },
        {
          question: 'Which factor is most critical when determining wire gauge for motor connections?',
          options: [
            'Wire color preference',
            'Available conduit space',
            'Current carrying capacity and voltage drop',
            'Cost of wire materials'
          ],
          correctAnswer: 2
        },
        {
          question: 'What should be done immediately after completing a wire pull?',
          options: [
            'Test continuity and verify connections',
            'Clean up work area',
            'Update documentation',
            'Take photos for records'
          ],
          correctAnswer: 0
        }
      ]
    },
    'schematics': {
      title: 'Schematics Understanding Test',
      questions: [
        {
          question: 'What does a dashed line typically represent in electrical schematics?',
          options: [
            'High voltage connection',
            'Mechanical linkage or control relationship',
            'Ground connection',
            'Emergency stop circuit'
          ],
          correctAnswer: 1
        },
        {
          question: 'How are normally open (NO) contacts represented in ladder logic?',
          options: [
            'Closed contacts --|--',
            'Open contacts --| |--',
            'Circle with line through it',
            'Triangle symbol'
          ],
          correctAnswer: 1
        },
        {
          question: 'What is the purpose of reference designators in schematics?',
          options: [
            'To show wire colors',
            'To indicate voltage levels',
            'To uniquely identify each component',
            'To show physical locations'
          ],
          correctAnswer: 2
        }
      ]
    }
  };

  const handleQuizAnswer = (sectionId: string, questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionIndex]: answerIndex
      }
    }));
  };

  const submitQuiz = (sectionId: string) => {
    setShowQuizResults(prev => ({
      ...prev,
      [sectionId]: true
    }));
  };

  const resetQuiz = (sectionId: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [sectionId]: {}
    }));
    setShowQuizResults(prev => ({
      ...prev,
      [sectionId]: false
    }));
  };

  const getQuizScore = (sectionId: string): number => {
    const quiz = quizzes[sectionId];
    const answers = quizAnswers[sectionId] || {};
    let correct = 0;
    
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    return correct;
  };

  const renderQuiz = (sectionId: string) => {
    const quiz = quizzes[sectionId];
    if (!quiz) return null;

    const answers = quizAnswers[sectionId] || {};
    const showResults = showQuizResults[sectionId];
    const score = getQuizScore(sectionId);

    return (
      <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
        </div>
        <div className="p-6">
          {quiz.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-6 last:mb-0">
              <h4 className="font-medium text-gray-900 mb-3">
                {questionIndex + 1}. {question.question}
              </h4>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[questionIndex] === optionIndex;
                  const isCorrect = optionIndex === question.correctAnswer;
                  const showCorrectAnswer = showResults && isCorrect;
                  const showIncorrectSelected = showResults && isSelected && !isCorrect;
                  
                  return (
                    <label
                      key={optionIndex}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        showCorrectAnswer
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : showIncorrectSelected
                          ? 'bg-red-50 border-red-200 text-red-800'
                          : isSelected
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${sectionId}-question-${questionIndex}`}
                        value={optionIndex}
                        checked={isSelected}
                        onChange={() => handleQuizAnswer(sectionId, questionIndex, optionIndex)}
                        disabled={showResults}
                        className="mr-3 text-blue-600"
                      />
                      <span>{option}</span>
                      {showCorrectAnswer && (
                        <span className="ml-auto text-green-600 font-semibold">✓ Correct</span>
                      )}
                      {showIncorrectSelected && (
                        <span className="ml-auto text-red-600 font-semibold">✗ Incorrect</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            {showResults ? (
              <div className="flex items-center justify-between w-full">
                <div className="text-lg font-semibold">
                  Score: {score}/{quiz.questions.length} 
                  <span className={`ml-2 ${score === quiz.questions.length ? 'text-green-600' : score >= quiz.questions.length * 0.7 ? 'text-yellow-600' : 'text-red-600'}`}>
                    ({Math.round((score / quiz.questions.length) * 100)}%)
                  </span>
                </div>
                <button
                  onClick={() => resetQuiz(sectionId)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <button
                onClick={() => submitQuiz(sectionId)}
                disabled={Object.keys(answers).length < quiz.questions.length}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Introduction</h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <p className="text-gray-700 mb-4">
                Welcome to the comprehensive CNC Router System Manual. This interactive documentation provides
                detailed information about your CNC router system, including setup procedures, component
                specifications, wiring guidelines, and maintenance protocols.
              </p>
              <p className="text-gray-700 mb-4">
                Navigate through the different sections using the sidebar menu to access specific information
                about your system. Each technical section includes knowledge check quizzes to ensure proper
                understanding of critical procedures.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-blue-900 mb-2">Safety Notice</h3>
                <p className="text-blue-800">
                  Always follow proper safety procedures when working with CNC equipment. Ensure all power
                  sources are properly locked out before performing any maintenance or modifications.
                </p>
              </div>
            </div>
          </div>
        );

      case 'title-sheet':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Title Sheet</h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Project Information</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Project Name:</strong> [Project Name Placeholder]</p>
                    <p><strong>Model Number:</strong> [Model Number Placeholder]</p>
                    <p><strong>Serial Number:</strong> [Serial Number Placeholder]</p>
                    <p><strong>Revision:</strong> [Revision Placeholder]</p>
                    <p><strong>Date:</strong> [Date Placeholder]</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Specifications</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Working Area:</strong> [Dimensions Placeholder]</p>
                    <p><strong>Power Requirements:</strong> [Power Specs Placeholder]</p>
                    <p><strong>Control System:</strong> [Control System Placeholder]</p>
                    <p><strong>Software Version:</strong> [Software Version Placeholder]</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 bg-gray-50 p-4 rounded-lg">
                <p className="text-center text-gray-600 italic">
                  [Title Sheet Diagram Placeholder - Path: /images/title-sheet-diagram.png]
                </p>
              </div>
            </div>
            {renderQuiz('title-sheet')}
          </div>
        );

      case 'component-list':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Component List</h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Item #</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Part Number</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Specifications</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">001</td>
                      <td className="border border-gray-300 px-4 py-2">[Part Number 1]</td>
                      <td className="border border-gray-300 px-4 py-2">[Component Description 1]</td>
                      <td className="border border-gray-300 px-4 py-2">[Qty 1]</td>
                      <td className="border border-gray-300 px-4 py-2">[Specifications 1]</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">002</td>
                      <td className="border border-gray-300 px-4 py-2">[Part Number 2]</td>
                      <td className="border border-gray-300 px-4 py-2">[Component Description 2]</td>
                      <td className="border border-gray-300 px-4 py-2">[Qty 2]</td>
                      <td className="border border-gray-300 px-4 py-2">[Specifications 2]</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">003</td>
                      <td className="border border-gray-300 px-4 py-2">[Part Number 3]</td>
                      <td className="border border-gray-300 px-4 py-2">[Component Description 3]</td>
                      <td className="border border-gray-300 px-4 py-2">[Qty 3]</td>
                      <td className="border border-gray-300 px-4 py-2">[Specifications 3]</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 border border-gray-300 bg-gray-50 p-4 rounded-lg">
                <p className="text-center text-gray-600 italic">
                  [Component Assembly Diagram Placeholder - Path: /images/component-assembly.png]
                </p>
              </div>
            </div>
            {renderQuiz('component-list')}
          </div>
        );

      case 'wire-pull':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Wire Pull</h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Wire Pull Procedures</h3>
              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">⚠️ Safety Requirements</h4>
                  <ul className="list-disc list-inside text-red-800 space-y-1">
                    <li>Verify all power sources are disconnected and locked out</li>
                    <li>Use appropriate personal protective equipment</li>
                    <li>Follow OSHA electrical safety standards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Wire Specifications</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Motor power cables: [Wire Gauge Placeholder] AWG</li>
                    <li>Control signal wires: [Wire Gauge Placeholder] AWG</li>
                    <li>Emergency stop circuits: [Wire Gauge Placeholder] AWG</li>
                    <li>Grounding conductors: [Wire Gauge Placeholder] AWG</li>
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-300 bg-gray-50 p-4 rounded-lg">
                  <p className="text-center text-gray-600 italic">
                    [Wire Pull Diagram 1 Placeholder - Path: /images/wire-pull-diagram-1.png]
                  </p>
                </div>
                <div className="border border-gray-300 bg-gray-50 p-4 rounded-lg">
                  <p className="text-center text-gray-600 italic">
                    [Wire Pull Diagram 2 Placeholder - Path: /images/wire-pull-diagram-2.png]
                  </p>
                </div>
              </div>
            </div>
            {renderQuiz('wire-pull')}
          </div>
        );

      case 'schematics':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Schematics</h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Electrical Schematics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Main Power Circuit</h4>
                  <div className="border border-gray-300 bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-center text-gray-600 italic">
                      [Main Power Schematic Placeholder - Path: /images/main-power-schematic.png]
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Control Circuit</h4>
                  <div className="border border-gray-300 bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-center text-gray-600 italic">
                      [Control Circuit Schematic Placeholder - Path: /images/control-circuit-schematic.png]
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Schematic Legend</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-800">
                  <div>
                    <p><strong>NO:</strong> Normally Open</p>
                    <p><strong>NC:</strong> Normally Closed</p>
                  </div>
                  <div>
                    <p><strong>CR:</strong> Control Relay</p>
                    <p><strong>M:</strong> Motor Starter</p>
                  </div>
                  <div>
                    <p><strong>T:</strong> Transformer</p>
                    <p><strong>OL:</strong> Overload</p>
                  </div>
                </div>
              </div>
            </div>
            {renderQuiz('schematics')}
          </div>
        );

      case 'additional-docs':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Additional Documents</h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Reference Documents</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center p-3 bg-gray-50 rounded-lg border">
                      <FileText className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">Installation Manual</p>
                        <p className="text-sm text-gray-600">[Path: /docs/installation-manual.pdf]</p>
                      </div>
                    </li>
                    <li className="flex items-center p-3 bg-gray-50 rounded-lg border">
                      <FileText className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">Maintenance Schedule</p>
                        <p className="text-sm text-gray-600">[Path: /docs/maintenance-schedule.pdf]</p>
                      </div>
                    </li>
                    <li className="flex items-center p-3 bg-gray-50 rounded-lg border">
                      <FileText className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">Safety Procedures</p>
                        <p className="text-sm text-gray-600">[Path: /docs/safety-procedures.pdf]</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Certificates</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center p-3 bg-gray-50 rounded-lg border">
                      <FileText className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium">CE Certification</p>
                        <p className="text-sm text-gray-600">[Path: /certs/ce-certification.pdf]</p>
                      </div>
                    </li>
                    <li className="flex items-center p-3 bg-gray-50 rounded-lg border">
                      <FileText className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium">UL Listing</p>
                        <p className="text-sm text-gray-600">[Path: /certs/ul-listing.pdf]</p>
                      </div>
                    </li>
                    <li className="flex items-center p-3 bg-gray-50 rounded-lg border">
                      <FileText className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium">Quality Assurance</p>
                        <p className="text-sm text-gray-600">[Path: /certs/quality-assurance.pdf]</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">📋 Document Control</h4>
                <p className="text-yellow-800">
                  All documents are controlled versions. For the most current revisions, contact your
                  DMS CNC Routers technical support team or visit our customer portal.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <div className="w-48 h-12 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-600 text-sm">[Company Logo Path: /images/dms-logo.png]</span>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">CNC Router System Manual</h1>
              <p className="text-gray-600">Interactive Technical Documentation</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default App;