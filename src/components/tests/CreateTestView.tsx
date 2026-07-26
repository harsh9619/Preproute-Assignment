import React from 'react';
import { Link } from 'react-router-dom';
import { Subject, Topic, SubTopic } from '../../store/types';
import { ChevronRight, ArrowLeft, Save } from 'lucide-react';

interface FormErrors {
  name?: string;
  subject?: string;
  topics?: string;
  sub_topics?: string;
  correct_marks?: string;
  wrong_marks?: string;
  unattempt_marks?: string;
  total_time?: string;
  total_marks?: string;
}

interface CreateTestViewProps {
  isEditMode: boolean;
  name: string;
  setName: (val: string) => void;
  subject: string;
  handleSubjectChange: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  selectedTopics: string[];
  handleTopicToggle: (val: string) => void;
  selectedSubTopics: string[];
  handleSubTopicToggle: (val: string) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  setDifficulty: (val: 'easy' | 'medium' | 'hard') => void;
  correctMarks: number | string;
  setCorrectMarks: (val: number | string) => void;
  wrongMarks: number | string;
  setWrongMarks: (val: number | string) => void;
  unattemptMarks: number | string;
  setUnattemptMarks: (val: number | string) => void;
  totalTime: number | string;
  setTotalTime: (val: number | string) => void;
  totalMarks: number | string;
  setTotalMarks: (val: number | string) => void;
  subjectsOptions: Subject[];
  topicsOptions: Topic[];
  subTopicsOptions: SubTopic[];
  pageLoading: boolean;
  errors: FormErrors;
  topicsDropdownOpen: boolean;
  setTopicsDropdownOpen: (val: boolean) => void;
  subTopicsDropdownOpen: boolean;
  setSubTopicsDropdownOpen: (val: boolean) => void;
  topicsRef: React.RefObject<HTMLDivElement>;
  subTopicsRef: React.RefObject<HTMLDivElement>;
  handleSaveDraft: () => void;
  handleNextStep: () => void;
}

const CreateTestView: React.FC<CreateTestViewProps> = ({
  isEditMode,
  name,
  setName,
  subject,
  handleSubjectChange,
  type,
  setType,
  selectedTopics,
  handleTopicToggle,
  selectedSubTopics,
  handleSubTopicToggle,
  difficulty,
  setDifficulty,
  correctMarks,
  setCorrectMarks,
  wrongMarks,
  setWrongMarks,
  unattemptMarks,
  setUnattemptMarks,
  totalTime,
  setTotalTime,
  totalMarks,
  setTotalMarks,
  subjectsOptions,
  topicsOptions,
  subTopicsOptions,
  pageLoading,
  errors,
  topicsDropdownOpen,
  setTopicsDropdownOpen,
  subTopicsDropdownOpen,
  setSubTopicsDropdownOpen,
  topicsRef,
  subTopicsRef,
  handleSaveDraft,
  handleNextStep
}) => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Wizard Steps indicator */}
      <div className="wizard-steps">
        <div className="wizard-step active">
          <div className="wizard-number">1</div>
          <span className="wizard-label">Test Details</span>
        </div>
        <div className="wizard-step">
          <div className="wizard-number">2</div>
          <span className="wizard-label">Add Questions</span>
        </div>
        <div className="wizard-step">
          <div className="wizard-number">3</div>
          <span className="wizard-label">Preview & Publish</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="glass-card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          {isEditMode ? 'Edit Test Properties' : 'Create New Assessment Test'}
        </h2>

        {pageLoading && (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            Processing test configuration...
          </div>
        )}

        {!pageLoading && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Test Name */}
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Test Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Algebra I Chapter Test"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              {/* Subject (triggers topic load) */}
              <div className="form-group">
                <label className="form-label">Subject <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select
                  className="form-select"
                  value={subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  disabled={isEditMode}
                >
                  <option value="">Select Subject</option>
                  {subjectsOptions.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {isEditMode && <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Subject cannot be changed after creation</span>}
                {errors.subject && <span className="form-error-msg">{errors.subject}</span>}
              </div>

              {/* Test Type */}
              <div className="form-group">
                <label className="form-label">Test Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="chapterwise">Chapterwise Test</option>
                  <option value="full_mock">Full Mock Test</option>
                  <option value="topic_test">Topic Test</option>
                </select>
              </div>

              {/* Topics (Multi-Select) */}
              <div className="form-group" ref={topicsRef} style={{ position: 'relative' }}>
                <label className="form-label">Topics <span style={{ color: 'var(--danger)' }}>*</span></label>
                <div 
                  className="form-input multi-select-trigger"
                  onClick={() => subject && setTopicsDropdownOpen(!topicsDropdownOpen)}
                  style={{ cursor: subject ? 'pointer' : 'not-allowed', opacity: subject ? 1 : 0.6 }}
                >
                  {selectedTopics.length === 0 ? (
                    <span style={{ color: 'var(--text-dim)' }}>
                      {subject ? 'Select Topics' : 'Select Subject first'}
                    </span>
                  ) : (
                    selectedTopics.map(tId => {
                      const topicObj = topicsOptions.find(t => t.id === tId);
                      return (
                        <span key={tId} className="multi-select-chip" onClick={(e) => {
                          e.stopPropagation();
                          handleTopicToggle(tId);
                        }}>
                          {topicObj ? topicObj.name : tId} &times;
                        </span>
                      );
                    })
                  )}
                </div>
                {errors.topics && <span className="form-error-msg">{errors.topics}</span>}

                {topicsDropdownOpen && topicsOptions.length > 0 && (
                  <div className="multi-select-dropdown">
                    {topicsOptions.map(topic => {
                      const isSelected = selectedTopics.includes(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className={`multi-select-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleTopicToggle(topic.id)}
                        >
                          <span>{topic.name}</span>
                          {isSelected && <span>✓</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sub-Topics (Multi-Select) */}
              <div className="form-group" ref={subTopicsRef} style={{ position: 'relative' }}>
                <label className="form-label">Sub-Topics <span style={{ color: 'var(--danger)' }}>*</span></label>
                <div 
                  className="form-input multi-select-trigger"
                  onClick={() => selectedTopics.length > 0 && setSubTopicsDropdownOpen(!subTopicsDropdownOpen)}
                  style={{ cursor: selectedTopics.length > 0 ? 'pointer' : 'not-allowed', opacity: selectedTopics.length > 0 ? 1 : 0.6 }}
                >
                  {selectedSubTopics.length === 0 ? (
                    <span style={{ color: 'var(--text-dim)' }}>
                      {selectedTopics.length > 0 ? 'Select Sub-topics' : 'Select Topics first'}
                    </span>
                  ) : (
                    selectedSubTopics.map(stId => {
                      const subTopicObj = subTopicsOptions.find(st => st.id === stId);
                      return (
                        <span key={stId} className="multi-select-chip" onClick={(e) => {
                          e.stopPropagation();
                          handleSubTopicToggle(stId);
                        }}>
                          {subTopicObj ? subTopicObj.name : stId} &times;
                        </span>
                      );
                    })
                  )}
                </div>
                {errors.sub_topics && <span className="form-error-msg">{errors.sub_topics}</span>}

                {subTopicsDropdownOpen && subTopicsOptions.length > 0 && (
                  <div className="multi-select-dropdown">
                    {subTopicsOptions.map(st => {
                      const isSelected = selectedSubTopics.includes(st.id);
                      return (
                        <div
                          key={st.id}
                          className={`multi-select-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSubTopicToggle(st.id)}
                        >
                          <span>{st.name}</span>
                          {isSelected && <span>✓</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Difficulty Level */}
              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select
                  className="form-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Total Time */}
              <div className="form-group">
                <label className="form-label">Total Time (Minutes) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="number"
                  className="form-input"
                  value={totalTime}
                  onChange={(e) => setTotalTime(e.target.value)}
                />
                {errors.total_time && <span className="form-error-msg">{errors.total_time}</span>}
              </div>

              {/* Correct Marks */}
              <div className="form-group">
                <label className="form-label">Correct Marks <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="number"
                  className="form-input"
                  value={correctMarks}
                  onChange={(e) => setCorrectMarks(e.target.value)}
                />
                {errors.correct_marks && <span className="form-error-msg">{errors.correct_marks}</span>}
              </div>

              {/* Wrong Marks */}
              <div className="form-group">
                <label className="form-label">Negative Marks (Wrong) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="number"
                  className="form-input"
                  value={wrongMarks}
                  onChange={(e) => setWrongMarks(e.target.value)}
                />
                {errors.wrong_marks && <span className="form-error-msg">{errors.wrong_marks}</span>}
              </div>

              {/* Unattempt Marks */}
              <div className="form-group">
                <label className="form-label">Unattempt Marks <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="number"
                  className="form-input"
                  value={unattemptMarks}
                  onChange={(e) => setUnattemptMarks(e.target.value)}
                />
                {errors.unattempt_marks && <span className="form-error-msg">{errors.unattempt_marks}</span>}
              </div>

              {/* Total Marks */}
              <div className="form-group">
                <label className="form-label">Total Marks <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="number"
                  className="form-input"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
                {errors.total_marks && <span className="form-error-msg">{errors.total_marks}</span>}
              </div>
            </div>

            {/* Bottom Actions strip */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={16} /> Save as Draft
              </button>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Next: Add Questions <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTestView;
