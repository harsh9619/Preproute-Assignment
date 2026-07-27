import React from 'react';
import { Link } from 'react-router-dom';
import { Test, Topic, SubTopic, Question } from '../../store/types';
import {
  ArrowLeft, Edit2, Trash2, HelpCircle, ChevronRight,
  ChevronLeft, Plus, Clock, FileText, Award, CheckCircle2,
  Circle, Image as ImageIcon, MessageSquare, Tag, FileDown
} from 'lucide-react';

interface LocalQuestion extends Question {
  type: string;
  test_id?: string;
  topic_id?: string;
  sub_topic_id?: string;
  subject?: string;
}

interface AddQuestionsViewProps {
  testId: string | undefined;
  test: Test | null;
  subjectName: string;
  topicOptions: Topic[];
  subTopicOptions: SubTopic[];
  loading: boolean;
  questions: LocalQuestion[];
  activeQuestionIndex: number;
  handleSelectQuestionSlot: (idx: number) => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleDeleteAllEdits: () => void;
  handleDeleteQuestion: (idx: number) => void;
  handleAddNewQuestion: () => void;
  qText: string;
  setQText: (val: string) => void;
  opt1: string;
  setOpt1: (val: string) => void;
  opt2: string;
  setOpt2: (val: string) => void;
  opt3: string;
  setOpt3: (val: string) => void;
  opt4: string;
  setOpt4: (val: string) => void;
  correctOpt: string;
  setCorrectOpt: (val: string) => void;
  explanation: string;
  setExplanation: (val: string) => void;
  qDifficulty: 'easy' | 'medium' | 'hard';
  setQDifficulty: (val: 'easy' | 'medium' | 'hard') => void;
  qTopic: string;
  setQTopic: (val: string) => void;
  qSubTopic: string;
  setQSubTopic: (val: string) => void;
  mediaUrl: string;
  setMediaUrl: (val: string) => void;
  errors: {
    qText?: string;
    opt1?: string;
    opt2?: string;
    opt3?: string;
    opt4?: string;
  };
  handleSaveAndContinue: () => void;
  handlePublish: () => void;
}

const AddQuestionsView: React.FC<AddQuestionsViewProps> = ({
  testId,
  test,
  subjectName,
  topicOptions,
  subTopicOptions,
  loading,
  questions,
  activeQuestionIndex,
  handleSelectQuestionSlot,
  handlePrevQuestion,
  handleNextQuestion,
  handleDeleteAllEdits,
  handleDeleteQuestion,
  handleAddNewQuestion,
  qText,
  setQText,
  opt1,
  setOpt1,
  opt2,
  setOpt2,
  opt3,
  setOpt3,
  opt4,
  setOpt4,
  correctOpt,
  setCorrectOpt,
  explanation,
  setExplanation,
  qDifficulty,
  setQDifficulty,
  qTopic,
  setQTopic,
  qSubTopic,
  setQSubTopic,
  mediaUrl,
  setMediaUrl,
  errors,
  handleSaveAndContinue,
  handlePublish,
}) => {
  const totalQuestionsCount = test?.total_questions || 0;

  if (loading && !test) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="pulse-glow" style={{ display: 'inline-block', padding: '1.5rem 3rem', borderRadius: '12px', background: 'var(--bg-primary)' }}>
          Preparing test context...
        </div>
      </div>
    );
  }

  // Check if a question slot has content
  const isSlotCompleted = (index: number) => {
    const q = questions[index];
    return !!(q && q.question && q.question !== '');
  };

  const getTestTypeDisplayName = () => {
    if (test?.type === 'chapterwise') return 'Chapter Wise';
    if (test?.type === 'topic_test') return 'PYQ';
    if (test?.type === 'full_mock') return 'Mock Test';
    return 'Chapter Wise';
  };

  const getDifficultyDisplayName = () => {
    if (test?.difficulty === 'hard') return 'Difficult';
    return test?.difficulty ? test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1) : 'Medium';
  };

  const getDifficultyColorClass = () => {
    if (test?.difficulty === 'easy') return 'bg-teal-500 text-white';
    if (test?.difficulty === 'hard') return 'bg-rose-500 text-white';
    return 'bg-amber-500 text-white';
  };


  return (
    <div className="animate-fade-in flex flex-col min-h-screen">

      {/* Top Header Breadcrumb Navigation */}
      <div className="flex justify-between items-center mb-4">
        <nav className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 select-none">
          <span>Test Creation</span>
          <span>/</span>
          <span>Create Test</span>
          <span>/</span>
          <span className="text-slate-700 font-bold">{getTestTypeDisplayName()}</span>
        </nav>

        {/* Publish Button on Top Right */}

        <button
          type="button"
          onClick={() => handlePublish()}
          className="btn btn-primary px-6 h-10 shadow-xs"
          style={{ borderRadius: '10px' }}
        >
          Publish
        </button>
      </div>

      <div className="flex gap-6 items-start flex-1">

        {/* Sub-Sidebar: Question Checklist */}
        <aside className="w-64 bg-white border border-slate-100 rounded-2xl p-4 flex flex-col max-h-[calc(100vh-140px)] select-none">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-3">
            <span className="text-sm font-bold text-slate-800">Question creation</span>
            <span className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">&lt;&lt;</span>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-4">
            <span>Total Questions &bull; {totalQuestionsCount}</span>

          </div>

          <button
            type="button"
            onClick={handleAddNewQuestion}
            className="btn btn-primary px-6 h-10 shadow-xs "
            title="Add another question slot"
          >
            <Plus size={12} /> Add Question
          </button>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[500px] mt-4">
            {Array.from({ length: totalQuestionsCount }).map((_, idx) => {
              const completed = isSlotCompleted(idx);
              const active = idx === activeQuestionIndex;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectQuestionSlot(idx)}
                  className={`group flex items-center justify-between px-3 py-2 border rounded-xl cursor-pointer transition-all ${active
                    ? 'border-indigo-600 bg-indigo-50/40 text-indigo-600 font-bold shadow-xs'
                    : completed
                      ? 'border-emerald-100 bg-emerald-50/20 text-emerald-700 font-semibold'
                      : 'border-slate-100 text-slate-400 bg-white hover:bg-slate-50/50'
                    }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      Question {idx + 1}
                    </span>
                    {completed && (
                      <span className="text-[11px] text-slate-400 truncate max-w-[120px] font-normal">
                        {questions[idx]?.question || '(Untitled)'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {completed ? (
                      <>
                        {/* Hover actions for completed slot */}
                        <div className="hidden group-hover:flex items-center gap-0.5 transition-opacity">
                          <button
                            type="button"
                            title="Edit question"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectQuestionSlot(idx);
                            }}
                            className="p-1 hover:bg-indigo-100 rounded text-indigo-600 transition"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            title="Clear question slot"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(idx);
                            }}
                            className="p-1 hover:bg-rose-100 rounded text-rose-600 transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 group-hover:hidden" />
                      </>
                    ) : (
                      <Circle size={16} className="text-slate-300 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">

          {/* Summary Properties Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 bg-indigo-950 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                  {getTestTypeDisplayName()}
                </span>
              </div>
              <Link
                to={`/edit-test/${testId}`}
                className="p-2 text-indigo-600 hover:text-indigo-800 transition"
              >
                <Edit2 size={18} />
              </Link>
            </div>

            <div className="flex justify-between items-end flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{test?.name || 'Chapter 1'}</h3>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${getDifficultyColorClass()}`}>
                    {getDifficultyDisplayName()}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium min-w-[70px]">Subject</span>
                    <span>:</span>
                    <span className="font-semibold text-slate-800">{subjectName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium min-w-[70px]">Topic</span>
                    <span>:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {test?.topics.map(tId => {
                        const tObj = topicOptions.find(t => t.id === tId);
                        return (
                          <span key={tId} className="px-2.5 py-0.5 bg-amber-50/60 text-amber-600 rounded-md text-xs font-semibold border border-amber-300">
                            {tObj ? tObj.name : tId}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium min-w-[70px]">Sub Topic</span>
                    <span>:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {test?.sub_topics.map(stId => {
                        const stObj = subTopicOptions.find(st => st.id === stId);
                        return (
                          <span key={stId} className="px-2.5 py-0.5 bg-amber-50/60 text-amber-600 rounded-md text-xs font-semibold border border-amber-300">
                            {stObj ? stObj.name : stId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs badges inline on the right */}
              <div className="flex gap-4 p-3 bg-slate-50/80 border border-slate-200/50 rounded-xl text-slate-600 text-xs font-bold select-none h-fit">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-400" />
                  <span>{test?.total_time} Min</span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <FileText size={14} className="text-slate-400" />
                  <span>{totalQuestionsCount} Q's</span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Award size={14} className="text-slate-400" />
                  <span>{test?.total_marks} Marks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form / Question Creator Box */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">

            {/* Header row */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold text-slate-800">
                Question <span className="text-slate-800">{activeQuestionIndex + 1}</span>/{totalQuestionsCount}
              </h2>

              <div className="flex gap-2">
                <button type="button" className="btn btn-secondary text-xs h-9 px-3 flex items-center gap-1 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50" style={{ borderRadius: '8px' }}>
                  <Plus size={14} /> MCQ
                </button>
                <button type="button" className="btn btn-secondary text-xs h-9 px-3 flex items-center gap-1 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50" style={{ borderRadius: '8px' }}>
                  <Plus size={14} /> CSV
                </button>
              </div>
            </div>

            {/* Sub headers actions */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={handleDeleteAllEdits}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 transition"
              >
                <Trash2 size={14} /> Delete All Edits
              </button>
            </div>

            {/* Question Rich Text Editor */}
            <div className="form-group mb-6">
              <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-100/50 transition">
                {/* Mock Rich Toolbar */}
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center select-none">
                  <div className="flex flex-wrap gap-3 text-slate-500 font-bold text-sm">
                    <span className="cursor-pointer hover:text-slate-800">I</span>
                    <span className="cursor-pointer hover:text-slate-800">B</span>
                    <span className="cursor-pointer hover:text-slate-800">U</span>
                    <span className="cursor-pointer hover:text-slate-800 line-through">S</span>
                    <span className="w-px h-4 bg-slate-300 self-center" />
                    <span className="cursor-pointer hover:text-slate-800">link</span>
                    <span className="cursor-pointer hover:text-slate-800">image</span>
                    <span className="cursor-pointer hover:text-slate-800">math</span>
                  </div>
                  <Trash2 size={14} className="text-slate-400 cursor-pointer hover:text-rose-500" onClick={handleDeleteAllEdits} />
                </div>
                {/* Textarea */}
                <textarea
                  rows={4}
                  className="w-full p-4 text-slate-800 placeholder-slate-400 outline-none resize-y border-none text-sm min-h-[100px]"
                  placeholder="Type here"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                />
              </div>
              {errors.qText && <span className="form-error-msg">{errors.qText}</span>}
            </div>

            {/* Options List */}
            <div className="space-y-4 mb-6">
              <label className="text-sm font-bold text-slate-800 block mb-2">Type the options below</label>

              {/* Option A */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectOpt('option1')}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition flex-shrink-0 ${correctOpt === 'option1'
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 hover:border-slate-400'
                    }`}
                >
                  {correctOpt === 'option1' && <span className="w-2 h-2 rounded-full bg-white" />}
                </button>
                <input
                  type="text"
                  placeholder="Type Option A"
                  className="form-input flex-1 h-11"
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                />
                <button type="button" className="p-2 text-slate-400 hover:text-rose-500" onClick={() => setOpt1('')}>
                  <Trash2 size={16} />
                </button>
              </div>
              {errors.opt1 && <span className="form-error-msg">{errors.opt1}</span>}

              {/* Option B */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectOpt('option2')}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition flex-shrink-0 ${correctOpt === 'option2'
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 hover:border-slate-400'
                    }`}
                >
                  {correctOpt === 'option2' && <span className="w-2 h-2 rounded-full bg-white" />}
                </button>
                <input
                  type="text"
                  placeholder="Type Option B"
                  className="form-input flex-1 h-11"
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                />
                <button type="button" className="p-2 text-slate-400 hover:text-rose-500" onClick={() => setOpt2('')}>
                  <Trash2 size={16} />
                </button>
              </div>
              {errors.opt2 && <span className="form-error-msg">{errors.opt2}</span>}

              {/* Option C */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectOpt('option3')}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition flex-shrink-0 ${correctOpt === 'option3'
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 hover:border-slate-400'
                    }`}
                >
                  {correctOpt === 'option3' && <span className="w-2 h-2 rounded-full bg-white" />}
                </button>
                <input
                  type="text"
                  placeholder="Type Option C"
                  className="form-input flex-1 h-11"
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                />
                <button type="button" className="p-2 text-slate-400 hover:text-rose-500" onClick={() => setOpt3('')}>
                  <Trash2 size={16} />
                </button>
              </div>
              {errors.opt3 && <span className="form-error-msg">{errors.opt3}</span>}

              {/* Option D */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectOpt('option4')}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition flex-shrink-0 ${correctOpt === 'option4'
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 hover:border-slate-400'
                    }`}
                >
                  {correctOpt === 'option4' && <span className="w-2 h-2 rounded-full bg-white" />}
                </button>
                <input
                  type="text"
                  placeholder="Type Option D"
                  className="form-input flex-1 h-11"
                  value={opt4}
                  onChange={(e) => setOpt4(e.target.value)}
                />
                <button type="button" className="p-2 text-slate-400 hover:text-rose-500" onClick={() => setOpt4('')}>
                  <Trash2 size={16} />
                </button>
              </div>
              {errors.opt4 && <span className="form-error-msg">{errors.opt4}</span>}

            </div>

            {/* Additional Configs - Collapsible and styled cleanly */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 select-none">
                <Tag size={12} /> Metadata & Explanation (Optional)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Topic selector */}
                <div className="form-group">
                  <label className="text-xs font-semibold text-slate-600">Topic</label>
                  <select
                    className="form-select text-xs h-9 py-1"
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value)}
                  >
                    <option value="">Select Topic</option>
                    {topicOptions.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subtopic selector */}
                <div className="form-group">
                  <label className="text-xs font-semibold text-slate-600">Sub-Topic</label>
                  <select
                    className="form-select text-xs h-9 py-1"
                    value={qSubTopic}
                    onChange={(e) => setQSubTopic(e.target.value)}
                    disabled={!qTopic}
                  >
                    <option value="">Select Sub-topic</option>
                    {subTopicOptions
                      .filter(st => !qTopic || st.topic_id === qTopic)
                      .map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                  </select>
                </div>

                {/* Difficulty selector */}
                <div className="form-group">
                  <label className="text-xs font-semibold text-slate-600">Difficulty</label>
                  <select
                    className="form-select text-xs h-9 py-1"
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Graphic/Media Link */}
              <div className="form-group">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <ImageIcon size={12} /> Media URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.png"
                  className="form-input text-xs h-9 py-1"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              </div>

              {/* Text Explanation */}
              <div className="form-group">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <MessageSquare size={12} /> Solution Explanation
                </label>
                <textarea
                  rows={2}
                  placeholder="Why is this answer correct?"
                  className="form-input text-xs py-2 min-h-[50px] resize-y"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center mt-8 select-none">
              <div className="inline-flex items-center gap-4 bg-slate-800 text-white px-5 py-2 rounded-full shadow-sm">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={activeQuestionIndex === 0}
                  className="hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold font-mono tracking-wider min-w-[32px] text-center">
                  {activeQuestionIndex + 1} / {totalQuestionsCount}
                </span>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={activeQuestionIndex === totalQuestionsCount - 1}
                  className="hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Footer Navigation Buttons */}
            <div className="flex justify-end gap-3 mt-8 border-t border-slate-100 pt-6">
              <Link
                to="/"
                className="btn btn-secondary px-6 h-11"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleSaveAndContinue}
                className="btn btn-primary px-8 h-11 shadow-xs"
              >
                Save & Continue
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddQuestionsView;
