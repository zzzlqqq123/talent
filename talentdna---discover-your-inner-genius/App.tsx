
import React, { useState, useEffect } from 'react';
import { ASSESSMENT_QUESTIONS } from './constants';
import { AssessmentState, AnalysisResult, Question } from './types';
import { analyzeTalentResults } from './services/geminiService';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [state, setState] = useState<AssessmentState>('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isError, setIsError] = useState(false);

  const startQuiz = () => {
    setState('quiz');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswer = (question: Question, value: number, label: string) => {
    const newAnswers = [...answers, { question: question.text, selected: label, score: value }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      processResults(newAnswers);
    }
  };

  const processResults = async (finalAnswers: any[]) => {
    setState('analyzing');
    try {
      const analysis = await analyzeTalentResults(finalAnswers);
      setResult(analysis);
      setState('result');
    } catch (error) {
      console.error(error);
      setIsError(true);
      setState('home');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 tracking-tight">
          TalentDNA
        </h1>
        <p className="text-gray-500 font-medium">解密你的潜在天赋基因</p>
      </div>

      {state === 'home' && (
        <div className="glass p-8 md:p-12 rounded-[2.5rem] text-center shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">准备好发现真实的自己了吗？</h2>
          <p className="text-gray-600 mb-10 leading-relaxed max-w-md mx-auto text-lg">
            基于心理学与行为学模型，我们的 AI 将分析您的选择，揭示您在逻辑、创意、社交等多个维度的天赋潜能。
          </p>
          <Button onClick={startQuiz} size="lg" className="w-full md:w-auto">
            立即开始评估
          </Button>
          {isError && <p className="mt-4 text-red-500">分析出现错误，请稍后再试。</p>}
        </div>
      )}

      {state === 'quiz' && (
        <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">问题 {currentQuestionIndex + 1} / {ASSESSMENT_QUESTIONS.length}</span>
              <span className="text-xs text-gray-400 font-medium">{Math.round(((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100)}% 完成</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out" 
                style={{ width: `${((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-tight">
            {ASSESSMENT_QUESTIONS[currentQuestionIndex].text}
          </h3>

          <div className="grid gap-4">
            {ASSESSMENT_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(ASSESSMENT_QUESTIONS[currentQuestionIndex], opt.value, opt.label)}
                className="group relative p-6 text-left border-2 border-transparent bg-white/50 hover:bg-white hover:border-indigo-100 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-colors" />
                <span className="text-gray-700 font-medium text-lg">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {state === 'analyzing' && (
        <div className="text-center py-20 animate-pulse">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping" />
            <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin" />
            <div className="flex items-center justify-center h-full">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI 深度分析中...</h2>
          <p className="text-gray-500">正在对比 100,000+ 行为数据模型</p>
        </div>
      )}

      {state === 'result' && result && (
        <div className="space-y-8 animate-in zoom-in-95 fade-in duration-1000">
          {/* Main Card */}
          <div className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <svg className="w-48 h-48" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4F46E5" d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87.1,-15.7,86.2,-0.5C85.3,14.6,80.1,29.3,71.8,42.1C63.5,54.9,52.1,65.8,38.8,72.7C25.5,79.5,10.3,82.3,-4.2,89.5C-18.7,96.8,-32.5,108.4,-44.6,106.3C-56.7,104.2,-67.2,88.4,-75.4,73.5C-83.5,58.6,-89.4,44.7,-92.9,30.3C-96.4,15.9,-97.6,1.1,-94.1,-12.3C-90.6,-25.7,-82.5,-37.8,-72.1,-48.5C-61.7,-59.1,-49,-68.3,-35.6,-75.4C-22.1,-82.5,-11,-87.5,2.4,-91.7C15.9,-95.9,31.3,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
               </svg>
            </div>

            <div className="relative z-10">
              <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold mb-4 uppercase tracking-widest">评估报告</span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">{result.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-indigo-500 pl-6 italic">
                {result.description}
              </p>

              {/* Traits Tags */}
              <div className="flex flex-wrap gap-2 mb-10">
                {result.traits.map((trait, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-xl bg-white text-gray-700 font-semibold shadow-sm border border-gray-100">
                    #{trait}
                  </span>
                ))}
              </div>

              {/* Visual Stats */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="bg-indigo-50/50 p-6 rounded-3xl">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    潜能维度分布
                  </h4>
                  <div className="space-y-4">
                    {result.radarData.slice(0, 4).map((data, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                          <span>{data.subject}</span>
                          <span>{data.score}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out delay-500"
                            style={{ width: `${data.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50/50 p-6 rounded-3xl">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    核心职业建议
                  </h4>
                  <ul className="space-y-3">
                    {result.careerPaths.map((path, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 font-medium">
                        <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {path}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-white/80 p-8 rounded-3xl border border-indigo-50">
                <h4 className="text-xl font-bold text-gray-800 mb-4">综合总结</h4>
                <p className="text-gray-600 leading-relaxed mb-6">{result.summary}</p>
                <div className="h-px bg-gray-100 mb-6" />
                <h4 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide text-sm">行动指南</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  {result.actionPlan.map((action, idx) => (
                    <div key={idx} className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 text-sm text-indigo-800 font-medium">
                      {idx + 1}. {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={startQuiz} variant="outline" className="sm:w-auto">
              重新测试
            </Button>
            <Button onClick={() => window.print()} className="sm:w-auto">
              保存报告
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
