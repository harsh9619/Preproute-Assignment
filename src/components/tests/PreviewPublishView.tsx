import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Test, Question } from '../../store/types';
import {
  ArrowLeft, Edit2, CheckCircle2, Circle, Clock,
  FileText, Award, Calendar, ChevronDown, CheckCircle, BookOpen, EyeIcon
} from 'lucide-react';
import CommonModal from '../common/Modal';
interface PreviewPublishViewProps {
  testId: string | undefined;
  test: Test | null;
  subjectName: string;
  topicsNames: string[];
  questions: Question[];
  loading: boolean;
  publishing: boolean;
  expandedIndices: number[];
  toggleAccordion: (idx: number) => void;
  handlePublish: () => void;
  publishTab: 'now' | 'schedule';
  setPublishTab: (tab: 'now' | 'schedule') => void;
}

const PreviewPublishView: React.FC<PreviewPublishViewProps> = ({
  testId,
  test,
  subjectName,
  topicsNames,
  questions,
  loading,
  publishing,
  handlePublish,
  publishTab,
  setPublishTab,
}) => {
  const navigate = useNavigate();
  const todayStr = new Date().toLocaleDateString('en-CA');

  // Local settings for mock publish properties
  const [publishDate, setPublishDate] = useState(todayStr);
  const [publishTime, setPublishTime] = useState('');
  const [liveUntilOption, setLiveUntilOption] = useState<'always' | '1week' | '2weeks' | '3weeks' | '1month' | 'custom'>('custom');
  const [endDate, setEndDate] = useState(todayStr);
  const [endTime, setEndTime] = useState('');

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  if (loading && !test) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="pulse-glow" style={{ display: 'inline-block', padding: '1.5rem 3rem', borderRadius: '12px', background: 'var(--bg-primary)' }}>
          Compiling test preview...
        </div>
      </div>
    );
  }

  const qCount = questions.length || test?.total_questions || 50;

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
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-400 select-none">Test creation</div>
      </div>

      <div className="flex gap-6 items-start flex-1">

        {/* Sub-Sidebar: Question Checklist */}
        <aside className="w-64 bg-white border border-slate-100 rounded-2xl p-4 flex flex-col max-h-[calc(100vh-140px)] select-none">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-3">
            <span className="text-sm font-bold text-slate-800">Question creation</span>
            <span className="text-xs text-slate-400">&lt;&lt;</span>
          </div>
          <div className="text-xs font-semibold text-slate-500 mb-4">
            Total Questions &bull; {qCount}
          </div>

          {/* Scrollable list (All slots green/completed) */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[500px]">
            {questions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                No questions
              </div>
            ) : (
              questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-100  bg-emerald-50 text-emerald-600 font-semibold animate-fade-in hover:border-indigo-350 hover:bg-indigo-50/10 cursor-pointer transition-all select-none"
                  onClick={() => {
                    setSelectedQuestionIndex(idx);
                    setPreviewModalOpen(true);
                    setTimeout(() => {
                      const element = document.getElementById(`modal-question-card-${idx}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 100);
                  }}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[110px]" title={q.question}>
                      Question{idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">

          {/* Test Status Header info */}
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">Test created</h2>
            <h3 className="inline-flex items-center gap-1 px-3 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl text-xs font-bold">
              ✓ All {qCount} Questions done
            </h3>
          </div>

          {/* Summary Properties Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="px-4.5 py-1 bg-[#1e1b4b] text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  {getTestTypeDisplayName()}
                </span>
              </div>
              <span className='flex gap-2'>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedQuestionIndex(null);
                    setPreviewModalOpen(true);
                  }}
                  className="btn btn-secondary text-xs h-9 px-3 flex items-center gap-1 font-semibold text-indigo-600 bg-indigo-50/50 border border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors shadow-xs cursor-pointer"
                  style={{ borderRadius: '8px' }}
                >
                  <EyeIcon size={14} /> View questions
                </button>
                <Link
                  to={`/edit-test/${testId}`}
                  className="btn btn-secondary text-xs h-9 px-3 flex items-center gap-1 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
                  style={{ borderRadius: '8px' }}
                >
                  <Edit2 size={14} /> Edit Test
                </Link>

              </span>
            </div>

            <div className="flex justify-between items-end flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={18} className="text-indigo-600" />
                  <h3 className="text-base font-extrabold text-slate-800">{test?.name || 'Chapter 1'}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#14b8a6] text-white">
                    {getDifficultyDisplayName()}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold min-w-[70px]">Subject</span>
                    <span>:</span>
                    <span className="font-semibold text-slate-800">{subjectName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold min-w-[70px]">Topic</span>
                    <span>:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {topicsNames.map((name, idx) => (
                        <span key={idx} className="px-3 py-0.5 border border-amber-300 bg-amber-50/50 text-amber-600 rounded-full text-xs font-semibold">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold min-w-[70px]">Sub Topic</span>
                    <span>:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {test?.sub_topics.map(stId => (
                        <span key={stId} className="px-3 py-0.5 border border-amber-300 bg-amber-50/50 text-amber-600 rounded-full text-xs font-semibold">
                          Application
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs badges */}
              <div className="flex items-center gap-3 px-4 py-2 border border-slate-100 bg-white rounded-full shadow-2xs text-slate-500 text-xs font-bold select-none h-fit">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  <span>{test?.total_time} Min</span>
                </div>
                <div className="w-px h-3 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <FileText size={13} className="text-slate-400" />
                  <span>{qCount} Q's</span>
                </div>
                <div className="w-px h-3 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Award size={13} className="text-slate-400" />
                  <span>{test?.total_marks} Marks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Publish Setup Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-6">

            {/* Publish Mode Toggle Tabs */}
            <div className="inline-flex bg-slate-100 p-1 border border-slate-200/50 rounded-xl select-none mb-2">
              <button
                type="button"
                onClick={() => setPublishTab('now')}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${publishTab === 'now'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/30 font-extrabold'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Publish Now
              </button>
              <button
                type="button"
                onClick={() => setPublishTab('schedule')}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${publishTab === 'schedule'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/30 font-extrabold'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Schedule Publish
              </button>
            </div>

            {/* Select Date & Time (only for Schedule Publish) */}
            {publishTab === 'schedule' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Select Date and Time</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Input */}
                  <div className="relative">
                    <input
                      type="date"
                      className="form-input w-full h-11 pr-10 border border-slate-200 rounded-xl px-4 text-sm"
                      placeholder="Select Date"
                      min={todayStr}
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                    />
                  </div>
                  {/* Time Select */}
                  <div className="relative">
                    <select
                      className="form-select w-full h-11 pr-10 border border-slate-200 rounded-xl px-4 text-sm appearance-none bg-white"
                      value={publishTime}
                      onChange={(e) => setPublishTime(e.target.value)}
                    >
                      <option value="">Select Time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-3 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Live Until settings */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Live Until</h3>
                <p className="text-xs text-slate-400">Choose how long this test should remain available on the platform.</p>
              </div>

              {/* Radio Group grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Option 1 */}
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="liveUntil"
                    checked={liveUntilOption === 'always'}
                    onChange={() => setLiveUntilOption('always')}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  Always Available
                </label>

                {/* Option 4 */}
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="liveUntil"
                    checked={liveUntilOption === '3weeks'}
                    onChange={() => setLiveUntilOption('3weeks')}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  3 Weeks
                </label>

                {/* Option 2 */}
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="liveUntil"
                    checked={liveUntilOption === '1week'}
                    onChange={() => setLiveUntilOption('1week')}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  1 Week
                </label>

                {/* Option 5 */}
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="liveUntil"
                    checked={liveUntilOption === '1month'}
                    onChange={() => setLiveUntilOption('1month')}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  1 Month
                </label>

                {/* Option 3 */}
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="liveUntil"
                    checked={liveUntilOption === '2weeks'}
                    onChange={() => setLiveUntilOption('2weeks')}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  2 Weeks
                </label>

                {/* Option 6 */}
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="liveUntil"
                    checked={liveUntilOption === 'custom'}
                    onChange={() => setLiveUntilOption('custom')}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  Custom Duration
                </label>

              </div>

              {/* Date & Time fields if Custom Duration is selected */}
              {liveUntilOption === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 animate-fade-in">

                  {/* Select End Date */}
                  <div className="relative">
                    <input
                      type="date"
                      className="form-input w-full h-11 pr-10 border border-slate-200 rounded-xl px-4 text-sm"
                      min={todayStr}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  {/* Select End Time */}
                  <div className="relative">
                    <select
                      className="form-select w-full h-11 pr-10 border border-slate-200 rounded-xl px-4 text-sm appearance-none bg-white"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    >
                      <option value="">Select End Time</option>
                      <option value="12:00 AM">12:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="11:59 PM">11:59 PM</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-3 text-slate-400 pointer-events-none" />
                  </div>

                </div>
              )}

            </div>

            {/* Footer confirmation triggers */}
            <div className="flex justify-end gap-3 mt-8 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary px-6 h-11"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="btn btn-primary px-8 h-11 shadow-sm"
              >
                {publishing ? 'Publishing...' : 'Confirm'}
              </button>
            </div>

          </div>

          {/* Test Preview Modal */}
          <CommonModal
            open={previewModalOpen}
            onCancel={() => setPreviewModalOpen(false)}
            footer={null}
            width={800}
            title={
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 pr-6 select-none">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-indigo-600" size={20} />
                  <span className="font-extrabold text-slate-800 text-lg">Test Overview & Preview</span>
                </div>
              </div>
            }
          >
            <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 pt-4">
              {/* Test Details Card inside Modal */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-sm font-extrabold text-slate-800">{test?.name}</h3>
                  <Link
                    to={`/test/${testId}/questions`}
                    className="btn btn-secondary text-xs h-8 px-3 flex items-center gap-1 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
                    style={{ borderRadius: '6px' }}
                  >
                    <Edit2 size={12} /> Edit Questions
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
                  <div><span className="text-slate-400 font-semibold">Subject:</span> {subjectName}</div>
                  <div><span className="text-slate-400 font-semibold">Difficulty:</span> {getDifficultyDisplayName()}</div>
                  <div><span className="text-slate-400 font-semibold">Duration:</span> {test?.total_time} Minutes</div>
                  <div><span className="text-slate-400 font-semibold">Total Marks:</span> {test?.total_marks} Marks</div>
                  <div><span className="text-slate-400 font-semibold">Total Questions:</span> {qCount}</div>
                  <div><span className="text-slate-400 font-semibold">Marking Scheme:</span> +{test?.correct_marks} / {test?.wrong_marks}</div>
                </div>
              </div>

              {/* Questions inside Modal */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-2">Questions List</h3>
                {questions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No questions added yet.</p>
                ) : (
                  questions.map((q, idx) => {
                    const isSelected = selectedQuestionIndex === idx;
                    return (
                      <div
                        key={q.id || idx}
                        id={`modal-question-card-${idx}`}
                        className={`border rounded-xl p-4 space-y-3 transition-all scroll-mt-6 ${isSelected
                          ? 'border-indigo-300 bg-indigo-50/10 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-100 bg-white'
                          }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-sm font-bold text-slate-800">
                            Q{idx + 1}. {q.question}
                          </h4>
                          <div className="flex items-center gap-2">
                            {q.difficulty && (
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                q.difficulty === 'hard' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                  'bg-amber-50 text-amber-600 border border-amber-200'
                                }`}>
                                {q.difficulty}
                              </span>
                            )}
                          </div>
                        </div>

                        {q.media_url && (
                          <div className="max-w-md rounded-lg overflow-hidden border border-slate-100 bg-white">
                            <img src={q.media_url} alt={`Question ${idx + 1} media`} className="max-h-40 object-contain mx-auto" />
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-semibold">
                          {[
                            { label: 'A', field: 'option1', value: q.option1 },
                            { label: 'B', field: 'option2', value: q.option2 },
                            { label: 'C', field: 'option3', value: q.option3 },
                            { label: 'D', field: 'option4', value: q.option4 },
                          ].map((opt) => {
                            const isCorrect = q.correct_option === opt.field;
                            return (
                              <div
                                key={opt.field}
                                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border transition ${isCorrect
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 font-bold'
                                  : 'border-slate-100 bg-slate-50/20 text-slate-600'
                                  }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isCorrect
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                    }`}
                                >
                                  {opt.label}
                                </span>
                                <span>{opt.value}</span>
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="text-[11px] text-slate-500 bg-slate-50/30 border border-slate-100 rounded-lg p-2.5">
                            <strong className="text-slate-700 font-bold block mb-0.5">Explanation:</strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </CommonModal>

        </div>

      </div>

    </div>
  );
};

export default PreviewPublishView;
