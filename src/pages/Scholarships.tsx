import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { GraduationCap, Award, Calendar, CheckCircle } from 'lucide-react';

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: number;
  deadline: string;
  major: string;
  tag: string;
}

const scholarshipList: Scholarship[] = [
  {
    id: '1',
    name: 'Future Innovators in STEM Grant',
    provider: 'Tech Education Foundation',
    amount: 2500,
    deadline: 'Jan 15, 2027',
    major: 'Computer Science, Engineering, Math',
    tag: 'High Match',
  },
  {
    id: '2',
    name: 'First-Generation College Student Award',
    provider: 'National Opportunity Fund',
    amount: 1500,
    deadline: 'Feb 1, 2027',
    major: 'All Majors',
    tag: 'Need-Based',
  },
  {
    id: '3',
    name: 'Campus Community Leadership Scholarship',
    provider: 'Alumni Association',
    amount: 1000,
    deadline: 'Dec 15, 2026',
    major: 'Undergraduate Students',
    tag: 'Merit-Based',
  },
  {
    id: '4',
    name: 'Women in Technology & Sciences Fellowship',
    provider: 'Grace Hopper Alliance',
    amount: 3000,
    deadline: 'March 1, 2027',
    major: 'STEM & Data Science',
    tag: 'Fellowship',
  },
];

export const Scholarships: React.FC = () => {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const toggleApply = (id: string) => {
    setAppliedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          Scholarships & Grants
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
            4 Matches
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Curated opportunities to reduce student debt and tuition costs
        </p>
      </div>

      <div className="space-y-3">
        {scholarshipList.map((scholarship) => {
          const isApplied = appliedIds.includes(scholarship.id);

          return (
            <div
              key={scholarship.id}
              className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {scholarship.tag}
                  </span>
                  <h3 className="text-xs font-bold text-white mt-1.5">{scholarship.name}</h3>
                  <p className="text-[11px] text-slate-400">{scholarship.provider}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-400">
                    {formatCurrency(scholarship.amount)}
                  </span>
                  <p className="text-[10px] text-slate-400">Award</p>
                </div>
              </div>

              <div className="pt-1 flex flex-col gap-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{scholarship.major}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Deadline: {scholarship.deadline}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between">
                <button
                  onClick={() => toggleApply(scholarship.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition ${
                    isApplied
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Saved / Applied</span>
                    </>
                  ) : (
                    <span>Apply / Save</span>
                  )}
                </button>

                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  Verified <Award className="w-3 h-3 text-amber-400" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scholarships;
