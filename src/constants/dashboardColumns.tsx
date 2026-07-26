import React from 'react';
import { Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Subject, Test } from '../store/types';

export interface DashboardColumnsParams {
  subjects: Subject[];
  handleViewClick: (id: string, e: React.MouseEvent) => void;
  handleDeleteClick: (id: string, e: React.MouseEvent) => void;
  navigate: (path: string) => void;
}

const getSubjectLabel = (subjects: Subject[], record: Test) => {
  const subjectKey = (record as any).subject_id || record.subject;
  const match = subjects.find((subject) => subject.id === subjectKey);
  return match?.name || (typeof subjectKey === 'string' ? subjectKey : 'Unknown Subject');
};

export const getDashboardColumns = ({
  subjects,
  handleViewClick,
  handleDeleteClick,
  navigate,
}: DashboardColumnsParams): ColumnsType<Test> => [
  {
    title: 'Test Name',
    dataIndex: 'name',
    key: 'name',
    render: (_, record) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{record.name}</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Tag color="gold" style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>{record.difficulty}</Tag>
          {record.topics && record.topics.length > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {record.topics.join(', ')}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    title: 'Subject',
    dataIndex: 'subject',
    key: 'subject',
    render: (_, record) => getSubjectLabel(subjects, record),
    responsive: ['md'],
  },
  {
    title: 'Duration',
    dataIndex: 'total_time',
    key: 'duration',
    render: (value: number) => `${value} mins`,
    responsive: ['sm'],
  },
  {
    title: 'Questions',
    dataIndex: 'total_questions',
    key: 'questions',
    render: (value: number) => `${value || 0} Qs`,
    responsive: ['lg'],
  },
  {
    title: 'Marks',
    dataIndex: 'total_marks',
    key: 'marks',
    render: (value: number) => `${value || 0} pts`,
    responsive: ['lg'],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (value: string) => {
      const color = value === 'live' ? 'green' : value === 'draft' ? 'orange' : 'default';
      return <Tag color={color}>{value}</Tag>;
    },
    responsive: ['sm'],
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <Button type="default" size="small" icon={<Eye size={14} />} onClick={(e) => handleViewClick(record.id, e as any)} />
        {record.status === 'draft' ? (
          <Button type="default" size="small" icon={<Edit size={14} />} onClick={() => navigate(`/edit-test/${record.id}`)} />
        ) : (
          <Button type="default" size="small" icon={<Edit size={14} />} disabled />
        )}
        <Button type="primary" danger size="small" icon={<Trash2 size={14} />} onClick={(e) => handleDeleteClick(record.id, e as any)} />
      </div>
    ),
    align: 'right',
  },
];
