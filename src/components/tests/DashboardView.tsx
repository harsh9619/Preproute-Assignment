import React from 'react';
import { Link } from 'react-router-dom';
import { Subject, Test, Question, DashboardViewProps } from '../../store/types';
import {
  Plus, Search, Filter, Trash2, Edit, Eye,
  BookOpen, Clock, Award, FileText, X, ChevronRight
} from 'lucide-react';
import { Table, Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getDashboardColumns, NO_DATA } from '../../constants';
import NoData from '../common/noData';
import PageLoaderComponent from '../common/page-loader';

const DashboardView: React.FC<DashboardViewProps> = ({
  subjects,
  loading,
  searchTerm,
  setSearchTerm,
  selectedSubject,
  setSelectedSubject,
  selectedStatus,
  setSelectedStatus,
  selectedDifficulty,
  setSelectedDifficulty,
  deleteId,
  setDeleteId,
  viewTest,
  setViewTest,
  viewQuestions,
  viewLoading,
  totalTests,
  liveTests,
  draftTests,
  totalQuestions,
  filteredTests,
  handleDeleteClick,
  handleConfirmDelete,
  handleViewClick,
  navigate
}) => {

  const columns = getDashboardColumns({
    subjects,
    handleViewClick,
    handleDeleteClick,
    navigate,
  });

  const hasActiveFilters = searchTerm !== '' || selectedSubject !== 'all' || selectedStatus !== 'all' || selectedDifficulty !== 'all';

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSelectedStatus('all');
    setSelectedDifficulty('all');
  };

  return (
    <div className="animate-fade-in">
      <PageLoaderComponent isLoading={loading} />

      {/* Sub Header with Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-slate-200/60">
        <div>
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1.5">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-600 font-semibold">Dashboard</span>
          </nav>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight pt-4">
            Dashboard
          </h2>
        </div>


      </div>

      {/* Stats Counter Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 550 }}>Total Tests</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.1rem' }}>{totalTests}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 550 }}>Live Tests</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.1rem' }}>{liveTests}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <Edit size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 550 }}>Draft Tests</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.1rem' }}>{draftTests}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 550 }}>Total Questions</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.1rem' }}>{totalQuestions}</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Strip */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs mb-6 hover:shadow-sm transition-all duration-200">
        {/* Header containing Title & Description and dynamic Reset button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Filter className="text-indigo-500 w-4 h-4" />
              <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Search & Filters</h3>
              {hasActiveFilters && (
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Refine your test list by searching or filtering by subject, status, or difficulty.
            </p>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-lg border border-rose-100 hover:border-rose-200 transition-all duration-200 cursor-pointer self-start sm:self-auto"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input Box */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label className={`text-[10px] font-bold tracking-wider uppercase mb-0.5 ${searchTerm ? 'text-indigo-600' : 'text-slate-400'}`}>
              Search Queries
            </label>
            <div className={`flex items-center bg-slate-50 hover:bg-slate-100/50 focus-within:bg-white border rounded-xl px-3 py-2.5 transition-all duration-200 ${searchTerm
              ? 'border-indigo-400 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100'
              : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100'
              }`}>
              <Search size={16} className={searchTerm ? 'text-indigo-500' : 'text-slate-400'} />
              <input
                type="text"
                className="w-full text-sm text-slate-700 placeholder-slate-400 border-none bg-transparent outline-none ml-2 p-0 focus:ring-0 focus:outline-none"
                placeholder="Search by test name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Subject Dropdown */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className={`text-[10px] font-bold tracking-wider uppercase mb-0.5 ${selectedSubject !== 'all' ? 'text-indigo-600' : 'text-slate-400'}`}>
              Subject
            </label>
            <select
              className={`w-full text-sm text-slate-700 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl px-3 py-2.5 transition-all duration-200 outline-none cursor-pointer ${selectedSubject !== 'all'
                ? 'border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className={`text-[10px] font-bold tracking-wider uppercase mb-0.5 ${selectedStatus !== 'all' ? 'text-indigo-600' : 'text-slate-400'}`}>
              Status
            </label>
            <select
              className={`w-full text-sm text-slate-700 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl px-3 py-2.5 transition-all duration-200 outline-none cursor-pointer ${selectedStatus !== 'all'
                ? 'border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="live">Live</option>
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className={`text-[10px] font-bold tracking-wider uppercase mb-0.5 ${selectedDifficulty !== 'all' ? 'text-indigo-600' : 'text-slate-400'}`}>
              Difficulty
            </label>
            <select
              className={`w-full text-sm text-slate-700 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl px-3 py-2.5 transition-all duration-200 outline-none cursor-pointer ${selectedDifficulty !== 'all'
                ? 'border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Grid/List */}
      <div className="glass-card animate-fade-in" style={{ padding: '1rem', overflowX: 'auto', border: '1px solid var(--border-color)', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
        <Table
          bordered
          // loading={loading}
          columns={columns}
          dataSource={filteredTests.map((item, index) => ({
            ...item,
            key: `${item?.id}-${index + 1}`,
          }))}
          pagination
          scroll={{ y: 'calc(100vh - 35rem)' }}
          style={{ minHeight: '420px' }}
          locale={{
            emptyText: (
              <NoData
                className="assessment-remedial-no-record-container"
                message={NO_DATA}
                description={
                  searchTerm || selectedSubject !== 'all' || selectedStatus !== 'all' || selectedDifficulty !== 'all'
                    ? "We couldn't find any test matching your current search parameters. Try adjusting your filters."
                    : "Let's create your first examination test! Setup marks, choose subjects, and add questions."
                }
                showErrorIcon={true}
              />
            ),
          }}
        />
      </div>


      {/* VIEW MODAL DRAWER */}
      {viewTest && (
        <div className="modal-overlay" onClick={() => setViewTest(null)}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span className={`badge badge-${viewTest.status}`} style={{ marginBottom: '0.5rem' }}>{viewTest.status}</span>
                <h2 style={{ fontSize: '1.5rem' }}>{viewTest.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  Created on: {new Date(viewTest.created_at).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setViewTest(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {viewQuestions.map((q, idx) => (
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
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', gap: '0.5rem' }}>
              <button onClick={() => setViewTest(null)} className="btn btn-secondary">
                Close Preview
              </button>
              {viewTest.status === 'draft' && (
                <button
                  onClick={() => {
                    setViewTest(null);
                    navigate(`/test/${viewTest.id}/questions`);
                  }}
                  className="btn btn-primary"
                >
                  Edit Questions
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this test? All questions associated with this test will also be deleted. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setDeleteId(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-danger">
                Delete Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
