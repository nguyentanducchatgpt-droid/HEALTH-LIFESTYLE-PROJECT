import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DailyChecklist() {
  const { t } = useTranslation('pillars');
  const items = t('pillarF.checklist_items', { returnObjects: true });
  const [checked, setChecked] = useState(() =>
    Array.isArray(items) ? new Array(items.length).fill(false) : []
  );

  if (!Array.isArray(items)) return null;

  const toggle = (i) => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  const doneCount = checked.filter(Boolean).length;

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-accent text-lg">
          {(() => {
            const sections = t('pillarF.sections', { returnObjects: true });
            return Array.isArray(sections) && sections[0] ? sections[0].title : 'Daily Checklist';
          })()}
        </h2>
        <span className="text-base text-muted bg-border px-2 py-1 rounded-full">
          {doneCount}/{items.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-border rounded-full h-1.5 mb-5">
        <div
          className="bg-accent h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(i)}
              className={`w-full flex items-center gap-3 text-left text-lg transition-colors group ${
                checked[i] ? 'text-muted line-through' : 'text-text'
              }`}
            >
              <span
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  checked[i]
                    ? 'bg-accent border-accent text-bg'
                    : 'border-border group-hover:border-accent'
                }`}
              >
                {checked[i] && <span className="text-base font-bold">✓</span>}
              </span>
              <span className="leading-snug">{item}</span>
            </button>
          </li>
        ))}
      </ul>

      {doneCount === items.length && (
        <p className="mt-5 text-center text-accent text-lg font-medium">
          🎉 {doneCount}/{items.length} ✓
        </p>
      )}
    </div>
  );
}
