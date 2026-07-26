import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../services';
import { Test, Question } from '../../store/types';
import PreviewPublishView from '../../components/tests/PreviewPublishView';

const PreviewPublishPage: React.FC = () => {
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<Test | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [topicsNames, setTopicsNames] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (testId) {
      fetchTestPreviewData();
    }
  }, [testId]);

  const fetchTestPreviewData = async () => {
    setLoading(true);
    try {
      const testRes = await api.getTest(testId);
      if (testRes.success && testRes.data) {
        const testObj: Test = testRes.data;
        setTest(testObj);

        const [subRes, topicsRes] = await Promise.all([
          api.getSubjects(),
          api.getTopics(testObj.subject)
        ]);

        if (subRes.success) {
          const sObj = subRes.data.find((s: any) => s.id === testObj.subject);
          setSubjectName(sObj ? sObj.name : testObj.subject);
        }

        if (topicsRes.success) {
          const mappedNames = (testObj.topics || []).map(tId => {
            const tObj = topicsRes.data.find((t: any) => t.id === tId);
            return tObj ? tObj.name : tId;
          });
          setTopicsNames(mappedNames);
        }

        if (testObj.questions && testObj.questions.length > 0) {
          const qRes = await api.fetchQuestionsBulk(testObj.questions);
          if (qRes.success) {
            setQuestions(qRes.data);
            setExpandedIndices(qRes.data.map((_: any, i: number) => i));
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load test preview data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (index: number) => {
    setExpandedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const handlePublish = async () => {
    if (!testId) return;
    setPublishing(true);
    try {
      const response = await api.updateTest(testId, { status: 'live' });
      if (response.success) {
        toast.success('Test published successfully!');
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish test');
    } finally {
      setPublishing(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <PreviewPublishView
      testId={testId}
      test={test}
      subjectName={subjectName}
      topicsNames={topicsNames}
      questions={questions}
      loading={loading}
      publishing={publishing}
      showSuccessModal={showSuccessModal}
      expandedIndices={expandedIndices}
      toggleAccordion={toggleAccordion}
      handlePublish={handlePublish}
      handleModalClose={handleModalClose}
    />
  );
};

export default PreviewPublishPage;
