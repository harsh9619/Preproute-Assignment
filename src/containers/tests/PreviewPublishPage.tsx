import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../services';
import { Test, Question } from '../../store/types';
import PreviewPublishView from '../../components/tests/PreviewPublishView';
import CommonModal from '../../components/common/Modal';
import {
  ArrowLeft, Edit2, CheckCircle2, Circle, Clock,
  FileText, Award, Calendar, ChevronDown, CheckCircle
} from 'lucide-react';

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
  const [publishTab, setPublishTab] = useState<'now' | 'schedule'>('now');

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
      if ((testRes.status || testRes.success) && testRes.data) {
        const testObj: Test = testRes.data;
        setTest(testObj);

        const subjectsRes = await api.getSubjects();
        if (subjectsRes.status) {
          const sObj = subjectsRes.data.find((s: any) => s.name === testObj.subject);
          setSubjectName(sObj ? sObj.name : testObj.subject);
        }
        const matchedSubject = (subjectsRes.data || []).find(
          (sub: any) => sub.name?.toLowerCase() === testObj.subject?.toLowerCase() || sub.id === testObj.subject
        );
        const subjectId = matchedSubject ? matchedSubject.id : testObj.subject;

        const topicsRes = await api.getTopics(subjectId);

        if (topicsRes.status || topicsRes.success) {
          const mappedNames = (testObj.topics || []).map(tId => {
            const tObj = topicsRes.data.find((t: any) => t.id === tId || t.name === tId);
            return tObj ? tObj.name : tId;
          });
          setTopicsNames(mappedNames);
        }

        if (testObj.questions && testObj.questions.length > 0) {
          const qRes = await api.fetchQuestionsBulk(testObj.questions);
          if (qRes.status || qRes.success) {
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
      const response = await api.updateTest(testId, { status: publishTab === 'now' ? 'live' : 'scheduled' });
      if (response.status || response.success) {
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
    <>
      <PreviewPublishView
        testId={testId}
        test={test}
        subjectName={subjectName}
        topicsNames={topicsNames}
        questions={questions}
        loading={loading}
        publishing={publishing}
        expandedIndices={expandedIndices}
        toggleAccordion={toggleAccordion}
        handlePublish={handlePublish}
        publishTab={publishTab}
        setPublishTab={setPublishTab}
      />
      <CommonModal
        open={showSuccessModal}
        onCancel={handleModalClose}
        footer={null}
        closable={false}
        width={450}
      >
        <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={40} />
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', fontWeight: 700 }}>Test Published!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Your test <strong style={{ color: '#1e293b' }}>"{test?.name}"</strong> has been successfully set to live. Students can now access and attempt this test.
          </p>

          <button
            onClick={handleModalClose}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            Back to Dashboard
          </button>
        </div>
      </CommonModal>


    </>
  );
};

export default PreviewPublishPage;
