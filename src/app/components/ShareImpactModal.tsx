import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { X, Download, Copy, Check, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ShareImpactModalProps {
  treesPlanted: number;
  forestRestored: number;
  carbonOffset: number;
  wildlifeProtected: number;
  actionsCompleted: number;
  recipientName?: string;
  onClose: () => void;
}

// ── The visual card that gets screenshotted ──────────────────────────────────
function ImpactCard({
  cardRef,
  treesPlanted,
  forestRestored,
  carbonOffset,
  wildlifeProtected,
  actionsCompleted,
  recipientName,
}: ShareImpactModalProps & { cardRef: React.RefObject<HTMLDivElement | null> }) {
  const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  const stats = [
    { emoji: '🌲', value: treesPlanted.toString(), label: 'Trees planted' },
    { emoji: '🌍', value: `${carbonOffset}kg`, label: 'CO₂ saved' },
    { emoji: '🌿', value: `${forestRestored}m²`, label: 'Forest protected' },
    { emoji: '🦁', value: wildlifeProtected.toString(), label: 'Species shielded' },
  ];

  return (
    <div
      ref={cardRef}
      style={{
        width: 480,
        background: 'linear-gradient(145deg, #0d3b1f 0%, #1a5c35 40%, #0f4a28 70%, #071d10 100%)',
        borderRadius: 20,
        padding: 36,
        fontFamily: "'Google Sans', 'Roboto', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', top: 80, right: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(24,128,56,0.3)' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.15)', fontSize: 22,
        }}>
          🌍
        </div>
        <div>
          <div style={{ color: '#ffffff', fontSize: 16, fontWeight: 700, letterSpacing: 0.3 }}>
            Planet Intelligence Maps
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 2 }}>
            My eco journey · {date}
          </div>
        </div>
      </div>

      {/* Hero message */}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 24,
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ color: '#81c784', fontSize: 13, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
          🏆 This journey I contributed
        </div>
        <div style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>
          {actionsCompleted} eco-action{actionsCompleted !== 1 ? 's' : ''} taken
          {recipientName ? ` for ${recipientName}'s future 💚` : ' for a greener planet 💚'}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {stats.map(stat => (
          <div
            key={stat.label}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14,
              padding: '14px 18px',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.emoji}</div>
            <div style={{ color: '#ffffff', fontSize: 24, fontWeight: 800 }}>{stat.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 18,
      }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
          #PlanetIntelligenceMaps  ·  #EcoRoute  ·  #GreenNavigation
        </div>
        <div style={{
          background: '#188038', borderRadius: 20, padding: '5px 14px',
          color: '#ffffff', fontSize: 11, fontWeight: 600,
        }}>
          Planet Hero ✓
        </div>
      </div>
    </div>
  );
}

// ── Share destinations ───────────────────────────────────────────────────────
interface Destination {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const destinations: Destination[] = [
  {
    id: 'twitter',
    label: 'Twitter / X',
    icon: <Twitter className="w-5 h-5" />,
    color: 'text-white',
    bg: 'bg-black',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'text-white',
    bg: 'bg-[#25D366]',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'text-white',
    bg: 'bg-[#0A66C2]',
  },
];

// ── Main modal ───────────────────────────────────────────────────────────────
export function ShareImpactModal(props: ShareImpactModalProps) {
  const { treesPlanted, forestRestored, carbonOffset, wildlifeProtected, actionsCompleted, recipientName, onClose } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareText = `🌍 I just took ${actionsCompleted} eco-actions and helped protect ${forestRestored}m² of forest, saving ${carbonOffset}kg of CO₂! 🌲 Join me on Planet Intelligence Maps. #EcoRoute #PlanetIntelligenceMaps`;

  const captureCard = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      setImageDataUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.warn('Card capture failed:', err);
    } finally {
      setIsCapturing(false);
    }
  }, []);

  useEffect(() => {
    // Give the DOM a frame to render the card before capturing
    const t = setTimeout(captureCard, 120);
    return () => clearTimeout(t);
  }, [captureCard]);

  const handleDownload = () => {
    if (!imageDataUrl) return;
    const a = document.createElement('a');
    a.href = imageDataUrl;
    a.download = `planet-impact-${Date.now()}.png`;
    a.click();
    toast.success('Impact card downloaded!', { icon: '💾' });
  };

  const handleCopy = async () => {
    if (!imageDataUrl) return;

    // 1. Try Clipboard Image API (Chrome desktop when page has clipboard-write permission)
    try {
      const res  = await fetch(imageDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      toast.success('Card copied to clipboard!', { icon: '📋' });
      setTimeout(() => setCopied(false), 2500);
      return;
    } catch { /* fall through */ }

    // 2. Try plain-text copy as fallback
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('Share text copied!', { description: 'Use Download to get the image card.', icon: '📋' });
      setTimeout(() => setCopied(false), 2500);
      return;
    } catch { /* fall through */ }

    // 3. Clipboard fully blocked (e.g. iframe sandbox) — guide user to download
    toast.info('Clipboard blocked by browser', {
      description: 'Use the Download button to save the card, then share it manually.',
      icon: '💾',
      duration: 5000,
    });
  };

  const handlePlatform = async (id: string) => {
    // First try to download the card so they have it to attach
    if (imageDataUrl) {
      const a = document.createElement('a');
      a.href = imageDataUrl;
      a.download = `planet-impact.png`;
      a.click();
    }

    const encoded = encodeURIComponent(shareText);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encoded}`,
      whatsapp: `https://wa.me/?text=${encoded}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://planet-intelligence-maps.figma.site')}&summary=${encoded}`,
    };
    window.open(urls[id], '_blank', 'noopener,noreferrer,width=640,height=520');
    toast.success('Card saved — attach it to your post!', { icon: '✅', duration: 4000 });
  };

  const handleNativeShare = async () => {
    if (!imageDataUrl) return;
    try {
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'planet-impact.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My Planet Impact', text: shareText });
        return;
      }
    } catch { /* fall through */ }
    // Fallback to text share
    if (navigator.share) {
      await navigator.share({ title: 'My Planet Impact', text: shareText });
    }
  };

  return (
    <>
      {/* Off-screen card for capture */}
      <div style={{ position: 'fixed', top: -9999, left: -9999, zIndex: -1 }}>
        <ImpactCard
          cardRef={cardRef}
          treesPlanted={treesPlanted}
          forestRestored={forestRestored}
          carbonOffset={carbonOffset}
          wildlifeProtected={wildlifeProtected}
          actionsCompleted={actionsCompleted}
          recipientName={recipientName}
          onClose={onClose}
        />
      </div>

      {/* Modal overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.92, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 24 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
          style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.28)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f3f4]">
            <div>
              <div className="text-[#202124] text-base" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600 }}>
                Share your impact 🌍
              </div>
              <div className="text-xs text-[#5f6368] mt-0.5">Save the card, then share it anywhere</div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card preview */}
          <div className="px-5 pt-4 pb-3 flex justify-center">
            <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.18)' }}>
              {isCapturing ? (
                <div className="w-[280px] h-[180px] bg-gradient-to-br from-[#0d3b1f] to-[#1a5c35] flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-white/60 text-xs">Generating card…</span>
                  </div>
                </div>
              ) : imageDataUrl ? (
                <img src={imageDataUrl} alt="Impact card" className="w-[280px] rounded-xl" style={{ display: 'block' }} />
              ) : (
                <div className="w-[280px] h-[180px] bg-[#f1f3f4] flex items-center justify-center rounded-xl text-[#5f6368] text-sm">
                  Preview unavailable
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-5 pb-3 grid grid-cols-2 gap-2">
            <button
              disabled={isCapturing || !imageDataUrl}
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#dadce0] hover:bg-[#f8f9fa] transition-colors disabled:opacity-40"
            >
              <Download className="w-4 h-4 text-[#1a73e8]" />
              <span className="text-sm text-[#202124]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>Download</span>
            </button>
            <button
              disabled={isCapturing || !imageDataUrl}
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#dadce0] hover:bg-[#f8f9fa] transition-colors disabled:opacity-40"
            >
              <AnimatePresence mode="wait">
                {copied
                  ? <motion.span key="check" initial={{ scale: 0.6 }} animate={{ scale: 1 }}><Check className="w-4 h-4 text-[#188038]" /></motion.span>
                  : <motion.span key="copy" initial={{ scale: 0.6 }} animate={{ scale: 1 }}><Copy className="w-4 h-4 text-[#5f6368]" /></motion.span>
                }
              </AnimatePresence>
              <span className="text-sm text-[#202124]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>
                {copied ? 'Copied!' : 'Copy card'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="mx-5 mb-3 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#e8eaed]" />
            <span className="text-xs text-[#9aa0a6]">or share to</span>
            <div className="flex-1 h-px bg-[#e8eaed]" />
          </div>

          {/* Platform buttons */}
          <div className="px-5 pb-4 space-y-2">
            {destinations.map(({ id, label, icon, color, bg }) => (
              <button
                key={id}
                onClick={() => handlePlatform(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${bg} ${color} hover:opacity-90 transition-opacity`}
              >
                {icon}
                <span className="text-sm" style={{ fontWeight: 500 }}>Share on {label}</span>
              </button>
            ))}

            {/* Native share if available */}
            {(typeof navigator !== 'undefined' && navigator.share) && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f1f3f4] text-[#202124] hover:bg-[#e8eaed] transition-colors"
              >
                <div className="w-5 h-5 flex items-center justify-center text-[#5f6368]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                </div>
                <span className="text-sm text-[#202124]" style={{ fontWeight: 500 }}>More options…</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}