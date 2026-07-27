import React from 'react';
import { Link } from 'react-router-dom';
import { TestFormData, CreateTestViewProps } from '../../store/types';
import { Select } from 'antd';

const CreateTestView: React.FC<CreateTestViewProps> = ({
  testId,
  formData,
  setFormData,
  subjects,
  topics,
  subTopics,
  loading,
  errors,
  isSaving,
  onNextAddQuestions,
  onCancel
}) => {

  const handleInputChange = (field: keyof TestFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTestTypeDisplayName = () => {
    if (formData.type === 'chapterwise') return 'Chapter Wise';
    if (formData.type === 'topic_test') return 'PYQ';
    if (formData.type === 'full_mock') return 'Mock Test';
    return 'Chapter Wise';
  };

  if (loading && subjects.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="pulse-glow" style={{ display: 'inline-block', padding: '2rem 4rem', borderRadius: '12px', background: 'var(--bg-primary)' }}>
          Loading form configurations...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Top Header Breadcrumbs */}
      <div className="mb-4">
        <nav className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 select-none">
          <span>Test Creation</span>
          <span>/</span>
          <span>Create Test</span>
          <span>/</span>
          <span className="text-slate-700 font-bold">{getTestTypeDisplayName()}</span>
        </nav>
      </div>

      {/* Main Settings Box Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">

        {/* Test Type Select Tabs */}
        <div className="inline-flex bg-slate-100/80 p-1 border border-slate-200/50 rounded-xl select-none mb-6">
          <button
            type="button"
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${formData.type === 'chapterwise'
              ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/30'
              : 'text-slate-400 hover:text-slate-600'
              }`}
            onClick={() => handleInputChange('type', 'chapterwise')}
          >
            Chapterwise
          </button>
          <button
            type="button"
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${formData.type === 'topic_test'
              ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/30'
              : 'text-slate-400 hover:text-slate-600'
              }`}
            onClick={() => handleInputChange('type', 'topic_test')}
          >
            PYQ
          </button>
          <button
            type="button"
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${formData.type === 'full_mock'
              ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/30'
              : 'text-slate-400 hover:text-slate-600'
              }`}
            onClick={() => handleInputChange('type', 'full_mock')}
          >
            Mock Test
          </button>
        </div>

        {/* Form Fields Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          {/* Subject Dropdown */}
          <div className="form-group">
            <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center">
              Subject
            </label>
            <Select
              className="w-full"
              placeholder="Choose from Drop-down"
              value={formData.subject || undefined}
              onChange={(val) => handleInputChange('subject', val)}
              options={subjects.map(sub => ({ value: sub.id, label: sub.name }))}
              style={{ height: '44px' }}
              status={errors.subject ? 'error' : undefined}
            />
            {errors.subject && <span className="form-error-msg">{errors.subject}</span>}
          </div>

          {/* Test Name */}
          <div className="form-group">
            <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center">
              Name of Test
            </label>
            <input
              type="text"
              placeholder="Enter name of Test"
              className={`form-input w-full ${errors.name ? 'border-red-500 bg-red-50/10' : ''}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{ height: '44px', borderRadius: '10px', borderColor: '#cbd5e1' }}
            />
            {errors.name && <span className="form-error-msg">{errors.name}</span>}
          </div>

          {/* Topics Multi-Select */}
          <div className="form-group relative">
            <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center">
              Topic
            </label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder={formData.subject ? "Choose from Drop-down" : "Please select a Subject first"}
              value={formData.topics}
              onChange={(vals) => handleInputChange('topics', vals)}
              options={topics.map(t => ({ value: t.id, label: t.name }))}
              disabled={!formData.subject}
              style={{ width: '100%', minHeight: '44px' }}
              status={errors.topics ? 'error' : undefined}
              maxTagCount="responsive"
            />
            {errors.topics && <span className="form-error-msg">{errors.topics}</span>}
          </div>

          {/* Sub-topics Multi-Select */}
          <div className="form-group relative">
            <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center">
              Sub Topic
            </label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder={formData.topics.length > 0 ? "Choose from Drop-down" : "Please select Topic first"}
              value={formData.sub_topics}
              onChange={(vals) => handleInputChange('sub_topics', vals)}
              options={subTopics.map(st => ({ value: st.id, label: st.name }))}
              disabled={formData.topics.length === 0}
              style={{ width: '100%', minHeight: '44px' }}
              status={errors.sub_topics ? 'error' : undefined}
              maxTagCount="responsive"
            />
            {errors.sub_topics && <span className="form-error-msg">{errors.sub_topics}</span>}
          </div>

          {/* Duration (Minutes) */}
          <div className="form-group">
            <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center">
              Duration (Minutes)
            </label>
            <input
              type="number"
              min={1}
              placeholder="Enter the time"
              className={`form-input w-full ${errors.total_time ? 'border-red-500 bg-red-50/10' : ''}`}
              value={formData.total_time || ''}
              onChange={(e) => handleInputChange('total_time', parseInt(e.target.value) || 0)}
              style={{ height: '44px', borderRadius: '10px', borderColor: '#cbd5e1' }}
            />
            {errors.total_time && <span className="form-error-msg">{errors.total_time}</span>}
          </div>

          {/* Test Difficulty Level */}
          <div className="form-group flex flex-col justify-center">
            <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
              Test Difficulty Level
            </label>
            <div className="flex gap-8 items-center h-[44px]">
              {['easy', 'medium', 'hard'].map(level => {
                const displayName = level === 'hard' ? 'Difficult' : level.charAt(0).toUpperCase() + level.slice(1);
                return (
                  <label key={level} className="flex items-center gap-2 font-semibold text-slate-700 text-sm cursor-pointer select-none">
                    <input
                      type="radio"
                      name="difficulty"
                      checked={formData.difficulty === level}
                      onChange={() => handleInputChange('difficulty', level)}
                      className="w-4.5 h-4.5 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    {displayName}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Marking Scheme Section */}
        <div className="mt-8">
          <label className="text-base font-bold text-slate-800 block mb-4">
            Marking Scheme:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {/* Wrong Answer */}
            <div className="form-group">
              <label className="text-xs font-semibold text-slate-600 mb-1.5">Wrong Answer</label>
              <input
                type="number"
                step="any"
                placeholder="-1"
                className={`form-input w-full text-sm ${errors.wrong_marks ? 'border-red-500' : ''}`}
                value={formData.wrong_marks !== undefined ? formData.wrong_marks : ''}
                onChange={(e) => handleInputChange('wrong_marks', parseFloat(e.target.value) ?? 0)}
                style={{ height: '44px', borderRadius: '10px', borderColor: '#cbd5e1' }}
              />
              {errors.wrong_marks && <span className="form-error-msg">{errors.wrong_marks}</span>}
            </div>

            {/* Unattempted */}
            <div className="form-group">
              <label className="text-xs font-semibold text-slate-600 mb-1.5">Unattempted</label>
              <input
                type="number"
                step="any"
                placeholder="+0"
                className={`form-input w-full text-sm ${errors.unattempt_marks ? 'border-red-500' : ''}`}
                value={formData.unattempt_marks !== undefined ? formData.unattempt_marks : ''}
                onChange={(e) => handleInputChange('unattempt_marks', parseFloat(e.target.value) ?? 0)}
                style={{ height: '44px', borderRadius: '10px', borderColor: '#cbd5e1' }}
              />
              {errors.unattempt_marks && <span className="form-error-msg">{errors.unattempt_marks}</span>}
            </div>

            {/* Correct Answer */}
            <div className="form-group">
              <label className="text-xs font-semibold text-slate-600 mb-1.5">Correct Answer</label>
              <input
                type="number"
                step="any"
                placeholder="+5"
                className={`form-input w-full text-sm ${errors.correct_marks ? 'border-red-500' : ''}`}
                value={formData.correct_marks !== undefined ? formData.correct_marks : ''}
                onChange={(e) => handleInputChange('correct_marks', parseFloat(e.target.value) ?? 0)}
                style={{ height: '44px', borderRadius: '10px', borderColor: '#cbd5e1' }}
              />
              {errors.correct_marks && <span className="form-error-msg">{errors.correct_marks}</span>}
            </div>

            {/* No of Questions */}
            <div className="form-group">
              <label className="text-xs font-semibold text-slate-600 mb-1.5">No of Questions</label>
              <input
                type="number"
                min={1}
                placeholder="Ex:250 Marks"
                className={`form-input w-full text-sm ${errors.total_questions ? 'border-red-500' : ''}`}
                value={formData.total_questions || ''}
                onChange={(e) => handleInputChange('total_questions', parseInt(e.target.value) || 0)}
                style={{ height: '44px', borderRadius: '10px', borderColor: '#cbd5e1' }}
              />
              {errors.total_questions && <span className="form-error-msg">{errors.total_questions}</span>}
            </div>

            {/* Total Marks */}
            <div className="form-group">
              <label className="text-xs font-semibold text-slate-600 mb-1.5">Total Marks</label>
              <input
                type="number"
                min={1}
                placeholder="Ex:250 Marks"
                className={`form-input w-full text-sm ${errors.total_marks ? 'border-red-500' : ''}`}
                value={formData.total_marks || ''}
                onChange={(e) => handleInputChange('total_marks', parseInt(e.target.value) || 0)}
                style={{ height: '44px', borderRadius: '10px', borderColor: '#cbd5e1' }}
              />
              {errors.total_marks && <span className="form-error-msg">{errors.total_marks}</span>}
            </div>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex justify-end items-center gap-4 mt-10 pt-6 border-t border-slate-100 select-none">
          <button
            type="button"
            className="btn px-6 h-11 text-indigo-600 bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent font-semibold"
            onClick={onCancel}
            disabled={isSaving}
            style={{ borderRadius: '10px', minWidth: '100px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary px-8 h-11 flex items-center justify-center font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
            onClick={onNextAddQuestions}
            disabled={isSaving}
            style={{ borderRadius: '10px', minWidth: '100px' }}
          >
            {isSaving ? 'Saving...' : 'Next'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTestView;
