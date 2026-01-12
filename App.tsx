
import React, { useState, useRef } from 'react';
import { InvitationData, TemplateId, GalleryImage } from './types';
import TemplateSelector from './components/TemplateSelector';
import Preview from './components/Preview';
import { generateInvitationMessage } from './services/geminiService';
import { Sparkles, Heart, Music, Car, Plus, Info, Map as MapIcon } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<InvitationData>({
    groomName: '동훈',
    brideName: '정은',
    groomParents: '오일교 · 박선희',
    brideParents: '심창용 · 임미혜',
    date: '2026.03.28',
    time: '토요일 오후 3시 30분',
    location: '빌라드지디 안양',
    locationDetail: '3층 크리스탈캐슬',
    address: '경기 안양시 동안구 관악대로 254',
    welcomeMessage: '서로를 아끼고 사랑하며 행복하게 살겠습니다.\n저희의 첫 시작을 함께 축복해 주세요.',
    templateId: 'luxury',
    parkingGuideEnabled: true,
    audioUrl: '',
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800' },
      { id: '2', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800' },
      { id: '3', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800' }
    ],
    locationImages: [
      { id: 'default-map', url: '/location_map.jpg' }
    ],
    accounts: {
      groom: [
        { name: "오동훈 (신랑)", bank: "신한은행", number: "110410178356" },
        { name: "오일교 (부)", bank: "국민은행", number: "62510201205986" },
        { name: "박선희 (모)", bank: "우체국", number: "10465302183931" },
      ],
      bride: [
        { name: "심정은 (신부)", bank: "국민은행", number: "50160201278543" },
        { name: "심창용 (부)", bank: "국민은행", number: "58500204065137" },
        { name: "임미혜 (모)", bank: "국민은행", number: "78720204255835" },
      ]
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: any) => {
    setData(prev => {
      const keys = field.split('.');
      if (keys.length > 1) {
        const root = keys[0];
        const sub = keys[1];
        const currentRoot = prev[root as keyof InvitationData];
        if (typeof currentRoot === 'object' && currentRoot !== null) {
          return { ...prev, [root]: { ...currentRoot, [sub]: value } };
        }
      }
      return { ...prev, [field]: value };
    });
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const msg = await generateInvitationMessage({
      groom: data.groomName,
      bride: data.brideName,
      style: '감성적이고 고결한'
    });
    handleChange('welcomeMessage', msg);
    setIsGenerating(false);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'images' | 'locationImages') => {
    const files = e.target.files;
    if (files) {
      const newImages: GalleryImage[] = Array.from(files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file)
      }));
      handleChange(targetField, [...(data[targetField] as GalleryImage[]), ...newImages]);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange('audioUrl', url);
    }
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newImages = [...data.images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    handleChange('images', newImages);
  };

  const onDragEnd = () => setDraggedIndex(null);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f0f2f5]">
      <div className="flex-1 lg:max-w-xl bg-white h-screen p-6 lg:p-10 border-r border-zinc-200 overflow-y-auto no-scrollbar shadow-xl z-20">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3 text-rose-500">
            <Heart fill="currentColor" size={28} />
            <h1 className="text-2xl font-black tracking-tighter text-zinc-900">Everlasting</h1>
          </div>
          <div className="bg-zinc-100 px-3 py-1 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Editor</div>
        </header>

        <main className="space-y-12 pb-32">
          {/* Template */}
          <section>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 block">Mood & Template</label>
            <TemplateSelector selected={data.templateId} onSelect={(id) => handleChange('templateId', id)} />
          </section>

          {/* Core Info */}
          <section className="space-y-6">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] block">Wedding Couple</label>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="신랑 이름" value={data.groomName} onChange={(e) => handleChange('groomName', e.target.value)} className="input-field" />
              <input type="text" placeholder="신부 이름" value={data.brideName} onChange={(e) => handleChange('brideName', e.target.value)} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="신랑 부모님" value={data.groomParents} onChange={(e) => handleChange('groomParents', e.target.value)} className="input-field" />
              <input type="text" placeholder="신부 부모님" value={data.brideParents} onChange={(e) => handleChange('brideParents', e.target.value)} className="input-field" />
            </div>
          </section>

          {/* Date & Location */}
          <section className="space-y-6">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] block">Date & Venue</label>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="2026.03.28" value={data.date} onChange={(e) => handleChange('date', e.target.value)} className="input-field" />
              <input type="text" placeholder="오후 3시 30분" value={data.time} onChange={(e) => handleChange('time', e.target.value)} className="input-field" />
            </div>
            <input type="text" placeholder="장소명" value={data.location} onChange={(e) => handleChange('location', e.target.value)} className="input-field w-full" />
            <input type="text" placeholder="홀 명칭" value={data.locationDetail} onChange={(e) => handleChange('locationDetail', e.target.value)} className="input-field w-full" />
            <input type="text" placeholder="도로명 주소" value={data.address} onChange={(e) => handleChange('address', e.target.value)} className="input-field w-full" />
          </section>

          {/* Location Gallery (Fixed Map - Task 2) */}
          <section className="space-y-6">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] block">Location Map (Fixed)</label>
            <div className="rounded-2xl overflow-hidden border border-zinc-200 relative group bg-zinc-50 shadow-sm aspect-video">
              <img src={data.locationImages[0].url} className="w-full h-full object-cover" alt="fixed-location-map" />
              <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <MapIcon size={12} /> Read-Only
              </div>
            </div>
            <div className="flex items-start gap-2 text-zinc-400 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
              <Info size={14} className="mt-0.5" />
              <p className="text-[11px] leading-relaxed">지도 이미지는 <b>/location_map.jpg</b>로 고정되어 수정할 수 없습니다. 하객들에게 일관된 약도 정보를 제공합니다.</p>
            </div>
          </section>

          {/* Message */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Greeting</label>
              <button onClick={handleGenerateAI} disabled={isGenerating} className="text-[10px] font-bold bg-zinc-900 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                <span className="animate-pulse"><Sparkles size={12} /></span> {isGenerating ? 'AI Generating...' : 'AI 추천 문구'}
              </button>
            </div>
            <textarea rows={5} value={data.welcomeMessage} onChange={(e) => handleChange('welcomeMessage', e.target.value)} className="input-field w-full resize-none leading-relaxed" />
          </section>

          {/* Main Gallery */}
          <section className="space-y-6">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] block">Photo Gallery (Drag to Reorder)</label>
            <div className="grid grid-cols-4 gap-3">
              <label className="aspect-square border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors group">
                <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleGalleryUpload(e, 'images')} />
                <Plus size={24} className="text-zinc-300 group-hover:text-zinc-500" />
              </label>
              {data.images.map((img, index) => (
                <div 
                  key={img.id} 
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  className={`aspect-square rounded-2xl overflow-hidden border border-zinc-100 relative group cursor-move transition-all ${draggedIndex === index ? 'opacity-30 scale-90 ring-4 ring-rose-200' : 'hover:shadow-lg'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover pointer-events-none" alt="item" />
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-zinc-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Main</div>
                  )}
                  <button onClick={() => handleChange('images', data.images.filter(i => i.id !== img.id))} className="absolute top-1 right-1 w-6 h-6 bg-rose-500 rounded-full text-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[12px] font-bold">×</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Music Upload */}
          <section className="space-y-6">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] block">Background Music</label>
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white"><Music size={20}/></div>
                <div>
                  <p className="text-sm font-bold text-zinc-800">배경 음악 (MP3)</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{data.audioUrl ? '음악이 등록되었습니다.' : '파일을 선택하세요.'}</p>
                </div>
              </div>
              <button 
                onClick={() => audioInputRef.current?.click()}
                className="text-[11px] font-bold bg-white border border-zinc-200 px-4 py-2 rounded-lg hover:shadow-md transition-shadow"
              >
                파일 선택
              </button>
              <input 
                type="file" 
                ref={audioInputRef} 
                className="hidden" 
                accept="audio/*" 
                onChange={handleAudioUpload} 
              />
            </div>
          </section>

          {/* Parking Guide Toggle */}
          <section className="space-y-5">
            <div className="flex items-center justify-between p-6 border border-zinc-100 rounded-2xl bg-zinc-50/50">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white"><Car size={20}/></div>
                 <div>
                   <p className="text-sm font-bold text-zinc-800 tracking-tight">상세 주차/교통 안내 링크</p>
                   <p className="text-[11px] text-zinc-400 mt-0.5">안내 영상 및 상세 주차 정보를 하단에 표시합니다.</p>
                 </div>
               </div>
               <div 
                 onClick={() => handleChange('parkingGuideEnabled', !data.parkingGuideEnabled)}
                 className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${data.parkingGuideEnabled ? 'bg-rose-500' : 'bg-zinc-200'}`}
               >
                 <div className={`w-4 h-4 bg-white rounded-full transition-transform ${data.parkingGuideEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
               </div>
            </div>
          </section>
        </main>
      </div>

      <div className="flex-1 bg-[#d0d3d9] flex items-center justify-center p-6 lg:p-12 overflow-hidden h-screen">
        <Preview data={data} />
      </div>

      <style>{`
        .input-field {
          @apply px-4 py-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 text-sm focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all placeholder:text-zinc-300 font-medium;
        }
      `}</style>
    </div>
  );
};

export default App;
