import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../services';
import { Test, Topic, SubTopic, Question } from '../../store/types';
import AddQuestionsView from '../../components/tests/AddQuestionsView';

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

const AddQuestionsPage: React.FC = () => {
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Test and options state
  const [test, setTest] = useState<Test | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [topicOptions, setTopicOptions] = useState<Topic[]>([]);
  const [subTopicOptions, setSubTopicOptions] = useState<SubTopic[]>([]);
  const [loading, setLoading] = useState(true);

  // Local list of added questions
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);

  // Question Form state
  const [qText, setQText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOpt, setCorrectOpt] = useState('option1');
  const [explanation, setExplanation] = useState('');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [qTopic, setQTopic] = useState('');
  const [qSubTopic, setQSubTopic] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  // Editing state for individual question
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (testId) {
      fetchTestData();
    }
  }, [testId]);

  const fetchTestData = async () => {
    setLoading(true);
    try {
      const response = await api.getTest(testId);
      if (response.success && response.data) {
        const testObj: Test = response.data;
        setTest(testObj);

        const subRes = await api.getSubjects();
        if (subRes.success) {
          const sObj = subRes.data.find((s: any) => s.id === testObj.subject);
          setSubjectName(sObj ? sObj.name : testObj.subject);
        }

        const topicsRes = await api.getTopics(testObj.subject);
        if (topicsRes.success) {
          const filteredTopics = topicsRes.data.filter((t: any) => testObj.topics.includes(t.id));
          setTopicOptions(filteredTopics);
        }

        if (testObj.topics && testObj.topics.length > 0) {
          const subRes = await api.getSubTopicsMulti(testObj.topics);
          if (subRes.success) {
            const filteredSubs = subRes.data.filter((st: any) => testObj.sub_topics.includes(st.id));
            setSubTopicOptions(filteredSubs);
          }
        }

        if (testObj.questions && testObj.questions.length > 0) {
          const questionsRes = await api.fetchQuestionsBulk(testObj.questions);
          if (questionsRes.success) {
            setQuestions(questionsRes.data);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load test context');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!qText.trim()) newErrors.qText = 'Question text is required';
    if (!opt1.trim()) newErrors.opt1 = 'Option 1 is required';
    if (!opt2.trim()) newErrors.opt2 = 'Option 2 is required';
    if (!opt3.trim()) newErrors.opt3 = 'Option 3 is required';
    if (!opt4.trim()) newErrors.opt4 = 'Option 4 is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateQuestion = () => {
    if (!validateForm()) {
      toast.warning('Please fill all required question details.');
      return;
    }

    const questionPayload: LocalQuestion = {
      id: editingIndex !== null ? questions[editingIndex].id : undefined,
      type: 'mcq',
      question: qText.trim(),
      option1: opt1.trim(),
      option2: opt2.trim(),
      option3: opt3.trim(),
      option4: opt4.trim(),
      correct_option: correctOpt,
      explanation: explanation.trim() || undefined,
      difficulty: qDifficulty,
      topic_id: qTopic || undefined,
      sub_topic_id: qSubTopic || undefined,
      media_url: mediaUrl.trim() || undefined,
      test_id: testId
    };

    if (editingIndex !== null) {
      setQuestions(prev => {
        const copy = [...prev];
        copy[editingIndex] = questionPayload;
        return copy;
      });
      toast.success('Question updated in checklist');
      setEditingIndex(null);
    } else {
      setQuestions(prev => [...prev, questionPayload]);
      toast.success('Question added to checklist');
    }

    clearQuestionForm();
  };

  const clearQuestionForm = () => {
    setQText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setCorrectOpt('option1');
    setExplanation('');
    setQDifficulty('medium');
    setQTopic('');
    setQSubTopic('');
    setMediaUrl('');
    setEditingIndex(null);
    setErrors({});
  };

  const handleEditQuestion = (index: number) => {
    const q = questions[index];
    setQText(q.question);
    setOpt1(q.option1);
    setOpt2(q.option2);
    setOpt3(q.option3);
    setOpt4(q.option4);
    setCorrectOpt(q.correct_option);
    setExplanation(q.explanation || '');
    setQDifficulty((q.difficulty as 'easy' | 'medium' | 'hard') || 'medium');
    setQTopic(q.topic_id || '');
    setQSubTopic(q.sub_topic_id || '');
    setMediaUrl(q.media_url || '');
    setEditingIndex(index);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    toast.warning('Question removed from checklist');
    if (editingIndex === index) {
      clearQuestionForm();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleSaveAndContinue = async () => {
    if (questions.length === 0) {
      toast.warning('At least 1 question is required to proceed.');
      return;
    }

    setLoading(true);
    try {
      const qRes = await api.createQuestions(questions);
      if (qRes.success && qRes.data) {
        const createdQIds = qRes.data.map((q: any) => q.id);
        const totalQs = createdQIds.length;
        const totalMarksVal = totalQs * (test?.correct_marks || 4);

        const testUpdatePayload = {
          questions: createdQIds,
          total_questions: totalQs,
          total_marks: totalMarksVal
        };

        const testRes = await api.updateTest(testId, testUpdatePayload);
        if (testRes.success) {
          toast.success('Questions saved and linked successfully');
          navigate(`/test/${testId}/preview`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddQuestionsView
      testId={testId}
      test={test}
      subjectName={subjectName}
      topicOptions={topicOptions}
      subTopicOptions={subTopicOptions}
      loading={loading}
      questions={questions}
      qText={qText}
      setQText={setQText}
      opt1={opt1}
      setOpt1={setOpt1}
      opt2={opt2}
      setOpt2={setOpt2}
      opt3={opt3}
      setOpt3={setOpt3}
      opt4={opt4}
      setOpt4={setOpt4}
      correctOpt={correctOpt}
      setCorrectOpt={setCorrectOpt}
      explanation={explanation}
      setExplanation={setExplanation}
      qDifficulty={qDifficulty}
      setQDifficulty={setQDifficulty}
      qTopic={qTopic}
      setQTopic={setQTopic}
      qSubTopic={qSubTopic}
      setQSubTopic={setQSubTopic}
      mediaUrl={mediaUrl}
      setMediaUrl={setMediaUrl}
      editingIndex={editingIndex}
      errors={errors}
      handleAddOrUpdateQuestion={handleAddOrUpdateQuestion}
      clearQuestionForm={clearQuestionForm}
      handleEditQuestion={handleEditQuestion}
      handleDeleteQuestion={handleDeleteQuestion}
      handleSaveAndContinue={handleSaveAndContinue}
    />
  );
};

export default AddQuestionsPage;
