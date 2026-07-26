import React from 'react';
import { Link } from 'react-router-dom';
import { Test, Question } from '../../store/types';
import { 
  ArrowLeft, CheckCircle, Edit, ListCollapse, BookOpen, 
  Clock, Award, HelpCircle, Check, Play 
} from 'lucide-react';

interface PreviewPublishViewProps {
  testId: string | undefined;
  test: Test | null;
  subjectName: string;
  topicsNames: string[];
  questions: Question[];
  loading: boolean;
  publishing: boolean;
  showSuccessModal: boolean;
  expandedIndices: number[];
  toggleAccordion: (idx: number) => void;
  handlePublish: () => void;
  handleModalClose: () => void;
}

const PreviewPublishView: React.FC<PreviewPublishViewProps> = ({
  testId,
  test,
  subjectName,
  topicsNames,
  questions,
  loading,
  publishing,
  showSuccessModal,
  expandedIndices,
  toggleAccordion,
  handlePublish,
  handleModalClose
}) => {
  if (loading && !test) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="pulse-glow" style={{ display: 'inline-block', padding: '1.5rem 3rem', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
          Compiling test preview...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Wizard Steps indicator */}
      <div className="wizard-steps" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
        <div className="wizard-step completed">
          <div className="wizard-number">1</div>
          <span className="wizard-label">Test Details</span>
        </div>
        <div className="wizard-step completed">
          <div className="wizard-number">2</div>
          <span className="wizard-label">Add Questions</span>
        </div>
        <div className="wizard-step active">
          <div className="wizard-number">3</div>
          <span className="wizard-label">Preview & Publish</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to={`/test/${testId}/questions`} style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Question Checklist
        </Link>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/edit-test/${testId}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Edit size={14} /> Edit Test Details
          </Link>
          <Link to={`/test/${testId}/questions`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <HelpCircle size={14} /> Edit Questions
          </Link>
        </div>
      </div>

      {/* Main Preview Summary Box */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-draft" style={{ marginBottom: '0.5rem' }}>Ready to Publish</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{test?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Created: {test ? new Date(test.created_at).toLocaleDateString() : ''}
            </p>
          </div>
          <button
            onClick={handlePublish}
            className="btn btn-primary pulse-glow"
            style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
            disabled={publishing || questions.length === 0}
          >
            {publishing ? 'Publishing...' : <><Play size={18} fill="white" /> Publish Test</>}
          </button>
        </div>

        {/* Specs breakdown grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Subject & Topics</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.1rem' }}>{subjectName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{topicsNames.join(', ')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Test Duration</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.1rem' }}>{test?.total_time} Minutes</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Questions & Marks</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.1rem' }}>{questions.length} Questions</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Total Marks: {test?.total_marks}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
              <ListCollapse size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Difficulty & Marking</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.1rem', textTransform: 'capitalize' }}>{test?.difficulty}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Correct: +{test?.correct_marks} | Wrong: {test?.wrong_marks}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions list title */}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Questionnaire Preview ({questions.length} Items)
      </h3>

      {/* Questions list render */}
      {questions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          No questions added to this test yet. Proceed to Add Questions page first.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {questions.map((q, idx) => {
            const isExpanded = expandedIndices.includes(idx);
            return (
              <div key={q.id || idx} className="preview-accordion">
                <div 
                  className="preview-header" 
                  onClick={() => toggleAccordion(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>Q{idx + 1}.</span>
                    <span style={{ fontWeight: 550, fontSize: '0.95rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {q.question}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    {q.difficulty && <span className={`badge badge-${q.difficulty}`} style={{ fontSize: '0.65rem' }}>{q.difficulty}</span>}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{isExpanded ? 'Collapse ▲' : 'Expand ▼'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="preview-body">
                    {q.media_url && (
                      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                        <img src={q.media_url} alt={`Graphic Q${idx + 1}`} style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: 'var(--radius-sm)' }} />
                      </div>
                    )}

                    <p style={{ fontWeight: 550, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                      {q.question}
                    </p>

                    <div className="options-list">
                      <div className={`option-item ${q.correct_option === 'option1' ? 'correct' : ''}`}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong>A.</strong> {q.option1}
                          {q.correct_option === 'option1' && <Check size={14} />}
                        </span>
                      </div>
                      <div className={`option-item ${q.correct_option === 'option2' ? 'correct' : ''}`}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong>B.</strong> {q.option2}
                          {q.correct_option === 'option2' && <Check size={14} />}
                        </span>
                      </div>
                      <div className={`option-item ${q.correct_option === 'option3' ? 'correct' : ''}`}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong>C.</strong> {q.option3}
                          {q.correct_option === 'option3' && <Check size={14} />}
                        </span>
                      </div>
                      <div className={`option-item ${q.correct_option === 'option4' ? 'correct' : ''}`}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong>D.</strong> {q.option4}
                          {q.correct_option === 'option4' && <Check size={14} />}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      {q.explanation && (
                        <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--accent-primary)', padding: '0.75rem 1rem', borderRadius: '4px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 650 }}>EXPLANATION:</span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{q.explanation}</p>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {q.topic && <span><strong>Topic:</strong> {q.topic}</span>}
                        {q.sub_topic && <span><strong>Sub-topic:</strong> {q.sub_topic}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom big publish button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '4rem' }}>
        <button
          onClick={handlePublish}
          className="btn btn-primary pulse-glow"
          style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          disabled={publishing || questions.length === 0}
        >
          {publishing ? 'Publishing...' : <><Play size={18} fill="white" /> Publish Test & Activate</>}
        </button>
      </div>

      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: '450px', textAlign: 'center', padding: '3rem 2rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={40} />
            </div>
            
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', fontWeight: 700 }}>Test Published!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Your test <strong style={{ color: 'var(--text-main)' }}>"{test?.name}"</strong> has been successfully set to live. Students can now access and attempt this test.
            </p>

            <button 
              onClick={handleModalClose} 
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPublishView;
