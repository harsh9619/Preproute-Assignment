export const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const calculateTotalMarks = (questionCount: number | string, correctMarks: number | string): number => {
    const count = Number(questionCount) || 0;
    const marks = Number(correctMarks) || 0;
    return count * marks;
};