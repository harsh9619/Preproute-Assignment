import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTests } from '../../store';
import { Test, Question } from '../../store/types';
import { api } from '../../services';
import { Table, Tag, Button } from 'antd';
import DashboardView from '../../components/tests/DashboardView';
import CommonModal from '../../components/common/Modal';
import PageLoaderComponent from '../../components/common/page-loader';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    tests,
    subjects,
    loading,
    fetchTests,
    fetchSubjects,
    deleteTest
  } = useTests();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Modals state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewTest, setViewTest] = useState<Test | null>(null);
  const [viewQuestions, setViewQuestions] = useState<Question[]>([]);
  const [viewLoading, setViewLoading] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (tests.length === 0) {
      fetchTests();
    }
    if (subjects.length === 0) {
      fetchSubjects();
    }
  }, []);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setViewLoading(true);
    try {
      const response = await deleteTest(deleteId);
      if (response.status || response.success) {
        toast.success(response?.message || 'Test deleted successfully');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete test');
    } finally {
      setDeleteId(null);
      setViewLoading(false);
    }
  };

  const handleViewClick = async (testId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setViewLoading(true);
    try {
      const response = await api.getTest(testId);
      if (response.status || response.success) {
        const testObj: Test = response.data;
        setViewTest(testObj);

        if (testObj.questions && testObj.questions.length > 0) {
          const qRes = await api.fetchQuestionsBulk(testObj.questions);
          if (qRes.status || qRes.success) {
            setViewQuestions(qRes.data);
          }
        } else {
          setViewQuestions([]);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load test details');
    } finally {
      setViewLoading(false);
    }
  };

  // Stats calculation
  const totalTests = tests.length;
  const liveTests = tests.filter(t => t.status === 'live').length;
  const draftTests = tests.filter(t => t.status === 'draft').length;
  const totalQuestions = tests.reduce((sum, t) => sum + (t.total_questions || 0), 0);
  // Filtered lists
  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (test.subject && test.subject.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSubject = selectedSubject === 'all' ||
        test.subject_id === selectedSubject ||
        test.subject === selectedSubject;
      const matchesStatus = selectedStatus === 'all' || test.status === selectedStatus;
      const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
      return matchesSearch && matchesSubject && matchesStatus && matchesDifficulty;
    });

  }, [tests, searchTerm, selectedSubject, selectedStatus, selectedDifficulty]);

  return (
    <>
      <PageLoaderComponent isLoading={viewLoading} />
      <DashboardView
        tests={tests}
        subjects={subjects}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        viewTest={viewTest}
        setViewTest={setViewTest}
        viewQuestions={viewQuestions}
        viewLoading={viewLoading}
        totalTests={totalTests}
        liveTests={liveTests}
        draftTests={draftTests}
        totalQuestions={totalQuestions}
        filteredTests={filteredTests}
        handleDeleteClick={handleDeleteClick}
        handleConfirmDelete={handleConfirmDelete}
        handleViewClick={handleViewClick}
        navigate={navigate}
      />

      {/* VIEW MODAL DRAWER */}
      <CommonModal
        open={!!viewTest}
        onCancel={() => setViewTest(null)}
        width={800}
        title={
          viewTest && (
            <div>
              <span className={`badge badge-${viewTest.status}`} style={{ marginBottom: '0.5rem' }}>{viewTest.status}</span>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{viewTest.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem', fontWeight: 'normal' }}>
                Created on: {new Date(viewTest.created_at).toLocaleDateString()}
              </p>
            </div>
          )
        }
        footer={
          viewTest && [
            <Button key="close" onClick={() => setViewTest(null)}>
              Close Preview
            </Button>,
            viewTest.status === 'draft' && (
              <Button
                key="edit"
                type="primary"
                onClick={() => {
                  setViewTest(null);
                  navigate(`/test/${viewTest.id}/questions`);
                }}
              >
                Edit Questions
              </Button>
            )
          ]
        }
      >
        {viewTest && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subject</div>
                <div style={{ fontWeight: 600, marginTop: '0.1rem' }}>{viewTest.subjectName || viewTest.subject}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Difficulty Level</div>
                <div style={{ fontWeight: 600, marginTop: '0.1rem', textTransform: 'capitalize' }}>{viewTest.difficulty}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Allocated Time</div>
                <div style={{ fontWeight: 600, marginTop: '0.1rem' }}>{viewTest.total_time} minutes</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Marking Rules</div>
                <div style={{ fontWeight: 600, marginTop: '0.1rem', fontSize: '0.85rem' }}>
                  Correct: <span style={{ color: 'var(--success)' }}>+{viewTest.correct_marks}</span> |
                  Wrong: <span style={{ color: 'var(--danger)' }}>{viewTest.wrong_marks}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Questionnaire ({viewQuestions.length} questions / {viewTest.total_marks} Marks)
              </h3>

              {viewQuestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  This test doesn't contain any questions yet.
                  {viewTest.status === 'draft' && (
                    <div style={{ marginTop: '1rem' }}>
                      <button
                        onClick={() => {
                          setViewTest(null);
                          navigate(`/test/${viewTest.id}/questions`);
                        }}
                        className="btn btn-primary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                      >
                        Add Questions Now
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {/* {viewQuestions.map((q, idx) => (
                    <div key={q.id || idx} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', background: 'var(--bg-primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>Q{idx + 1}.</span>
                        <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: 550 }}>{q.question}</div>
                        {q.difficulty && <span className={`badge badge-${q.difficulty}`} style={{ fontSize: '0.65rem' }}>{q.difficulty}</span>}
                      </div>

                      {q.media_url && (
                        <div style={{ marginBottom: '1rem' }}>
                          <img src={q.media_url} alt="Question Graphic" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
                        </div>
                      )}

                      <div className="options-list" style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                        <div className={`option-item ${q.correct_option === 'option1' ? 'correct' : ''}`}>
                          <strong>A.</strong> {q.option1}
                        </div>
                        <div className={`option-item ${q.correct_option === 'option2' ? 'correct' : ''}`}>
                          <strong>B.</strong> {q.option2}
                        </div>
                        <div className={`option-item ${q.correct_option === 'option3' ? 'correct' : ''}`}>
                          <strong>C.</strong> {q.option3}
                        </div>
                        <div className={`option-item ${q.correct_option === 'option4' ? 'correct' : ''}`}>
                          <strong>D.</strong> {q.option4}
                        </div>
                      </div>

                      {q.explanation && (
                        <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--accent-primary)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))} */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-2">Questions List</h3>
                    {viewQuestions.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No questions added yet.</p>
                    ) : (
                      viewQuestions.map((q, idx) => {
                        return (
                          <div
                            key={q.id || idx}
                            id={`modal-question-card-${idx}`}
                            className="border rounded-xl p-4 space-y-3 transition-all scroll-mt-6 border-slate-100 bg-white"
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
                                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg border transition border-slate-100 bg-slate-50/20 text-slate-600"
                                  >
                                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold bg-slate-200 text-slate-500">
                                      {opt.label}
                                    </span>
                                    <span>{opt.value}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CommonModal>

      {/* DELETE CONFIRMATION MODAL */}
      <CommonModal
        title="Confirm Deletion"
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleConfirmDelete}>
            Delete Test
          </Button>
        ]}
        width={400}
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1rem' }}>
          Are you sure you want to delete this test? All questions associated with this test will also be deleted. This action cannot be undone.
        </p>
      </CommonModal>

    </>
  );
};

export default DashboardPage;
