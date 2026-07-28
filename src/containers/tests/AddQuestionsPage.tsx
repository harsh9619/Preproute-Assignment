import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../services';
import { Test, Topic, SubTopic, Question, LocalQuestion, QuestionFormErrors } from '../../store/types';
import AddQuestionsView from '../../components/tests/AddQuestionsView';
import PageLoaderComponent from '../../components/common/page-loader';

const AddQuestionsPage: React.FC = () => {
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Test details and dropdowns
  const [test, setTest] = useState<Test | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [topicOptions, setTopicOptions] = useState<Topic[]>([]);
  const [subTopicOptions, setSubTopicOptions] = useState<SubTopic[]>([]);
  const [loading, setLoading] = useState(true);

  // Index-mapped questions state (representing the slots from 0 to total_questions - 1)
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Form fields for active slot
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
  const [errors, setErrors] = useState<QuestionFormErrors>({});

  useEffect(() => {
    if (testId) {
      fetchTestData();
    }
  }, [testId]);

  const fetchTestData = async () => {
    setLoading(true);
    try {
      const response = await api.getTest(testId);
      if ((response.status || response.success) && response.data) {
        const testObj: Test = response.data;
        setTest(testObj);
        // Fetch subject name
        const subjectsRes = await api.getSubjects();
        if (subjectsRes.status || subjectsRes.success) {
          const sObj = subjectsRes.data.find((s: any) => s.name === testObj.subject);
          setSubjectName(sObj ? sObj.name : testObj.subject);
        }

        const matchedSubject = (subjectsRes.data || []).find(
          (sub: any) => sub.name?.toLowerCase() === testObj.subject?.toLowerCase() || sub.id === testObj.subject
        );
        const subjectId = matchedSubject ? matchedSubject.id : testObj.subject;

        let topicIds: string[] = [];
        let subTopicIds: string[] = [];
        // Fetch topics options
        const topicsRes = await api.getTopics(subjectId);
        if (topicsRes.status || topicsRes.success) {
          if (testObj.topics && testObj.topics.length > 0) {
            topicIds = testObj.topics
              .map((tNameOrId: string) => {
                if (!tNameOrId) return undefined;
                const matchedTopic = (topicsRes.data || []).find(
                  (t: any) => t.name?.toLowerCase() === tNameOrId.toLowerCase() || t.id === tNameOrId
                );
                return matchedTopic ? matchedTopic.id : undefined;
              })
              .filter((id: string | undefined): id is string => id !== undefined);
          }
          const filteredTopics = topicsRes.data.filter((t: any) => topicIds.includes(t.id));
          setTopicOptions(filteredTopics);
        }


        // Fetch sub-topics options
        if (topicIds && topicIds.length > 0) {
          const subRes = await api.getSubTopicsMulti(topicIds);
          if (subRes.status || subRes.success) {


            // Resolve sub-topic names/ids to their corresponding IDs from subTopicsRes.data
            if (testObj.sub_topics && testObj.sub_topics.length > 0) {
              subTopicIds = testObj.sub_topics
                .map((stNameOrId: string) => {
                  if (!stNameOrId) return undefined;
                  const matchedSubTopic = (subRes.data || []).find(
                    (st: any) => st.name?.toLowerCase() === stNameOrId.toLowerCase() || st.id === stNameOrId
                  );
                  return matchedSubTopic ? matchedSubTopic.id : undefined;
                })
                .filter((id: string | undefined): id is string => id !== undefined);
            }
            const filteredSubs = subRes.data.filter((st: any) => subTopicIds.includes(st.id));
            setSubTopicOptions(filteredSubs);
          }
        }

        // Load existing questions if present on backend
        if (testObj.questions && testObj.questions.length > 0) {
          const questionsRes = await api.fetchQuestionsBulk(testObj.questions);
          if ((questionsRes.status || questionsRes.success) && questionsRes.data && questionsRes.data.length > 0) {
            const loadedQuestions: LocalQuestion[] = [];
            // Map each question to its corresponding index slot
            questionsRes.data.forEach((q: LocalQuestion, idx: number) => {
              loadedQuestions[idx] = q;
            });
            setQuestions(loadedQuestions);

            // Load the first question into form fields
            const firstQ = loadedQuestions[0];
            if (firstQ) {
              setQText(firstQ.question || '');
              setOpt1(firstQ.option1 || '');
              setOpt2(firstQ.option2 || '');
              setOpt3(firstQ.option3 || '');
              setOpt4(firstQ.option4 || '');
              setCorrectOpt(firstQ.correct_option || 'option1');
              setExplanation(firstQ.explanation || '');
              setQDifficulty((firstQ.difficulty as 'easy' | 'medium' | 'hard') || 'medium');
              setQTopic(firstQ.topic_id || '');
              setQSubTopic(firstQ.sub_topic_id || '');
              setMediaUrl(firstQ.media_url || '');
            }
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
    const newErrors: QuestionFormErrors = {};
    if (!qText.trim()) newErrors.qText = 'Question text is required';
    if (!opt1.trim()) newErrors.opt1 = 'Option A is required';
    if (!opt2.trim()) newErrors.opt2 = 'Option B is required';
    if (!opt3.trim()) newErrors.opt3 = 'Option C is required';
    if (!opt4.trim()) newErrors.opt4 = 'Option D is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save current active form values to questions slot array
  const saveCurrentQuestionToSlot = (index: number) => {
    if (!qText.trim() && !opt1.trim() && !opt2.trim() && !opt3.trim() && !opt4.trim()) {
      // Slot is empty, clear it from state if existed
      setQuestions(prev => {
        const copy = [...prev];
        delete copy[index];
        return copy;
      });
      return;
    }

    const questionPayload: LocalQuestion = {
      // id: questions[index]?.id, // Retain ID if it was fetched
      type: 'mcq',
      question: qText.trim(),
      option1: opt1.trim(),
      option2: opt2.trim(),
      option3: opt3.trim(),
      option4: opt4.trim(),
      correct_option: correctOpt,
      explanation: explanation?.trim() || undefined,
      difficulty: qDifficulty,
      topic_id: qTopic || undefined,
      sub_topic_id: qSubTopic || undefined,
      media_url: mediaUrl?.trim() || undefined,
      test_id: testId,
      subject: subjectName || undefined,
    };

    setQuestions(prev => {
      const copy = [...prev];
      copy[index] = questionPayload;
      return copy;
    });
  };

  // Load question form values from index
  const loadQuestionFromSlot = (newIndex: number, currentQuestionsList: LocalQuestion[]) => {
    const q = currentQuestionsList[newIndex];
    setErrors({});
    if (q) {
      setQText(q.question || '');
      setOpt1(q.option1 || '');
      setOpt2(q.option2 || '');
      setOpt3(q.option3 || '');
      setOpt4(q.option4 || '');
      setCorrectOpt(q.correct_option || 'option1');
      setExplanation(q.explanation || '');
      setQDifficulty((q.difficulty as 'easy' | 'medium' | 'hard') || 'medium');
      setQTopic(q.topic_id || '');
      setQSubTopic(q.sub_topic_id || '');
      setMediaUrl(q.media_url || '');
    } else {
      // Clear form fields
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
    }
  };

  // Handle switching slots
  const handleSelectQuestionSlot = (newIndex: number) => {
    saveCurrentQuestionToSlot(activeQuestionIndex);

    // We pass the updated questions list to load correctly
    let updatedQuestions = [...questions];
    if (!qText.trim() && !opt1.trim() && !opt2.trim() && !opt3.trim() && !opt4.trim()) {
      delete updatedQuestions[activeQuestionIndex];
    } else {
      updatedQuestions[activeQuestionIndex] = {
        id: questions[activeQuestionIndex]?.id,
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
    }

    setActiveQuestionIndex(newIndex);
    loadQuestionFromSlot(newIndex, updatedQuestions);
  };

  // Navigations
  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      handleSelectQuestionSlot(activeQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < (test?.total_questions || 50) - 1) {
      handleSelectQuestionSlot(activeQuestionIndex + 1);
    }
  };

  // Delete all edits (clear slot)
  const handleDeleteAllEdits = () => {
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
    setErrors({});

    setQuestions(prev => {
      const copy = [...prev];
      delete copy[activeQuestionIndex];
      return copy;
    });
    toast.warning('Question slot cleared');
  };

  const handleDeleteQuestion = (deleteIndex: number) => {
    if (!window.confirm(`Are you sure you want to clear/delete Question ${deleteIndex + 1}?`)) {
      return;
    }

    setQuestions(prev => {
      const copy = [...prev];
      delete copy[deleteIndex];
      return copy;
    });

    if (activeQuestionIndex === deleteIndex) {
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
      setErrors({});
    }

    toast.success(`Question ${deleteIndex + 1} cleared`);
  };

  const handleAddNewQuestion = () => {
    // Save current active form slot first, if it has content
    const hasInput = !!(qText.trim() || opt1.trim() || opt2.trim() || opt3.trim() || opt4.trim());
    if (hasInput) {
      if (!validateForm()) {
        toast.error('Please complete the current active question details before adding another.');
        return;
      }
      saveCurrentQuestionToSlot(activeQuestionIndex);
    }

    const currentTotal = test?.total_questions || 50;
    const newTotal = currentTotal + 1;

    setTest(prev => prev ? { ...prev, total_questions: newTotal } : null);
    setActiveQuestionIndex(currentTotal);

    let updatedQuestions = [...questions];
    if (hasInput) {
      updatedQuestions[activeQuestionIndex] = {
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
    } else {
      delete updatedQuestions[activeQuestionIndex];
    }

    loadQuestionFromSlot(currentTotal, updatedQuestions);
    toast.success(`Question slot ${newTotal} added`);
  };

  // Save checklist and proceed to Preview
  const handleSaveAndContinue = async () => {
    // Construct the active question payload synchronously to avoid state update lag
    const activeQuestionPayload: LocalQuestion | null =
      (qText.trim() || opt1.trim() || opt2.trim() || opt3.trim() || opt4.trim())
        ? {
          id: questions[activeQuestionIndex]?.id,
          type: 'mcq',
          question: qText.trim(),
          option1: opt1.trim(),
          option2: opt2.trim(),
          option3: opt3.trim(),
          option4: opt4.trim(),
          correct_option: correctOpt,
          explanation: explanation?.trim() || undefined,
          difficulty: qDifficulty,
          topic_id: qTopic || undefined,
          sub_topic_id: qSubTopic || undefined,
          media_url: mediaUrl?.trim() || undefined,
          test_id: testId,
          subject: subjectName || undefined,
        }
        : null;

    let finalQuestions = [...questions];
    if (activeQuestionPayload) {
      finalQuestions[activeQuestionIndex] = activeQuestionPayload;
    } else {
      delete finalQuestions[activeQuestionIndex];
    }

    // Save final questions state
    setQuestions(finalQuestions);

    // Filter out slots that are empty
    const validQuestions = finalQuestions.filter(q => q && q.question && q.question.trim());

    if (validQuestions.length === 0) {
      toast.warning('At least 1 question is required to proceed.');
      return;
    }

    const cleanedQuestions = validQuestions.map(q => {
      const qCopy = { ...q };
      if (!qCopy.topic || qCopy.topic === 'null' || qCopy.topic === 'undefined') {
        delete qCopy.topic;
      }
      if (!qCopy.sub_topic || qCopy.sub_topic === 'null' || qCopy.sub_topic === 'undefined') {
        delete qCopy.sub_topic;
      }
      if (!qCopy.media_url || !qCopy.media_url.trim() || qCopy.media_url === 'null' || qCopy.media_url === 'undefined') {
        delete qCopy.media_url;
      }
      if (!qCopy.explanation || !qCopy.explanation.trim() || qCopy.explanation === 'null' || qCopy.explanation === 'undefined') {
        delete qCopy.explanation;
      }
      if (!qCopy?.paragraph || !qCopy?.paragraph.trim() || qCopy?.paragraph === 'null' || qCopy?.paragraph === 'undefined') {
        delete qCopy.paragraph;
      }
      if (!qCopy?.category || !qCopy?.category.trim() || qCopy?.category === 'null' || qCopy?.category === 'undefined') {
        delete qCopy.category;
      }
      delete qCopy.id;
      return qCopy;
    });

    setLoading(true);

    try {
      const qRes = await api.createQuestions(cleanedQuestions);
      if ((qRes.status || qRes.success) && qRes.data) {
        const createdQIds = qRes.data.map((q: any) => q.id);
        const totalQs = createdQIds.length;
        const totalMarksVal = totalQs * (test?.correct_marks || 4);

        const testUpdatePayload = {
          questions: createdQIds,
          total_questions: test?.total_questions || totalQs,
          total_marks: totalMarksVal
        };

        const testRes = await api.updateTest(testId, testUpdatePayload);
        if (testRes.status || testRes.success) {
          toast.success('Questions saved successfully');
          navigate(`/test/${testId}/preview`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save questions');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    handleSaveAndContinue();
  };


  return (
    <>
      <PageLoaderComponent isLoading={loading} />
      <AddQuestionsView
        testId={testId}
        test={test}
        subjectName={subjectName}
        topicOptions={topicOptions}
        subTopicOptions={subTopicOptions}
        loading={loading}
        questions={questions}
        activeQuestionIndex={activeQuestionIndex}
        handleSelectQuestionSlot={handleSelectQuestionSlot}
        handlePrevQuestion={handlePrevQuestion}
        handleNextQuestion={handleNextQuestion}
        handleDeleteAllEdits={handleDeleteAllEdits}
        handleDeleteQuestion={handleDeleteQuestion}
        handleAddNewQuestion={handleAddNewQuestion}
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
        errors={errors}
        handleSaveAndContinue={handleSaveAndContinue}
        handlePublish={handlePublish}
      />
    </>

  );
};

export default AddQuestionsPage;
