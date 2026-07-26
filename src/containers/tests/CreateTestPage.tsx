import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTests } from '../../store';
import { toast } from 'react-toastify';
import CreateTestView from '../../components/tests/CreateTestView';

interface FormErrors {
  name?: string;
  subject?: string;
  topics?: string;
  sub_topics?: string;
  correct_marks?: string;
  wrong_marks?: string;
  unattempt_marks?: string;
  total_time?: string;
  total_marks?: string;
}

const CreateTestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // present if editing
  const navigate = useNavigate();

  const isEditMode = !!id;

  const {
    subjects: subjectsOptions,
    topics: topicsOptions,
    subTopics: subTopicsOptions,
    currentTest,
    loading: storeLoading,
    fetchSubjects,
    fetchTopics,
    fetchSubTopics,
    fetchTest,
    createTest,
    updateTest
  } = useTests();

  // Form fields state
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('chapterwise');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [correctMarks, setCorrectMarks] = useState<number | string>(4);
  const [wrongMarks, setWrongMarks] = useState<number | string>(-1);
  const [unattemptMarks, setUnattemptMarks] = useState<number | string>(0);
  const [totalTime, setTotalTime] = useState<number | string>(60);
  const [totalMarks, setTotalMarks] = useState<number | string>(100);

  // Local UI states
  const [pageLoading, setPageLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [topicsDropdownOpen, setTopicsDropdownOpen] = useState(false);
  const [subTopicsDropdownOpen, setSubTopicsDropdownOpen] = useState(false);

  // Refs for closing dropdowns on click outside
  const topicsRef = useRef<HTMLDivElement>(null);
  const subTopicsRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (topicsRef.current && !topicsRef.current.contains(e.target as Node)) {
        setTopicsDropdownOpen(false);
      }
      if (subTopicsRef.current && !subTopicsRef.current.contains(e.target as Node)) {
        setSubTopicsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch subjects on mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Load existing test details if in Edit Mode
  useEffect(() => {
    if (!isEditMode || !id) return;
    fetchTest(id);
  }, [id, isEditMode]);

  // Populate fields when currentTest is loaded
  useEffect(() => {
    if (!isEditMode || !currentTest || currentTest.id !== id) return;

    if (currentTest.status === 'live') {
      toast.warning('Live tests cannot be edited.');
      navigate('/');
      return;
    }

    setName(currentTest.name);
    setSubject(currentTest.subject); // Subject UUID
    setType(currentTest.type);
    setDifficulty(currentTest.difficulty);
    setCorrectMarks(currentTest.correct_marks);
    setWrongMarks(currentTest.wrong_marks);
    setUnattemptMarks(currentTest.unattempt_marks);
    setTotalTime(currentTest.total_time);
    setTotalMarks(currentTest.total_marks);

    // Fetch topics for this subject
    fetchTopics(currentTest.subject);
  }, [currentTest, isEditMode, id]);

  // Set selected topics and fetch subtopics when topicsOptions change (on initial load for edit mode)
  useEffect(() => {
    if (isEditMode && currentTest && currentTest.id === id && topicsOptions.length > 0) {
      setSelectedTopics(currentTest.topics || []);
      if (currentTest.topics && currentTest.topics.length > 0) {
        fetchSubTopics(currentTest.topics);
      }
    }
  }, [topicsOptions, currentTest, isEditMode, id]);

  // Populate selected subtopics when subTopicsOptions are loaded (on initial load for edit mode)
  useEffect(() => {
    if (isEditMode && currentTest && currentTest.id === id && subTopicsOptions.length > 0) {
      setSelectedSubTopics(currentTest.sub_topics || []);
    }
  }, [subTopicsOptions, currentTest, isEditMode, id]);

  // Load topics when subject changes (for creation/interaction)
  const handleSubjectChange = (subjectId: string) => {
    setSubject(subjectId);
    setSelectedTopics([]);
    setSelectedSubTopics([]);

    if (subjectId) {
      fetchTopics(subjectId);
    }
  };

  // Load sub-topics when selected topics change
  useEffect(() => {
    if (selectedTopics.length === 0) {
      setSelectedSubTopics([]);
      return;
    }
    fetchSubTopics(selectedTopics);
  }, [selectedTopics]);

  // Toggle Topic Selection
  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(t => t !== topicId)
        : [...prev, topicId]
    );
  };

  // Toggle Sub-topic Selection
  const handleSubTopicToggle = (subTopicId: string) => {
    setSelectedSubTopics(prev =>
      prev.includes(subTopicId)
        ? prev.filter(st => st !== subTopicId)
        : [...prev, subTopicId]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = 'Test Name is required';
    if (!subject) newErrors.subject = 'Subject selection is required';
    if (selectedTopics.length === 0) newErrors.topics = 'Select at least one topic';
    if (selectedSubTopics.length === 0) newErrors.sub_topics = 'Select at least one sub-topic';

    // Marking scheme validation
    if (correctMarks === '' || isNaN(Number(correctMarks)) || Number(correctMarks) <= 0) {
      newErrors.correct_marks = 'Correct answer marks must be positive';
    }
    if (wrongMarks === '' || isNaN(Number(wrongMarks))) {
      newErrors.wrong_marks = 'Wrong answer marks must be a number';
    }
    if (unattemptMarks === '' || isNaN(Number(unattemptMarks))) {
      newErrors.unattempt_marks = 'Unattempted marks must be a number';
    }
    if (!totalTime || isNaN(Number(totalTime)) || Number(totalTime) <= 0) {
      newErrors.total_time = 'Test duration must be a positive number';
    }
    if (!totalMarks || isNaN(Number(totalMarks)) || Number(totalMarks) <= 0) {
      newErrors.total_marks = 'Total marks must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFormPayload = (statusOverride: string | null = null) => {
    return {
      name: name.trim(),
      type,
      subject,
      topics: selectedTopics,
      sub_topics: selectedSubTopics,
      difficulty,
      correct_marks: Number(correctMarks),
      wrong_marks: Number(wrongMarks),
      unattempt_marks: Number(unattemptMarks),
      total_time: Number(totalTime),
      total_marks: Number(totalMarks),
      status: statusOverride // if null, backend defaults/maintains status
    };
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) {
      toast.warning('Please fill all required fields correctly.');
      return;
    }

    setPageLoading(true);
    try {
      const payload = getFormPayload('draft');
      let response;
      if (isEditMode && id) {
        response = await updateTest(id, payload);
      } else {
        response = await createTest(payload);
      }

      if (response.success) {
        toast.success('Test draft saved successfully');
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save test draft');
    } finally {
      setPageLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (!validateForm()) {
      toast.warning('Please fill all required fields correctly.');
      return;
    }

    setPageLoading(true);
    try {
      const payload = getFormPayload();
      let response;
      if (isEditMode && id) {
        response = await updateTest(id, payload);
      } else {
        response = await createTest(payload);
      }

      if (response.success && response.data) {
        toast.success('Test details saved, proceeding to questions');
        const testId = response.data.id;
        navigate(`/test/${testId}/questions`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save test details');
    } finally {
      setPageLoading(false);
    }
  };

  const activeLoading = storeLoading || pageLoading;

  return (
    <CreateTestView
      isEditMode={isEditMode}
      name={name}
      setName={setName}
      subject={subject}
      handleSubjectChange={handleSubjectChange}
      type={type}
      setType={setType}
      selectedTopics={selectedTopics}
      handleTopicToggle={handleTopicToggle}
      selectedSubTopics={selectedSubTopics}
      handleSubTopicToggle={handleSubTopicToggle}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      correctMarks={correctMarks}
      setCorrectMarks={setCorrectMarks}
      wrongMarks={wrongMarks}
      setWrongMarks={setWrongMarks}
      unattemptMarks={unattemptMarks}
      setUnattemptMarks={setUnattemptMarks}
      totalTime={totalTime}
      setTotalTime={setTotalTime}
      totalMarks={totalMarks}
      setTotalMarks={setTotalMarks}
      subjectsOptions={subjectsOptions}
      topicsOptions={topicsOptions}
      subTopicsOptions={subTopicsOptions}
      pageLoading={activeLoading}
      errors={errors}
      topicsDropdownOpen={topicsDropdownOpen}
      setTopicsDropdownOpen={setTopicsDropdownOpen}
      subTopicsDropdownOpen={subTopicsDropdownOpen}
      setSubTopicsDropdownOpen={setSubTopicsDropdownOpen}
      topicsRef={topicsRef}
      subTopicsRef={subTopicsRef}
      handleSaveDraft={handleSaveDraft}
      handleNextStep={handleNextStep}
    />
  );
};

export default CreateTestPage;
