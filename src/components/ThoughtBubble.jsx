import { useRef, useEffect, useState } from 'react';

// Parametric cloud path: 4 bumps on top, 3 on bottom, scales to any W×H
function buildCloud(W, H) {
  const r  = Math.min(14, W * 0.08, H * 0.16);
  const bh = 10;
  const bw = Math.max(14, W * 0.11);
  const topBumps = [W * 0.22, W * 0.44, W * 0.66, W * 0.83];
  const botBumps = [W * 0.28, W * 0.54, W * 0.76];
  let d = `M ${r} 0 `;
  let cur = r;
  for (const cx of topBumps) {
    const x0 = cx - bw / 2, x1 = cx + bw / 2;
    if (x0 > cur + 0.5) d += `L ${x0} 0 `;
    d += `C ${x0 + bw * 0.3} ${-bh} ${x1 - bw * 0.3} ${-bh} ${x1} 0 `;
    cur = x1;
  }
  if (W - r > cur + 0.5) d += `L ${W - r} 0 `;
  d += `Q ${W} 0 ${W} ${r} L ${W} ${H - r} Q ${W} ${H} ${W - r} ${H} `;
  cur = W - r;
  for (const cx of [...botBumps].reverse()) {
    const x0 = cx - bw / 2, x1 = cx + bw / 2;
    if (x1 < cur - 0.5) d += `L ${x1} ${H} `;
    d += `C ${x1 - bw * 0.3} ${H + bh} ${x0 + bw * 0.3} ${H + bh} ${x0} ${H} `;
    cur = x0;
  }
  if (r < cur - 0.5) d += `L ${r} ${H} `;
  d += `Q 0 ${H} 0 ${H - r} L 0 ${r} Q 0 0 ${r} 0 Z`;
  return d;
}

// Light tint text color per pillar accent
const LIGHT_TEXT = {
  '#84cc16': '#c8f59a',
  '#22c55e': '#a8f0be',
  '#14b8a6': '#96ede5',
  '#a855f7': '#d4a8fa',
  '#3b82f6': '#a6c4fc',
  '#f97316': '#fdc8a0',
};

const TB_TEXT_W = 168;

export default function ThoughtBubble({ text, idx, color = '#84cc16' }) {
  const measureRef = useRef(null);
  const [textH, setTextH] = useState(54);

  useEffect(() => {
    if (!measureRef.current) return;
    const h = measureRef.current.getBoundingClientRect().height;
    if (h > 0) setTextH(Math.ceil(h));
  }, [text]);

  const uid  = `${idx}-${color.replace('#', '')}`;
  const fid  = `tbf${uid}`;
  const kid  = `tba${uid}`;
  const PX = 20, PY = 20, BH = 10;
  const W  = TB_TEXT_W + PX * 2;
  const H  = textH + PY * 2;
  const cloud = buildCloud(W, H);
  const perim = (W + H) * 2 + 60;
  const textColor = LIGHT_TEXT[color] || '#d4f0e8';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        ref={measureRef}
        style={{
          position: 'fixed', top: 0, left: '-9999px',
          width: `${TB_TEXT_W}px`,
          fontSize: '9.5px', fontWeight: 500, lineHeight: '1.65',
          visibility: 'hidden', pointerEvents: 'none',
        }}
      >
        {text}
      </div>

      <svg
        viewBox={`-5 ${-(BH + 5)} ${W + 10} ${H + BH * 2 + 10}`}
        width={W + 10}
        height={H + BH * 2 + 10}
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <filter id={fid} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <style>{`@keyframes ${kid}{from{stroke-dashoffset:0}to{stroke-dashoffset:-${perim + 30}}}`}</style>
        </defs>
        <path d={cloud} fill="rgba(5,5,5,0.97)" stroke={`${color}2e`} strokeWidth="1.5" />
        <path d={cloud} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={`28 ${perim - 8}`}
          filter={`url(#${fid})`}
          style={{ animation: `${kid} 2.8s linear infinite` }}
        />
        <foreignObject x={PX} y={PY} width={TB_TEXT_W} height={textH + 20}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: `${TB_TEXT_W}px`,
              fontSize: '9.5px', color: textColor, lineHeight: '1.65',
              textAlign: 'center', fontWeight: 500,
            }}
          >
            {text}
          </div>
        </foreignObject>
      </svg>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', marginTop: '2px' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(5,5,5,0.97)', border: `1.5px solid ${color}59` }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(5,5,5,0.97)', border: `1px solid ${color}40`, marginBottom: 3 }} />
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(5,5,5,0.97)', border: `1px solid ${color}2e`, marginBottom: 7 }} />
      </div>
    </div>
  );
}
