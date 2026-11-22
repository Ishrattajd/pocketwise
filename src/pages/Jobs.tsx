import React, { useState } from 'react';
import { MapPin, Clock, CheckCircle } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  wage: string;
  hours: string;
  type: 'Work-Study' | 'On-Campus' | 'Flexible';
  location: string;
}

const jobList: Job[] = [
  {
    id: '1',
    title: 'Campus Library Technology Assistant',
    department: 'University Library System',
    wage: '$17.50 / hr',
    hours: '10-15 hrs/wk',
    type: 'Work-Study',
    location: 'Main Campus Library 2nd Fl',
  },
  {
    id: '2',
    title: 'Peer Math & Statistics Tutor',
    department: 'Academic Success Center',
    wage: '$19.00 / hr',
    hours: '8-12 hrs/wk',
    type: 'On-Campus',
    location: 'Student Union Hall',
  },
  {
    id: '3',
    title: 'Campus Coffee House Barista',
    department: 'Student Dining Services',
    wage: '$16.25 / hr + tips',
    hours: '12-20 hrs/wk',
    type: 'Flexible',
    location: 'Campus Center Cafe',
  },
  {
    id: '4',
    title: 'IT Help Desk Student Technician',
    department: 'Campus Information Technology',
    wage: '$18.00 / hr',
    hours: '15 hrs/wk',
    type: 'Work-Study',
    location: 'Science & Tech Bldg',
  },
];

export const Jobs: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const handleApply = (id: string) => {
    setAppliedJobs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          Campus & Student Jobs
          <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full font-semibold">
            Work-Study Friendly
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Earn income with schedules designed around your college classes
        </p>
      </div>

      <div className="space-y-3">
        {jobList.map((job) => {
          const applied = appliedJobs.includes(job.id);

          return (
            <div
              key={job.id}
              className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                    {job.type}
                  </span>
                  <h3 className="text-xs font-bold text-white mt-1.5">{job.title}</h3>
                  <p className="text-[11px] text-slate-400">{job.department}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">{job.wage}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{job.hours}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between">
                <button
                  onClick={() => handleApply(job.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                    applied
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {applied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Application Sent</span>
                    </>
                  ) : (
                    <span>Apply for Job</span>
                  )}
                </button>

                <span className="text-[10px] text-slate-400">Class Schedule Matched</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Jobs;
