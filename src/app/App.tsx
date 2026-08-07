import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import photo1 from "@/imports/IMG_6819.jpg";
import photo2 from "@/imports/IMG_6820.jpg";
import photo3 from "@/imports/IMG_6815.jpg";
import photo4 from "@/imports/IMG_6817.PNG";

// ── palette ──────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "#ff6bdb", "#ffd166", "#06d6a0", "#118ab2", "#ff4d6d",
  "#a29bfe", "#fd79a8", "#fdcb6e", "#55efc4", "#74b9ff",
];

const BALLOON_COLORS = [
  { body: "#ff6bdb", shine: "#ff9ef0" },
  { body: "#ffd166", shine: "#ffe9a0" },
  { body: "#06d6a0", shine: "#7fffd4" },
  { body: "#ff4d6d", shine: "#ff8fa3" },
  { body: "#a29bfe", shine: "#c8c3ff" },
  { body: "#74b9ff", shine: "#b0d4ff" },
];

// ── types ─────────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  shape: "rect" | "circle" | "strip";
}

interface BalloonItem {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  colorIdx: number;
  sway: number;
}

// ── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiRain() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const p: Particle[] = Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 30,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 8,
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 6,
      rotate: Math.random() * 360,
      shape: (["rect", "circle", "strip"] as const)[Math.floor(Math.random() * 3)],
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.shape === "strip" ? p.size * 0.3 : p.size,
            height: p.shape === "circle" ? p.size : p.shape === "strip" ? p.size * 3 : p.size * 0.5,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "strip" ? "2px" : "1px",
            opacity: 0.85,
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [p.rotate, p.rotate + 360 * (Math.random() > 0.5 ? 1 : -1)],
            x: [0, (Math.random() - 0.5) * 120],
            opacity: [0.9, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ── Balloon SVG ───────────────────────────────────────────────────────────────
function BalloonSVG({ body, shine, size }: { body: string; shine: string; size: number }) {
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 60 80" fill="none">
      <ellipse cx="30" cy="30" rx="26" ry="28" fill={body} />
      <ellipse cx="22" cy="18" rx="7" ry="5" fill={shine} opacity={0.6} />
      <path d="M30 58 Q28 63 30 68 Q32 63 30 58Z" fill={body} />
      <line x1="30" y1="68" x2="30" y2="80" stroke={body} strokeWidth="1.5" opacity={0.6} />
      <polygon points="27,58 33,58 30,63" fill={body} />
    </svg>
  );
}

// ── Floating Balloons ─────────────────────────────────────────────────────────
function FloatingBalloons() {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);

  useEffect(() => {
    const b: BalloonItem[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 5 + (i / 14) * 90 + (Math.random() - 0.5) * 10,
      size: 38 + Math.random() * 36,
      duration: 7 + Math.random() * 6,
      delay: Math.random() * 7,
      colorIdx: i % BALLOON_COLORS.length,
      sway: 20 + Math.random() * 30,
    }));
    setBalloons(b);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {balloons.map((b) => {
        const c = BALLOON_COLORS[b.colorIdx];
        return (
          <motion.div
            key={b.id}
            className="absolute"
            style={{ left: `${b.x}%`, bottom: "-120px" }}
            animate={{
              y: [0, -(window.innerHeight + 200)],
              x: [0, b.sway, -b.sway, 0],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <BalloonSVG body={c.body} shine={c.shine} size={b.size} />
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Heart SVG ─────────────────────────────────────────────────────────────────
function HeartSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 90" fill={color}>
      <path d="M50 85 C50 85 5 55 5 30 C5 15 17 5 30 5 C38 5 45 9 50 15 C55 9 62 5 70 5 C83 5 95 15 95 30 C95 55 50 85 50 85Z" />
    </svg>
  );
}

// ── Cake SVG ─────────────────────────────────────────────────────────────────
function CakeSVG({ size = 140 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* candles */}
      <rect x="28" y="18" width="8" height="22" rx="3" fill="#ffd166" />
      <rect x="56" y="10" width="8" height="30" rx="3" fill="#ff6bdb" />
      <rect x="84" y="18" width="8" height="22" rx="3" fill="#06d6a0" />
      {/* flames */}
      <ellipse cx="32" cy="14" rx="4" ry="6" fill="#fdcb6e" opacity={0.95} />
      <ellipse cx="60" cy="6" rx="4" ry="6" fill="#ff6bdb" opacity={0.95} />
      <ellipse cx="88" cy="14" rx="4" ry="6" fill="#06d6a0" opacity={0.95} />
      {/* top tier */}
      <rect x="20" y="40" width="80" height="28" rx="6" fill="#a29bfe" />
      <rect x="20" y="40" width="80" height="8" rx="4" fill="#c8c3ff" opacity={0.5} />
      {/* frosting drips */}
      {[28, 42, 56, 70, 84].map((x) => (
        <ellipse key={x} cx={x} cy="40" rx="5" ry="6" fill="#f5f0ff" opacity={0.9} />
      ))}
      {/* bottom tier */}
      <rect x="10" y="68" width="100" height="38" rx="6" fill="#ff6bdb" />
      <rect x="10" y="68" width="100" height="10" rx="5" fill="#ff9ef0" opacity={0.5} />
      {/* bottom drips */}
      {[22, 38, 54, 70, 86, 100].map((x) => (
        <ellipse key={x} cx={x} cy="68" rx="6" ry="7" fill="#f5f0ff" opacity={0.85} />
      ))}
      {/* decorations */}
      <circle cx="40" cy="85" r="4" fill="#ffd166" />
      <circle cx="60" cy="82" r="4" fill="#06d6a0" />
      <circle cx="80" cy="85" r="4" fill="#ffd166" />
      <text x="60" y="93" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f0a1e" fontFamily="sans-serif">DAD</text>
    </svg>
  );
}

// ── Star burst ────────────────────────────────────────────────────────────────
function StarSVG({ size, color }: { size: number; color: string }) {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180);
    const b = ((i * 72 + 36) - 90) * (Math.PI / 180);
    const or = size / 2, ir = or * 0.42;
    return `${or + or * Math.cos(a)},${or + or * Math.sin(a)} ${or + ir * Math.cos(b)},${or + ir * Math.sin(b)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={pts} fill={color} />
    </svg>
  );
}

// ── Wish Card ────────────────────────────────────────────────────────────────
interface WishCardProps {
  emoji: string;
  text: string;
  accentColor: string;
  index: number;
}

function WishCard({ emoji, text, accentColor, index }: WishCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: "easeOut" }}
      whileHover={{ scale: 1.04, y: -5 }}
      className="relative rounded-2xl p-6 flex flex-col items-center gap-3 text-center cursor-default"
      style={{
        background: "linear-gradient(135deg, rgba(28,20,53,0.95) 0%, rgba(39,29,66,0.9) 100%)",
        border: `1.5px solid ${accentColor}44`,
        boxShadow: `0 4px 32px ${accentColor}22, 0 0 0 1px ${accentColor}11`,
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
        style={{ background: `${accentColor}22`, border: `1.5px solid ${accentColor}55` }}
      >
        {emoji}
      </div>
      <p
        className="text-sm leading-relaxed"
        style={{ fontFamily: "'Lora', serif", color: "#c8bbee", fontStyle: "italic" }}
      >
        {text}
      </p>
      <div className="absolute -top-2 -right-2">
        <StarSVG size={16} color={accentColor} />
      </div>
    </motion.div>
  );
}

// ── Orbiting Hearts ───────────────────────────────────────────────────────────
function OrbitingHearts() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: "50%", left: "50%", width: 20, height: 20, marginTop: -10, marginLeft: -10 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `rotate(${deg}deg) translateY(-64px) rotate(-${deg}deg)`,
            }}
          >
            <HeartSVG size={18 + (i % 3) * 6} color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]} />
          </div>
        </motion.div>
      ))}
      {/* center cake */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <CakeSVG size={110} />
        </motion.div>
      </div>
    </div>
  );
}

// ── Floating Photos ───────────────────────────────────────────────────────────
const PHOTOS = [photo1, photo2, photo3, photo4];
const PHOTO_ALTS = [
  "Dad and daughter with gelato in Italy",
  "Dad and daughter hugging in Piazza San Marco",
  "Dad and daughter by an illuminated Christmas tree",
  "Dad and daughter selfie at the Campanile di San Marco",
];

interface FloatingPhoto {
  id: number;
  photoIdx: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  active: boolean;
}

function FloatingPhotos() {
  const [photos, setPhotos] = useState<FloatingPhoto[]>([]);

  useEffect(() => {
    const items: FloatingPhoto[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      photoIdx: i % 4,
      x: 5 + Math.random() * 88,
      size: 90 + Math.random() * 70,
      duration: 9 + Math.random() * 7,
      delay: Math.random() * 14,
      rotate: (Math.random() - 0.5) * 22,
      active: Math.random() > 0.35,
    }));
    setPhotos(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {photos.filter((p) => p.active).map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            bottom: "-220px",
            width: p.size,
            height: p.size * 1.15,
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.45), 0 0 0 3px rgba(255,255,255,0.12)",
            rotate: p.rotate,
          }}
          animate={{
            y: [0, -(window.innerHeight + 300)],
            rotate: [p.rotate, p.rotate + (Math.random() > 0.5 ? 8 : -8)],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ImageWithFallback
            src={PHOTOS[p.photoIdx]}
            alt={PHOTO_ALTS[p.photoIdx]}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
}

// ── Sparkle divider ───────────────────────────────────────────────────────────
function SparkleRow() {
  const items = ["✦", "♥", "✦", "★", "✦", "♥", "✦"];
  const colors = ["#ffd166", "#ff6bdb", "#ffd166", "#a29bfe", "#ffd166", "#ff6bdb", "#ffd166"];
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      {items.map((s, i) => (
        <motion.span
          key={i}
          style={{ color: colors[i], fontSize: i === 3 ? 22 : 14, lineHeight: 1 }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        >
          {s}
        </motion.span>
      ))}
    </div>
  );
}


// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [burstKey, setBurstKey] = useState(0);
  const [bursting, setBursting] = useState(false);

  const handleBurst = useCallback(() => {
    if (bursting) return;
    setBursting(true);
    setBurstKey((k) => k + 1);
    setTimeout(() => setBursting(false), 900);
  }, [bursting]);

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        background: "radial-gradient(ellipse at 20% 10%, #1f1060 0%, #0f0a1e 55%, #0d1a35 100%)",
        fontFamily: "'Lora', serif",
      }}
    >
      <ConfettiRain />
      <FloatingBalloons />
      <FloatingPhotos />

      {/* rainbow top bar */}
      <div
        className="w-full h-1.5"
        style={{
          background: "linear-gradient(90deg, #ff4d6d, #ffd166, #06d6a0, #74b9ff, #ff6bdb, #a29bfe, #ff4d6d)",
        }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── Hero ── */}
        <section className="flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
          {/* HAPPY BIRTHDAY stacked display */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-2"
          >
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 12vw, 9rem)",
                lineHeight: 0.92,
                letterSpacing: "0.03em",
                background: "linear-gradient(135deg, #ffd166 0%, #ff6bdb 50%, #a29bfe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 40px rgba(255,107,219,0.35))",
              }}
            >
              HAPPY
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 12vw, 9rem)",
                lineHeight: 0.92,
                letterSpacing: "0.03em",
                background: "linear-gradient(135deg, #a29bfe 0%, #06d6a0 50%, #74b9ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 40px rgba(6,214,160,0.35))",
              }}
            >
              BIRTHDAY
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <div
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "clamp(2.8rem, 9vw, 6.5rem)",
                fontWeight: 700,
                color: "#ffd166",
                textShadow: "0 0 30px rgba(253,203,110,0.5), 0 2px 8px rgba(0,0,0,0.4)",
                lineHeight: 1.1,
              }}
            >
              Dad
            </div>
          </motion.div>

          <SparkleRow />

          {/* Orbiting cake */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 120 }}
            className="my-6 cursor-pointer select-none"
            onClick={handleBurst}
          >
            <OrbitingHearts />

            {/* burst ring */}
            {bursting && (
              <motion.div
                key={burstKey}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ top: "50%", left: "50%", translateX: "-50%", translateY: "-50%", zIndex: 10 }}
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div
                  className="w-32 h-32 rounded-full"
                  style={{ border: "3px solid #ffd166", boxShadow: "0 0 24px #ffd166" }}
                />
              </motion.div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            style={{ color: "#a891d4", fontStyle: "italic", fontSize: "0.85rem" }}
          >
            tap the cake ✨
          </motion.p>
        </section>

        {/* ── Love declaration ── */}
        <section className="flex flex-col items-center px-6 py-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative w-full rounded-3xl px-8 py-10 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(28,20,53,0.97) 0%, rgba(20,10,48,0.95) 100%)",
              border: "1.5px solid rgba(255,107,219,0.3)",
              boxShadow: "0 8px 60px rgba(162,155,254,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* corner stars */}
            {[
              { top: -10, left: -10, color: "#ffd166" },
              { top: -10, right: -10, color: "#ff6bdb" },
              { bottom: -10, left: -10, color: "#06d6a0" },
              { bottom: -10, right: -10, color: "#a29bfe" },
            ].map((s, i) => (
              <div key={i} className="absolute" style={s as React.CSSProperties}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: "linear" }}
                >
                  <StarSVG size={22} color={s.color} />
                </motion.div>
              </div>
            ))}

            <p
              className="text-3xl mb-4"
              style={{
                fontFamily: "'Dancing Script', cursive",
                color: "#ff6bdb",
                fontWeight: 700,
                textShadow: "0 0 20px rgba(255,107,219,0.4)",
              }}
            >
              I love you, Dad ♥
            </p>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "1.08rem",
                color: "#c8bbee",
                lineHeight: 1.85,
              }}
            >
              Happy birthday dad! I love you so much! I hope you're having fun here in Italy (your birth-country) with us, and that you you like this website. Since you've been creating a lot of websites lately I thought it was fit to gift you one as well! This also grants you a single token for me to help you or create one software product whether that be a game, app, or website! Happy birthday!
            </p>

            <div className="flex justify-center gap-3 mt-6">
              {["#ff4d6d", "#ff6bdb", "#ffd166", "#ff6bdb", "#ff4d6d"].map((c, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                >
                  <HeartSVG size={i === 2 ? 30 : 20} color={c} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>


        {/* rainbow bottom bar */}
        <div
          className="w-full h-1.5"
          style={{
            background: "linear-gradient(90deg, #ff4d6d, #ffd166, #06d6a0, #74b9ff, #ff6bdb, #a29bfe, #ff4d6d)",
          }}
        />
      </div>
    </div>
  );
}
