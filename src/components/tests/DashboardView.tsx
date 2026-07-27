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
import NoData from '../common/NoData';
import PageLoaderComponent from '../common/page-loader';
import CommonModal from '../common/Modal';

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
    <>
      <PageLoaderComponent isLoading={loading} />
      <div className="animate-fade-in">

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

        <Button
          key="edit"
          type="primary"
          onClick={() => {
            navigate(`/create-test`);
          }}
        >
          <Plus size={18} /> Create New Test
        </Button>




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
          columns={columns}
          dataSource={filteredTests.map((item, index) => ({
            ...item,
            key: `${item?.id}-${index + 1}`,
          }))}
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
    </div>
  </>
);
};

export default DashboardView;
