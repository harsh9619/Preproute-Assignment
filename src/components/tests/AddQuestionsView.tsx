import React from 'react';
import { Link } from 'react-router-dom';
import { Test, Topic, SubTopic, Question } from '../../store/types';
import { 
  ArrowLeft, ChevronRight, Plus, Trash2, Edit, Save, 
  HelpCircle
} from 'lucide-react';

interface FormErrors {
  qText?: string;
  opt1?: string;
  opt2?: string;
  opt3?: string;
  opt4?: string;
}

interface LocalQuestion extends Question {
  type: string;
  test_id?: string;
  topic_id?: string;
  sub_topic_id?: string;
}

interface AddQuestionsViewProps {
  testId: string | undefined;
  test: Test | null;
  subjectName: string;
  topicOptions: Topic[];
  subTopicOptions: SubTopic[];
  loading: boolean;
  questions: LocalQuestion[];
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
  editingIndex: number | null;
  errors: FormErrors;
  handleAddOrUpdateQuestion: () => void;
  clearQuestionForm: () => void;
  handleEditQuestion: (idx: number) => void;
  handleDeleteQuestion: (idx: number) => void;
  handleSaveAndContinue: () => void;
}

const AddQuestionsView: React.FC<AddQuestionsViewProps> = ({
  testId,
  test,
  subjectName,
  topicOptions,
  subTopicOptions,
  loading,
  questions,
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
  editingIndex,
  errors,
  handleAddOrUpdateQuestion,
  clearQuestionForm,
  handleEditQuestion,
  handleDeleteQuestion,
  handleSaveAndContinue
}) => {
  if (loading && !test) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="pulse-glow" style={{ display: 'inline-block', padding: '1.5rem 3rem', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
          Preparing test context...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Wizard Steps indicator */}
      <div className="wizard-steps" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
        <div className="wizard-step completed">
          <div className="wizard-number">1</div>
          <span className="wizard-label">Test Details</span>
        </div>
        <div className="wizard-step active">
          <div className="wizard-number">2</div>
          <span className="wizard-label">Add Questions</span>
        </div>
        <div className="wizard-step">
          <div className="wizard-number">3</div>
          <span className="wizard-label">Preview & Publish</span>
        </div>
      </div>

      {/* Test details banner summary */}
      <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(23, 29, 51, 0.8) 0%, rgba(15, 20, 35, 0.8) 100%)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div>
          <span className="badge badge-draft" style={{ marginBottom: '0.4rem' }}>Configuring Draft</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{test?.name}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            <span><strong>Subject:</strong> {subjectName}</span>
            <span><strong>Questions added:</strong> {questions.length}</span>
            <span><strong>Est. Marks:</strong> {questions.length * (test?.correct_marks || 4)} pts</span>
            <span><strong>Marking Scheme:</strong> +{test?.correct_marks} / {test?.wrong_marks}</span>
          </div>
        </div>
        <div>
          <Link to={`/edit-test/${testId}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} /> Back to Details
          </Link>
        </div>
      </div>

      {/* Main split dashboard section */}
      <div className="questions-layout">
        
        {/* Left Column: Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} style={{ color: 'var(--accent-primary)' }} />
            {editingIndex !== null ? 'Modify Question' : 'Add Question'}
          </h3>

          <div className="form-group">
            <label className="form-label">Question Text <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Type question content here..."
              value={qText}
              onChange={(e) => setQText(e.target.value)}
            />
            {errors.qText && <span className="form-error-msg">{errors.qText}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Option A <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Option A content"
                value={opt1}
                onChange={(e) => setOpt1(e.target.value)}
              />
              {errors.opt1 && <span className="form-error-msg">{errors.opt1}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Option B <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Option B content"
                value={opt2}
                onChange={(e) => setOpt2(e.target.value)}
              />
              {errors.opt2 && <span className="form-error-msg">{errors.opt2}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Option C <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Option C content"
                value={opt3}
                onChange={(e) => setOpt3(e.target.value)}
              />
              {errors.opt3 && <span className="form-error-msg">{errors.opt3}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Option D <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Option D content"
                value={opt4}
                onChange={(e) => setOpt4(e.target.value)}
              />
              {errors.opt4 && <span className="form-error-msg">{errors.opt4}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correct Option <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select
              className="form-select"
              value={correctOpt}
              onChange={(e) => setCorrectOpt(e.target.value)}
            >
              <option value="option1">Option A</option>
              <option value="option2">Option B</option>
              <option value="option3">Option C</option>
              <option value="option4">Option D</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Explanation (Optional)</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Why is this the correct answer?"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Difficulty (Optional)</label>
              <select
                className="form-select"
                value={qDifficulty}
                onChange={(e) => setQDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Media URL (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Image/Graphic link"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Topic Filter (Optional)</label>
              <select
                className="form-select"
                value={qTopic}
                onChange={(e) => setQTopic(e.target.value)}
              >
                <option value="">Select Topic</option>
                {topicOptions.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sub-Topic Filter (Optional)</label>
              <select
                className="form-select"
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
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button
              onClick={handleAddOrUpdateQuestion}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {editingIndex !== null ? 'Update Question' : <><Plus size={16} /> Add Question</>}
            </button>
            
            {editingIndex !== null && (
              <button
                onClick={clearQuestionForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question List */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Question Checklist ({questions.length})
          </h3>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem', maxHeight: '550px' }}>
            {questions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✏️</div>
                <p style={{ fontSize: '0.95rem', fontWeight: 550, marginBottom: '0.25rem' }}>No questions compiled yet</p>
                <p style={{ fontSize: '0.8rem' }}>Complete the questionnaire form on the left to add questions to this test.</p>
              </div>
            ) : (
              questions.map((q, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '1rem', 
                    background: editingIndex === idx ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-primary)',
                    borderColor: editingIndex === idx ? 'var(--accent-primary)' : 'var(--border-color)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Q{idx + 1}.</span>
                    <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 550 }}>{q.question}</span>
                    <span className={`badge badge-${q.difficulty || 'medium'}`} style={{ fontSize: '0.6rem' }}>{q.difficulty}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: q.correct_option === 'option1' ? 'var(--success)' : 'inherit', fontWeight: q.correct_option === 'option1' ? 'bold' : 'normal' }}>
                      A: {q.option1}
                    </div>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: q.correct_option === 'option2' ? 'var(--success)' : 'inherit', fontWeight: q.correct_option === 'option2' ? 'bold' : 'normal' }}>
                      B: {q.option2}
                    </div>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: q.correct_option === 'option3' ? 'var(--success)' : 'inherit', fontWeight: q.correct_option === 'option3' ? 'bold' : 'normal' }}>
                      C: {q.option3}
                    </div>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: q.correct_option === 'option4' ? 'var(--success)' : 'inherit', fontWeight: q.correct_option === 'option4' ? 'bold' : 'normal' }}>
                      D: {q.option4}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                    <button 
                      onClick={() => handleEditQuestion(idx)} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(idx)} 
                      className="btn btn-danger" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
            <button
              onClick={handleSaveAndContinue}
              className="btn btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              disabled={questions.length === 0}
            >
              <Save size={16} /> Save & Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddQuestionsView;
