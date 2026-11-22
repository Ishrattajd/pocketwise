import React, { useState } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { useExpenses } from '../hooks/useExpenses';
import { MapPin, Clock, Bookmark, BookmarkCheck } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  rate: number;
  period: 'hr' | 'month';
  hours: string;
  type: 'Work-Study' | 'On-Campus' | 'Flexible' | 'Remote';
  location: string;
}

const staticJobList: Job[] = [
  {
    id: '1',
    title: 'Campus Library Catalog Assistant',
    department: 'Central University Library',
    rate: 250,
    period: 'hr',
    hours: '10 hrs/wk',
    type: 'Work-Study',
    location: 'Central Library 1st Floor',
  },
  {
    id: '2',
    title: 'Peer Coding & Math Tutor',
    department: 'Dept of Computer Science',
    rate: 350,
    period: 'hr',
    hours: '6-8 hrs/wk',
    type: 'On-Campus',
    location: 'Academic Block C',
  },
  {
    id: '3',
    title: 'Campus Tech Center Lab Proctor',
    department: 'University IT Services',
    rate: 200,
    period: 'hr',
    hours: '12 hrs/wk',
    type: 'Flexible',
    location: 'Computing Lab 3',
  },
  {
    id: '4',
    title: 'Digital Content & Social Media Intern',
    department: 'Student Affairs & Cultural Cell',
    rate: 5000,
    period: 'month',
    hours: '8 hrs/wk',
    type: 'Remote',
    location: 'Student Activity Centre',
  },
];

export const Jobs: React.FC = () => {
  const { format } = useCurrency();
  const { savedJobs, toggleSaveJob } = useExpenses();
  const [filterBookmarked, setFilterBookmarked] = useState(false);

  const displayedJobs = filterBookmarked
    ? staticJobList.filter((j) => savedJobs.includes(j.id))
    : staticJobList;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1E293B] flex items-center gap-2">
            Campus Gigs & Jobs
            <span className="text-[10px] bg-teal-50 text-[#0F766E] border border-[#0F766E]/20 px-2.5 py-0.5 rounded-full font-semibold">
              {staticJobList.length} Available
            </span>
          </h2>
          <p className="text-xs text-[#64748B]">Flexible hours designed around your lecture timetable</p>
        </div>
        <button
          onClick={() => setFilterBookmarked(!filterBookmarked)}
          className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
            filterBookmarked
              ? 'bg-[#0F766E] text-white border-[#0F766E]'
              : 'bg-white text-[#64748B] border-[#E5E0D8] hover:text-[#1E293B]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarked ({savedJobs.length})</span>
        </button>
      </div>

      <div className="space-y-3">
        {displayedJobs.map((job) => {
          const isSaved = savedJobs.includes(job.id);

          return (
            <div
              key={job.id}
              className="p-4 bg-white border border-[#E5E0D8] rounded-3xl space-y-3 shadow-sm hover:border-[#0F766E]/40 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    {job.type}
                  </span>
                  <h3 className="font-heading text-xs font-bold text-[#1E293B] mt-1.5">
                    {job.title}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">{job.department}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-heading text-xs font-extrabold text-[#0F766E]">
                    {format(job.rate)} / {job.period}
                  </span>
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    aria-label={isSaved ? `Remove bookmark for ${job.title}` : `Bookmark ${job.title}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-end text-[#64748B] hover:text-[#0F766E] mt-1 p-1"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-[#0F766E]" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-[#64748B]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-[11px] text-[#1E293B]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span>{job.hours}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#64748B]">Work-Study Approved</span>
                <span className="font-semibold text-[#0F766E]">Timetable Friendly</span>
              </div>
            </div>
          );
        })}

        {displayedJobs.length === 0 && (
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 text-center shadow-sm">
            <p className="text-xs font-bold text-[#1E293B]">No bookmarked jobs yet</p>
            <p className="text-[11px] text-[#64748B] mt-1">
              Tap the bookmark icon on any campus job to save it for later.
            </p>
            <button
              onClick={() => setFilterBookmarked(false)}
              className="mt-3 min-h-[44px] px-4 py-2 bg-[#0F766E] text-white text-xs font-semibold rounded-xl"
            >
              View All Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
