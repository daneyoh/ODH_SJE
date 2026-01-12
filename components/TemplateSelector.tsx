
import React from 'react';
import { TemplateId } from '../types';

interface Props {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

const templates: { id: TemplateId; name: string; color: string }[] = [
  { id: 'classic', name: '클래식', color: 'bg-stone-100' },
  { id: 'modern', name: '모던', color: 'bg-zinc-800' },
  { id: 'floral', name: '플로럴', color: 'bg-rose-50' },
  { id: 'luxury', name: '럭셔리', color: 'bg-amber-50' },
];

const TemplateSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
            selected === t.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`w-12 h-16 rounded shadow-sm ${t.color}`} />
          <span className="text-sm font-medium">{t.name}</span>
        </button>
      ))}
    </div>
  );
};

export default TemplateSelector;
