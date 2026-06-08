import { useState } from 'react';

// ─── Color palette (mirrors ProgressionStaircase) ─────────────────────────────
const C = {
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  glow:'rgba(34,197,94,0.2)',   hex:'#22c55e', dot:'bg-green-400'  },
  blue:   { text:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/30',   bar:'bg-blue-500',   glow:'rgba(59,130,246,0.2)',  hex:'#3b82f6', dot:'bg-blue-400'  },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', glow:'rgba(168,85,247,0.2)',  hex:'#a855f7', dot:'bg-purple-400'},
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', glow:'rgba(249,115,22,0.2)',  hex:'#f97316', dot:'bg-orange-400'},
};

// ─── Test data ────────────────────────────────────────────────────────────────
const TEST_DATA = [
  {
    month: 1, week: 4, label: 'Tuần 4', color: 'green',
    icon: '🌱', title: 'Kiểm Tra Nền Tảng',
    desc: 'Đánh giá sau 1 tháng đầu — hỏi: "cơ thể mình đang ở đâu?"',
    tests: [
      { id:'plank',  name:'Plank Tĩnh',       icon:'⏱', unit:'giây',
        how:'Giữ plank thẳng (hoặc gối) — đếm số giây liên tục',
        levels:[{ label:'Bắt Đầu', min:15,  color:'green' },{ label:'Tiến Bộ', min:30, color:'blue' },{ label:'Xuất Sắc', min:55, color:'purple' }],
        maxDisplay: 90 },
      { id:'pushup', name:'Push-up Tối Đa',   icon:'💪', unit:'lần',
        how:'Push-up chuẩn hoặc push-up gối — đếm số lần liên tục không dừng',
        levels:[{ label:'Bắt Đầu', min:5,   color:'green' },{ label:'Tiến Bộ', min:10, color:'blue' },{ label:'Xuất Sắc', min:18, color:'purple' }],
        maxDisplay: 30 },
      { id:'squat',  name:'Squat 1 Phút',     icon:'🦵', unit:'lần',
        how:'Squat liên tục trong 60 giây — đếm số lần hoàn chỉnh',
        levels:[{ label:'Bắt Đầu', min:12,  color:'green' },{ label:'Tiến Bộ', min:20, color:'blue' },{ label:'Xuất Sắc', min:28, color:'purple' }],
        maxDisplay: 40 },
      { id:'walk1k', name:'Đi Bộ 1km',        icon:'🚶', unit:'phút',
        how:'Thời gian hoàn thành 1km đi bộ liên tục — tính phút',
        lowerBetter: true,
        levels:[{ label:'Bắt Đầu', min:13,  color:'green' },{ label:'Tiến Bộ', min:11, color:'blue' },{ label:'Xuất Sắc', min:9,  color:'purple' }],
        maxDisplay: 20 },
    ],
  },
  {
    month: 2, week: 8, label: 'Tuần 8', color: 'blue',
    icon: '📈', title: 'Kiểm Tra Tiến Bộ',
    desc: 'Sau 2 tháng — hỏi: "mình đã tiến bộ bao nhiêu và hướng nào tiếp theo?"',
    tests: [
      { id:'plank',   name:'Plank Tĩnh',       icon:'⏱', unit:'giây',
        how:'Plank thẳng (không gối) — đếm giây liên tục',
        levels:[{ label:'Bắt Đầu', min:30, color:'green' },{ label:'Tiến Bộ', min:50, color:'blue' },{ label:'Xuất Sắc', min:75, color:'purple' }],
        maxDisplay: 120 },
      { id:'pushup',  name:'Push-up Tối Đa',   icon:'💪', unit:'lần',
        how:'Push-up chuẩn, không nghỉ — đếm số lần liên tục',
        levels:[{ label:'Bắt Đầu', min:10, color:'green' },{ label:'Tiến Bộ', min:18, color:'blue' },{ label:'Xuất Sắc', min:28, color:'purple' }],
        maxDisplay: 45 },
      { id:'deadbug', name:'Dead Bug Form',     icon:'🧠', unit:'điểm (0–10)',
        how:'Tự đánh giá: lưng có dán sàn không? tay chân có kiểm soát không? Cho điểm 0–10',
        levels:[{ label:'Học Thêm', min:4, color:'orange' },{ label:'Ổn Định', min:7, color:'blue' },{ label:'Thành Thạo', min:9, color:'purple' }],
        maxDisplay: 10 },
      { id:'run1k',   name:'Chạy/Đi 1km',      icon:'🏃', unit:'phút',
        how:'Thời gian hoàn thành 1km chạy bộ hoặc đi bộ nhanh — tính phút',
        lowerBetter: true,
        levels:[{ label:'Bắt Đầu', min:11, color:'green' },{ label:'Tiến Bộ', min:8,  color:'blue' },{ label:'Xuất Sắc', min:6,  color:'purple' }],
        maxDisplay: 15 },
    ],
  },
  {
    month: 3, week: 12, label: 'Tuần 12', color: 'purple',
    icon: '🎯', title: 'Kiểm Tra Tổng Kết 3 Tháng',
    desc: 'Đánh giá toàn diện sau 12 tuần — hỏi: "chu kỳ tiếp theo của mình là gì?"',
    tests: [
      { id:'plank',  name:'Plank Nâng Cao',               icon:'⏱', unit:'giây',
        how:'Plank thẳng liên tục — đếm đến khi không giữ được form',
        levels:[{ label:'Đạt Chuẩn', min:50, color:'green' },{ label:'Tốt', min:75, color:'blue' },{ label:'Elite', min:105, color:'purple' }],
        maxDisplay: 150 },
      { id:'pushup', name:'Push-up 1 Phút',               icon:'💪', unit:'lần',
        how:'Push-up liên tục trong 60 giây — nghỉ giữa được nhưng thời gian vẫn chạy',
        levels:[{ label:'Đạt Chuẩn', min:15, color:'green' },{ label:'Tốt', min:25, color:'blue' },{ label:'Elite', min:35, color:'purple' }],
        maxDisplay: 50 },
      { id:'run5k',  name:"Chạy 5km (hoặc đi bộ 12' test)", icon:'🏃', unit:'phút',
        how:"Chạy 5km bất kể thời gian. Nếu chưa chạy được: đi bộ nhanh 12 phút, đo quãng đường (mét)",
        lowerBetter: true,
        levels:[{ label:'Hoàn Thành', min:50, color:'green' },{ label:'Tốt', min:38, color:'blue' },{ label:'Elite', min:28, color:'purple' }],
        maxDisplay: 70 },
      { id:'resthr', name:'Nhịp Tim Nghỉ (Resting HR)',   icon:'❤', unit:'bpm',
        how:'Đo nhịp tim buổi sáng sớm khi vừa thức dậy — trước khi rời khỏi giường',
        lowerBetter: true,
        levels:[{ label:'Bắt Đầu', min:75, color:'green' },{ label:'Tốt', min:65, color:'blue' },{ label:'Athlete', min:55, color:'purple' }],
        maxDisplay: 100 },
    ],
  },
];

// ─── Scoring helpers ──────────────────────────────────────────────────────────
function scoreTest(test, value) {
  if (value === '' || value === null || value === undefined) return null;
  const v = parseFloat(value);
  if (isNaN(v)) return null;
  const [l0, l1, l2] = test.levels;
  if (test.lowerBetter) {
    if (v <= l2.min) return 2;
    if (v <= l1.min) return 1;
    if (v <= l0.min) return 0;
    return 0;
  } else {
    if (v >= l2.min) return 2;
    if (v >= l1.min) return 1;
    if (v >= l0.min) return 0;
    return 0;
  }
}

function totalScore(tests, values) {
  return tests.reduce((sum, t) => {
    const s = scoreTest(t, values[t.id]);
    return sum + (s !== null ? s : 0);
  }, 0);
}

function allFilled(tests, values) {
  return tests.every(t => values[t.id] !== '' && values[t.id] !== undefined);
}

const GRADES = [
  { min: 7, grade: 'A', label: 'Xuất Sắc',         color: 'purple', note: 'Bạn đang vượt kỳ vọng — cơ thể thích nghi rất tốt. Sẵn sàng thử thách cấp độ tiếp theo.' },
  { min: 5, grade: 'B', label: 'Tiến Bộ Tốt',      color: 'blue',   note: 'Tiến bộ rõ rệt — tiếp tục theo hướng này thêm 4 tuần, bạn sẽ đạt ngưỡng xuất sắc.' },
  { min: 3, grade: 'C', label: 'Đang Xây Nền',      color: 'green',  note: 'Nền tảng đang hình thành. Đừng vội — consistency quan trọng hơn speed ở giai đoạn này.' },
  { min: 0, grade: 'D', label: 'Cần Thêm Nỗ Lực',  color: 'orange', note: 'Hãy xem lại recovery, sleep và nutrition. Tập nhiều không bằng tập đúng và ngủ đủ.' },
];

function getGrade(score) {
  return GRADES.find(g => score >= g.min) || GRADES[GRADES.length - 1];
}

// ─── Level bar (benchmark segments) ──────────────────────────────────────────
function LevelBar({ test, value }) {
  const scored = scoreTest(test, value);
  const colors = { green: '#22c55e', blue: '#3b82f6', purple: '#a855f7', orange: '#f97316' };

  return (
    <div className="mt-2">
      <div className="flex rounded-full overflow-hidden h-1.5 gap-px">
        {test.levels.map((lv, i) => {
          const active = scored !== null && scored >= i;
          const hex = colors[lv.color] || colors.green;
          return (
            <div
              key={i}
              className="flex-1 transition-all duration-300 rounded-full"
              style={{ background: active ? hex : 'rgba(255,255,255,0.08)' }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        {test.levels.map((lv, i) => {
          const active = scored !== null && scored >= i;
          return (
            <span
              key={i}
              className={`text-[9px] font-bold transition-colors ${active ? C[lv.color]?.text || 'text-green-400' : 'text-muted/40'}`}
            >
              {lv.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Radar chart (4-axis SVG diamond) ────────────────────────────────────────
function RadarChart({ tests, values, color }) {
  const size   = 180;
  const center = size / 2;
  const maxR   = center - 28;
  const gc     = C[color] || C.green;

  // 4 axes: top, right, bottom, left
  const axes = [
    { angle: -90 },
    { angle:   0 },
    { angle:  90 },
    { angle: 180 },
  ];

  const toXY = (angleDeg, r) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  // Grid levels at 33%, 66%, 100%
  const gridLevels = [0.33, 0.66, 1.0];

  // Build score points — score 0/1/2 → map to 0, 0.5, 1.0 of maxR
  const scorePoints = tests.map((t, i) => {
    const s = scoreTest(t, values[t.id]);
    const ratio = s !== null ? s / 2 : 0;
    return toXY(axes[i % 4].angle, ratio * maxR);
  });

  const polygonPoints = scorePoints.map(p => `${p.x},${p.y}`).join(' ');

  // Axis endpoint labels
  const labelOffset = maxR + 14;
  const axisLabels = tests.map((t, i) => {
    const pt = toXY(axes[i % 4].angle, labelOffset);
    return { ...pt, name: t.name, icon: t.icon };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Grid diamonds */}
      {gridLevels.map((frac, gi) => {
        const pts = axes.map(a => toXY(a.angle, frac * maxR));
        const d = pts.map((p, pi) => `${pi === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return (
          <path
            key={gi}
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {axes.map((a, i) => {
        const pt = toXY(a.angle, maxR);
        return (
          <line
            key={i}
            x1={center} y1={center}
            x2={pt.x}   y2={pt.y}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
          />
        );
      })}

      {/* Filled score polygon */}
      {scorePoints.length === 4 && (
        <polygon
          points={polygonPoints}
          fill={gc.glow.replace('0.2', '0.35')}
          stroke={gc.hex}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}

      {/* Score dots */}
      {scorePoints.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x} cy={pt.y}
          r="3"
          fill={gc.hex}
          stroke="#111"
          strokeWidth="1.5"
        />
      ))}

      {/* Center dot */}
      <circle cx={center} cy={center} r="2.5" fill="rgba(255,255,255,0.15)" />

      {/* Axis labels */}
      {axisLabels.map((lbl, i) => {
        const angle = axes[i % 4].angle;
        let anchor = 'middle';
        if (angle === 0)   anchor = 'start';
        if (angle === 180) anchor = 'end';
        return (
          <text
            key={i}
            x={lbl.x}
            y={lbl.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="9"
            fill="rgba(255,255,255,0.45)"
            fontFamily="'Be Vietnam Pro', sans-serif"
          >
            {lbl.icon}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Test card ────────────────────────────────────────────────────────────────
function TestCard({ test, inputKey, value, onChange, submitted, tabColor }) {
  const [localVal, setLocalVal] = useState(value || '');
  const [confirmed, setConfirmed] = useState(submitted);
  const tc = C[tabColor] || C.green;
  const sc  = scoreTest(test, localVal);
  const levelColors = { green: C.green, blue: C.blue, purple: C.purple, orange: C.orange };

  const handleSubmit = () => {
    if (localVal === '') return;
    onChange(localVal);
    setConfirmed(true);
  };

  const handleReset = () => {
    setConfirmed(false);
    setLocalVal('');
    onChange('');
  };

  return (
    <div className={`
      relative overflow-hidden rounded-xl border transition-all duration-200
      ${confirmed && sc !== null
        ? `${tc.bg} ${tc.border}`
        : 'bg-surface border-border hover:border-white/16'
      }
    `}
      style={confirmed && sc !== null ? { boxShadow: `0 4px 20px ${tc.glow}` } : {}}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-2 mb-3">
          <span className="text-2xl leading-none mt-0.5">{test.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-black text-base text-text leading-tight">{test.name}</p>
            <p className="text-[10px] text-muted mt-0.5 leading-relaxed">{test.how}</p>
          </div>
          {confirmed && sc !== null && (
            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black border ${tc.border} ${tc.bg} ${tc.text}`}>
              {sc === 2 ? '2' : sc === 1 ? '1' : '0'}
            </div>
          )}
        </div>

        {/* Benchmark bar */}
        <LevelBar test={test} value={confirmed ? localVal : ''} />

        {/* Input row */}
        <div className="mt-3 flex items-center gap-2">
          {!confirmed ? (
            <>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  value={localVal}
                  onChange={e => setLocalVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="0"
                  className="w-full bg-white/4 border border-white/10 rounded-lg px-3 py-1.5 text-base text-text font-bold placeholder:text-muted/40 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <span className="text-[10px] text-muted shrink-0">{test.unit}</span>
              <button
                onClick={handleSubmit}
                disabled={localVal === ''}
                className={`
                  shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer
                  transition-all duration-200 border
                  ${localVal !== ''
                    ? `${tc.bg} ${tc.border} ${tc.text} hover:opacity-80`
                    : 'bg-white/4 border-white/8 text-muted/40 cursor-not-allowed'
                  }
                `}
              >
                OK
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              {/* Score chip */}
              {sc !== null && (() => {
                const lv = test.levels[Math.min(sc, test.levels.length - 1)];
                const lc = levelColors[lv.color] || C.green;
                return (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lc.border} ${lc.bg} ${lc.text}`}>
                    {lv.label}
                  </span>
                );
              })()}
              <span className="text-sm font-black text-text">{localVal} <span className="text-muted font-normal text-[10px]">{test.unit}</span></span>
              <button
                onClick={handleReset}
                className="ml-auto text-[10px] text-muted/50 hover:text-muted cursor-pointer transition-colors"
              >
                Sửa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MonthlyProgressCheck() {
  const [activeMonth, setActiveMonth] = useState(0);
  // inputs keyed by `m{monthIdx}_{testId}` e.g. 'm0_plank'
  const [inputs, setInputs]           = useState({});
  // submitted per-month
  const [submitted, setSubmitted]     = useState({});

  const monthData = TEST_DATA[activeMonth];
  const mc = C[monthData.color] || C.green;

  const keyFor = (mIdx, testId) => `m${mIdx}_${testId}`;

  const getVal = (testId) => inputs[keyFor(activeMonth, testId)] || '';

  const handleChange = (testId, val) => {
    setInputs(prev => ({ ...prev, [keyFor(activeMonth, testId)]: val }));
  };

  const handleSubmitAll = () => {
    setSubmitted(prev => ({ ...prev, [activeMonth]: true }));
  };

  const isMonthSubmitted = !!submitted[activeMonth];

  // Gather current values for scoring
  const currentValues = Object.fromEntries(
    monthData.tests.map(t => [t.id, getVal(t.id)])
  );

  const hasAnyInput = monthData.tests.some(t => getVal(t.id) !== '');
  const hasAllInput = allFilled(monthData.tests, currentValues);

  const total = totalScore(monthData.tests, currentValues);
  const grade = getGrade(total);
  const maxPossible = monthData.tests.length * 2;

  // Radar scores array for chart
  const radarScores = monthData.tests.map(t => ({
    name: t.name,
    icon: t.icon,
    score: scoreTest(t, getVal(t.id)) || 0,
  }));

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-black text-text mb-1.5 flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{ background: mc.glow, border: `1px solid ${mc.hex}40` }}
          >
            📊
          </span>
          Kiểm Tra Tiến Bộ Hàng Tháng
        </h2>
        <p className="text-muted text-base">Đo kết quả thực tế — không phỏng đoán, không so sánh người khác</p>
      </div>

      {/* Month tab selector */}
      <div className="flex gap-2 mb-6">
        {TEST_DATA.map((td, idx) => {
          const tc = C[td.color] || C.green;
          const active = activeMonth === idx;
          return (
            <button
              key={td.week}
              onClick={() => setActiveMonth(idx)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-xl text-base font-bold
                border transition-all duration-200 cursor-pointer
                ${active
                  ? `${tc.bg} ${tc.border} ${tc.text}`
                  : 'bg-white/4 border-white/8 text-muted hover:border-white/16 hover:text-text'
                }
              `}
              style={active ? { boxShadow: `0 0 20px ${tc.glow}` } : {}}
            >
              <span>{td.icon}</span>
              <span>{td.label}</span>
            </button>
          );
        })}
      </div>

      {/* Month title card */}
      <div
        className={`mb-5 rounded-xl border ${mc.border} ${mc.bg} px-4 py-3`}
        style={{ boxShadow: `0 2px 20px ${mc.glow}` }}
      >
        <p className={`font-black text-base ${mc.text}`}>{monthData.title}</p>
        <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{monthData.desc}</p>
      </div>

      {/* 2×2 test grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {monthData.tests.map((test) => (
          <TestCard
            key={`${activeMonth}_${test.id}`}
            test={test}
            inputKey={keyFor(activeMonth, test.id)}
            value={getVal(test.id)}
            onChange={(val) => handleChange(test.id, val)}
            submitted={isMonthSubmitted}
            tabColor={monthData.color}
          />
        ))}
      </div>

      {/* Submit button */}
      {!isMonthSubmitted && hasAllInput && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSubmitAll}
            className={`
              px-6 py-2.5 rounded-xl font-bold text-base cursor-pointer
              border transition-all duration-200 animate-fade-in-up
              ${mc.bg} ${mc.border} ${mc.text} hover:opacity-80
            `}
            style={{ boxShadow: `0 4px 24px ${mc.glow}` }}
          >
            Xem kết quả đánh giá
          </button>
        </div>
      )}

      {/* Results panel: radar + grade */}
      {hasAnyInput && (
        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-5 animate-fade-in-up"
          style={{ boxShadow: `0 8px 40px ${mc.glow}` }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Radar chart */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Radar tiến bộ</p>
              <RadarChart
                tests={monthData.tests}
                values={currentValues}
                color={monthData.color}
              />
              {/* Axis legend below chart */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                {monthData.tests.map(t => (
                  <div key={t.id} className="flex items-center gap-1">
                    <span className="text-[10px]">{t.icon}</span>
                    <span className="text-[9px] text-muted truncate">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade + coach note */}
            <div className="flex-1 min-w-0">
              {/* Score display */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border ${C[grade.color]?.border || 'border-green-500/30'} ${C[grade.color]?.bg || 'bg-green-500/10'}`}
                  style={{ boxShadow: `0 4px 24px ${C[grade.color]?.glow || 'rgba(34,197,94,0.2)'}` }}
                >
                  <span className={`text-3xl font-black leading-none ${C[grade.color]?.text || 'text-green-400'}`}>
                    {grade.grade}
                  </span>
                  <span className="text-[9px] text-muted mt-0.5">{total}/{maxPossible}</span>
                </div>
                <div>
                  <p className={`font-black text-lg ${C[grade.color]?.text || 'text-green-400'}`}>
                    {grade.label}
                  </p>
                  <p className="text-[10px] text-muted">{monthData.title} · {monthData.label}</p>
                </div>
              </div>

              {/* Individual test scores */}
              <div className="space-y-1.5 mb-4">
                {monthData.tests.map(t => {
                  const s = scoreTest(t, getVal(t.id));
                  const lv = s !== null ? t.levels[Math.min(s, t.levels.length - 1)] : null;
                  const tc = lv ? (C[lv.color] || C.green) : null;
                  return (
                    <div key={t.id} className="flex items-center gap-2">
                      <span className="text-base w-5 text-center">{t.icon}</span>
                      <span className="text-[11px] text-text/70 flex-1 truncate">{t.name}</span>
                      {s !== null && lv && tc ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tc.border} ${tc.bg} ${tc.text}`}>
                          {lv.label}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted/40">Chưa nhập</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Coach note callout */}
              <div className={`rounded-xl border ${C[grade.color]?.border || 'border-green-500/30'} ${C[grade.color]?.bg || 'bg-green-500/10'} p-3`}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C[grade.color]?.hex || '#22c55e' }}>
                  Nhận xét huấn luyện viên
                </p>
                <p className="text-sm text-text/80 leading-relaxed">{grade.note}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
