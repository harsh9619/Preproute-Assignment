import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTests } from '../../store';
import { Test, Question } from '../../store/types';
import { api } from '../../services';
import DashboardView from '../../components/tests/DashboardView';

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

  useEffect(() => {
    fetchTests();
    fetchSubjects();
  }, []);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await deleteTest(deleteId);
      if (response.success) {
        toast.success('Test deleted successfully');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete test');
    } finally {
      setDeleteId(null);
    }
  };

  const handleViewClick = async (testId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setViewLoading(true);
    try {
      const response = await api.getTest(testId);
      if (response.success) {
        const testObj: Test = response.data;
        setViewTest(testObj);

        if (testObj.questions && testObj.questions.length > 0) {
          const qRes = await api.fetchQuestionsBulk(testObj.questions);
          if (qRes.success) {
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
  );
};

export default DashboardPage;
