
import React, { useEffect, useState, useRef } from 'react';
import { InvitationData, GroundingLink, GalleryImage } from '../types';
import { searchLocationOnMaps } from '../services/geminiService';
import { 
  Music, 
  MapPin, 
  Share2, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pause, 
  Phone, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Car, 
  Heart, 
  Navigation,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Props {
  data: InvitationData;
  isStandalone?: boolean;
}

const PetalEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className="petal absolute opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            backgroundColor: i % 2 === 0 ? '#ffffff' : '#fff5f8',
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 4 + 4}px`,
            borderRadius: '50% 0 50% 0',
            animation: `fall ${Math.random() * 8 + 5}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg); }
          15% { opacity: 0.4; }
          85% { opacity: 0.4; }
          100% { opacity: 0; transform: translate(${Math.random() * 80 - 40}px, 800px) rotate(540deg); }
        }
      `}</style>
    </div>
  );
};

const Preview: React.FC<Props> = ({ data, isStandalone = false }) => {
  const [mapLinks, setMapLinks] = useState<GroundingLink[]>([]);
  const [loadingMap, setLoadingMap] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [lightboxState, setLightboxState] = useState<{ index: number; type: 'main' | 'location' } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (data.address || data.location) {
      const timer = setTimeout(async () => {
        setLoadingMap(true);
        const result = await searchLocationOnMaps(data.address || data.location);
        setMapLinks(result.links);
        setLoadingMap(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [data.address, data.location]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Auto-play blocked"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('복사되었습니다.');
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxState) {
      const images = lightboxState.type === 'main' ? data.images : data.locationImages;
      setLightboxState({ ...lightboxState, index: (lightboxState.index + 1) % images.length });
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxState) {
      const images = lightboxState.type === 'main' ? data.images : data.locationImages;
      setLightboxState({ ...lightboxState, index: (lightboxState.index - 1 + images.length) % images.length });
    }
  };

  const currentLightboxImages = lightboxState?.type === 'main' ? data.images : data.locationImages;

  return (
    <div className={`w-full mx-auto relative bg-white overflow-hidden select-none h-full ${isStandalone ? 'max-w-none rounded-none border-none' : 'max-w-[375px] h-full max-h-[812px] shadow-2xl rounded-[3rem] border-[12px] border-[#1a1a1a]'}`}>
      
      {/* PERSISTENT AUDIO CONTROLLER */}
      {data.audioUrl && (
        <div className="absolute top-8 right-8 z-[60]">
          <button 
            onClick={toggleAudio}
            className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 border border-white/40 backdrop-blur-md ${
              isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/80 text-zinc-400'
            }`}
          >
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      )}

      {/* SCROLLABLE CONTENT AREA */}
      <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
        
        {/* Lightbox Modal */}
        {lightboxState !== null && currentLightboxImages.length > 0 && (
          <div 
            className="fixed inset-0 z-[100] bg-zinc-950/98 flex items-center justify-center p-6 animate-fadeIn"
            onClick={() => setLightboxState(null)}
          >
            <button className="absolute top-10 right-6 text-white/50 hover:text-white transition-colors" onClick={() => setLightboxState(null)}>
              <X size={32} />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white" onClick={handlePrev}><ChevronLeft size={36} /></button>
            <img src={currentLightboxImages[lightboxState.index].url} className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl" alt="Gallery Full" />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white" onClick={handleNext}><ChevronRight size={36} /></button>
            <div className="absolute bottom-12 text-white/50 text-xs font-bold tracking-widest bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {lightboxState.index + 1} / {currentLightboxImages.length}
            </div>
          </div>
        )}

        {/* Background Audio Tag */}
        {data.audioUrl && <audio ref={audioRef} src={data.audioUrl} loop />}

        {/* Main Hero Section */}
        <section className="relative h-[85vh] w-full flex flex-col items-center justify-end text-white text-center pb-16 overflow-hidden">
          {data.images.length > 0 ? (
            <img src={data.images[0].url} className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.8]" alt="Main" />
          ) : (
            <div className="absolute inset-0 bg-stone-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <PetalEffect />
          <div className="relative z-20 space-y-4 px-6">
            <h2 className="playfair italic text-5xl font-light tracking-tight animate-fadeInDown">Getting Married!</h2>
            <div className="text-xl font-medium tracking-[0.3em] mt-8 flex items-center justify-center gap-4">
              <span>{data.groomName}</span>
              <span className="text-white/40 font-light">&</span>
              <span>{data.brideName}</span>
            </div>
            <div className="text-sm font-light tracking-widest opacity-80 mt-2 uppercase">
              {data.date.replace(/[^0-9.]/g, '')} SAT PM 3:30
            </div>
          </div>
        </section>

        {/* Greeting Section */}
        <section className="py-32 px-10 text-center bg-white">
          <div className="text-[11px] tracking-[0.4em] mb-12 uppercase font-black text-stone-300">Greeting</div>
          <p className="leading-[2.4] whitespace-pre-wrap text-[15px] serif text-stone-700">
            {data.welcomeMessage}
          </p>
          <div className="mt-20 pt-16 border-t border-stone-100">
            <div className="space-y-6 text-[14px] text-stone-500">
              <p className="flex items-center justify-center gap-3">
                <span className="text-stone-300">{data.groomParents}</span> 의 아들 <span className="font-bold text-stone-800">{data.groomName}</span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-stone-300">{data.brideParents}</span> 의 딸 <span className="font-bold text-stone-800">{data.brideName}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Main Gallery Section */}
        <section className="py-24 px-4 bg-zinc-50/50">
          <div className="text-[11px] tracking-[0.4em] mb-12 text-center uppercase font-black text-stone-300">Gallery</div>
          <div className="grid grid-cols-3 gap-1">
            {data.images.map((img, idx) => (
              <div key={img.id} onClick={() => setLightboxState({ index: idx, type: 'main' })} className="aspect-square bg-stone-100 overflow-hidden cursor-zoom-in group">
                <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery" />
              </div>
            ))}
          </div>
        </section>

        {/* Location Section */}
        <section className="pt-24 pb-8 px-8 bg-white text-center">
          <h2 className="playfair text-3xl font-light tracking-[0.2em] mb-12 text-stone-400 uppercase">Location</h2>
          
          <div className="space-y-2 mb-10">
            <p className="text-[18px] font-bold text-zinc-900">{data.location} {data.locationDetail}</p>
            <p className="text-sm text-zinc-500">{data.address}</p>
            <p className="text-sm text-zinc-500">031-382-3838</p>
          </div>

          {/* Location Gallery Display */}
          <div className="space-y-4 mb-12">
            <div className="w-full">
              <div 
                className="w-full h-auto bg-stone-50 rounded-2xl overflow-hidden relative border border-stone-200 shadow-xl cursor-zoom-in group active:scale-[0.98] transition-all"
                onClick={() => setLightboxState({ index: 0, type: 'location' })}
              >
                <img 
                  src={data.locationImages[0]?.url} 
                  className="w-full h-auto min-h-[200px] object-cover opacity-95 group-hover:scale-105 transition-transform duration-1000" 
                  alt="Location Map"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Location+Map';
                  }}
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 px-4 py-2 rounded-full shadow-xl text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <MapPin size={14} /> 확대해서 보기
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Link Icons */}
          <div className="flex justify-center gap-12 mb-20">
            <button onClick={() => window.open(`https://map.kakao.com/?q=${encodeURIComponent(data.location)}`)} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-[#FAE100] rounded-2xl flex items-center justify-center text-zinc-900 shadow-md active:scale-95 transition-transform"><Navigation size={24} fill="currentColor" /></div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">카카오내비</span>
            </button>
            <button onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(data.location)}`)} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-[#2DB400] rounded-2xl flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"><Navigation size={24} fill="white" /></div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">네이버 지도</span>
            </button>
          </div>

          <div className="text-left space-y-10 border-t border-zinc-100 pt-16 px-2">
            <div className="space-y-3">
              <p className="text-sm font-bold text-zinc-800">버스 안내</p>
              <p className="text-[13px] text-zinc-500 leading-relaxed">4호선 인덕원역 8번 출구<br/>(셔틀버스 수시 운행)</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-bold text-zinc-800">자가용 안내</p>
              <p className="text-[13px] text-zinc-500 leading-relaxed">빌라드지디 안양 제2주차장</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-zinc-800">주차장</p>
              <p className="text-[13px] text-zinc-500 leading-relaxed">
                안양시 동안구 관양동 791-10<br/>
                "빌라드지디 안양 제2주차장" 주차 후 주차장 입구 앞 셔틀버스 탑승<br/>
                (셔틀버스 5분거리)<br/>
                <span className="font-bold text-zinc-800 mt-2 block">**일반 하객분들은 빌라드지디 안양 제2주차장을 이용 부탁드립니다.**</span>
              </p>
            </div>

            {data.parkingGuideEnabled && (
              <div className="pt-6 text-center">
                <a 
                  href="https://www.youtube.com/watch?v=ubqXDwt6CW4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[18px] font-black text-rose-500 border-b-2 border-rose-100 pb-1.5 hover:text-rose-600 transition-colors"
                >
                  주차장 오시는 길 영상 가이드 보기 <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Gift Section */}
        <section className="py-12 px-10 bg-zinc-50">
          <div className="text-[11px] tracking-[0.4em] mb-12 text-center uppercase font-black text-stone-300">Gift</div>
          <div className="space-y-3">
            {['groom', 'bride'].map((side) => (
              <div key={side} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === side ? null : side)}
                  className="w-full px-8 py-6 flex justify-between items-center text-[14px] font-bold text-zinc-700"
                >
                  {side === 'groom' ? '신랑측' : '신부측'} 마음 전하실 곳
                  {openAccordion === side ? <ChevronUp size={16} className="opacity-30" /> : <ChevronDown size={16} className="opacity-30" />}
                </button>
                {openAccordion === side && (
                  <div className="px-8 pb-8 space-y-6 border-t border-zinc-50 animate-fadeIn">
                    {(side === 'groom' ? data.accounts.groom : data.accounts.bride).map((acc, i) => (
                      <div key={i} className="flex justify-between items-center py-2">
                        <div className="text-xs">
                          <div className="text-zinc-400 mb-1">{acc.bank}</div>
                          <div className="font-bold text-zinc-800 text-sm tracking-tight">{acc.number}</div>
                          <div className="text-zinc-500 mt-0.5 font-medium">{acc.name}</div>
                        </div>
                        <button onClick={() => copyToClipboard(acc.number)} className="w-8 h-8 bg-zinc-50 rounded-lg text-zinc-400 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                          <Copy size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Share Section (Public only) */}
        {isStandalone && (
          <section className="pt-8 pb-32 px-10 text-center">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${data.groomName} ♡ ${data.brideName} 결혼식에 초대합니다`,
                    text: `${data.date} | ${data.location}`,
                    url: window.location.href
                  });
                } else {
                  copyToClipboard(window.location.href);
                }
              }}
              className="w-full py-5 bg-[#FAE100] text-zinc-800 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-md hover:brightness-95 transition-all"
            >
              <Share2 size={18} /> 카카오톡으로 청첩장 공유
            </button>
            <div className="mt-20 opacity-5 flex flex-col items-center gap-2">
              <Heart size={16} />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Forever starts here</p>
            </div>
          </section>
        )}

        <div className="h-20" />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-fadeInDown { animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Preview;
