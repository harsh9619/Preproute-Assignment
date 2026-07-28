import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../services';
import { useTests } from '../../store';
import { Subject, Topic, SubTopic, TestFormData } from '../../store/types';
import CreateTestView from '../../components/tests/CreateTestView';
import PageLoaderComponent from '../../components/common/page-loader';

const CreateTestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { createTest, updateTest } = useTests();

  // Loading state
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Dropdown lists
  const [subjectsList, setSubjectsList] = useState<Subject[]>([]);
  const [topicsList, setTopicsList] = useState<Topic[]>([]);
  const [subTopicsList, setSubTopicsList] = useState<SubTopic[]>([]);

  // Form State
  const [formData, setFormData] = useState<TestFormData>({
    name: '',
    subject: '',
    type: 'chapterwise',
    topics: [],
    sub_topics: [],
    difficulty: 'medium',
    correct_marks: 5,
    wrong_marks: -1,
    unattempt_marks: 0,
    total_time: 60,
    total_marks: 100,
    total_questions: 1
  });

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize Page Data
  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      try {
        // Fetch subjects
        const subjectsRes = await api.getSubjects();
        if (subjectsRes.status || subjectsRes.success) {
          setSubjectsList(subjectsRes.data);
        }
        if (id) {
          // Fetch test details
          const testRes = await api.getTest(id);
          if (testRes.status || testRes.success) {
            const test = testRes.data;
            // Find the subject ID by matching test.subject with name or id from the subjects list
            const matchedSubject = (subjectsRes.data || []).find(
              (sub: any) => sub.name?.toLowerCase() === test.subject?.toLowerCase()
            );
            const subjectId = matchedSubject ? matchedSubject.id : test.subject;

            // Fetch topics for this subject
            let topicIds: string[] = [];
            const topicsRes = await api.getTopics(subjectId || test.subject);
            if (topicsRes.status || topicsRes.success) {
              setTopicsList(topicsRes.data);

              // Resolve topic names/ids to their corresponding IDs from topicsRes.data

              if (test.topics && test.topics.length > 0) {
                topicIds = test.topics
                  .map((tNameOrId: string) => {
                    if (!tNameOrId) return undefined;
                    const matchedTopic = (topicsRes.data || []).find(
                      (t: any) => t.name?.toLowerCase() === tNameOrId.toLowerCase() || t.id === tNameOrId
                    );
                    return matchedTopic ? matchedTopic.id : undefined;
                  })
                  .filter((id: string | undefined): id is string => id !== undefined);
              }
            }

            // Fetch subtopics for these topics
            let subTopicIds: string[] = [];
            if (topicIds.length > 0) {
              console.log("topicIds", topicIds);
              debugger
              const subTopicsRes = await api.getSubTopicsMulti(topicIds);
              if (subTopicsRes.status || subTopicsRes.success) {
                setSubTopicsList(subTopicsRes.data);

                // Resolve sub-topic names/ids to their corresponding IDs from subTopicsRes.data
                if (test.sub_topics && test.sub_topics.length > 0) {
                  subTopicIds = test.sub_topics
                    .map((stNameOrId: string) => {
                      if (!stNameOrId) return undefined;
                      const matchedSubTopic = (subTopicsRes.data || []).find(
                        (st: any) => st.name?.toLowerCase() === stNameOrId.toLowerCase() || st.id === stNameOrId
                      );
                      return matchedSubTopic ? matchedSubTopic.id : undefined;
                    })
                    .filter((id: string | undefined): id is string => id !== undefined);
                }
              }
            }

            setFormData({
              name: test.name || '',
              subject: subjectId,
              type: test.type || 'chapterwise',
              topics: topicIds,
              sub_topics: subTopicIds,
              difficulty: test.difficulty || 'medium',
              correct_marks: test.correct_marks !== undefined ? test.correct_marks : 4,
              wrong_marks: test.wrong_marks !== undefined ? test.wrong_marks : -1,
              unattempt_marks: test.unattempt_marks !== undefined ? test.unattempt_marks : 0,
              total_time: test.total_time ?? 60,
              total_marks: test.total_marks ?? 250,
              total_questions: test.total_questions ?? 50
            });
          } else {
            toast.error('Failed to load test details.');
          }
        }
      } catch (err: any) {
        toast.error(err.message || 'Error loading initialization data.');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [id]);

  // Handle subject change (fetch topics and clear selections)
  useEffect(() => {
    if (!loading && formData.subject) {
      const fetchTopicsForSubject = async () => {
        try {
          const res = await api.getTopics(formData.subject);
          if (res.status || res.success) {
            setTopicsList(res.data);
          }
        } catch (err: any) {
          toast.error(err.message || 'Failed to load topics.');
        }
      };

      fetchTopicsForSubject();

      setFormData(prev => ({
        ...prev,
        topics: [],
        sub_topics: []
      }));
      setSubTopicsList([]);
    }
  }, [formData.subject, loading]);

  // Handle topics change (fetch subtopics and filter selected ones)
  useEffect(() => {
    if (!loading) {
      if (formData.topics.length === 0) {
        setSubTopicsList([]);
        setFormData(prev => ({ ...prev, sub_topics: [] }));
        return;
      }

      const fetchSubTopicsForTopics = async () => {
        try {
          const res = await api.getSubTopicsMulti(formData.topics);
          if (res.status || res.success) {
            const fetchedSubTopics: SubTopic[] = res.data;
            setSubTopicsList(fetchedSubTopics);

            // Filter out selected sub-topics that don't belong to the fetched sub-topics
            const validIds = fetchedSubTopics.map(st => st.id);
            setFormData(prev => ({
              ...prev,
              sub_topics: prev.sub_topics.filter(id => validIds.includes(id))
            }));
          }
        } catch (err: any) {
          toast.error(err.message || 'Failed to load sub-topics.');
        }
      };

      fetchSubTopicsForTopics();
    }
  }, [formData.topics, loading]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Test name is required';
    }
    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.type) {
      newErrors.type = 'Test type is required';
    }
    if (formData.topics.length === 0) {
      newErrors.topics = 'At least one topic must be selected';
    }
    if (formData.sub_topics.length === 0) {
      newErrors.sub_topics = 'At least one sub-topic must be selected';
    }
    if (formData.correct_marks === undefined || isNaN(formData.correct_marks)) {
      newErrors.correct_marks = 'Correct marks must be a valid number';
    }
    if (formData.wrong_marks === undefined || isNaN(formData.wrong_marks)) {
      newErrors.wrong_marks = 'Wrong marks must be a valid number';
    }
    if (formData.unattempt_marks === undefined || isNaN(formData.unattempt_marks)) {
      newErrors.unattempt_marks = 'Unattempted marks must be a valid number';
    }

    if (!formData.total_time || formData.total_time <= 0) {
      newErrors.total_time = 'Total time must be greater than 0';
    }
    if (!formData.total_marks || formData.total_marks <= 0) {
      newErrors.total_marks = 'Total marks must be greater than 0';
    }
    if (!formData.total_questions || formData.total_questions <= 0) {
      newErrors.total_questions = 'Total questions must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit test configuration
  const saveTestConfig = async (statusOverride?: 'draft' | 'live') => {
    if (!validateForm()) {
      toast.error('Please correct the validation errors in the form.');
      return null;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        status: statusOverride || 'draft'
      };

      let response;
      if (isEditMode && id) {
        response = await updateTest(id, payload);
      } else {
        response = await createTest(payload);
      }

      if (response.status || response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'API operation returned failure status');
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} test.`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsDraft = async () => {
    const savedTest = await saveTestConfig('draft');
    if (savedTest) {
      toast.success(`Test saved as draft successfully!`);
      navigate('/');
    }
  };

  const handleNextAddQuestions = async () => {
    const savedTest = await saveTestConfig();
    if (savedTest) {
      toast.success(`Test setup saved! Moving to questions section.`);
      navigate(`/test/${savedTest.id}/questions`);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <>
      <PageLoaderComponent isLoading={loading || isSaving} />
      <CreateTestView
        isEditMode={isEditMode}
        testId={id}
        formData={formData}
        setFormData={setFormData}
        subjects={subjectsList}
        topics={topicsList}
        subTopics={subTopicsList}
        loading={loading}
        errors={errors}
        isSaving={isSaving}
        onNextAddQuestions={handleNextAddQuestions}
        onCancel={handleCancel}
        onSaveAsDraft={handleSaveAsDraft}
      />
    </>
  );
};

export default CreateTestPage;
