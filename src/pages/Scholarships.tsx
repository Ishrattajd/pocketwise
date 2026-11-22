import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../hooks/useCurrency';
import { useExpenses, UserScholarshipItem } from '../hooks/useExpenses';
import { checkScholarshipEligibility } from '../services/gemini';
import { calculateDaysLeft } from '../utils/formatters';
import { ScholarshipSchema } from '../utils/schemas';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Plus,
  Sparkles,
  ExternalLink,
  Clock,
  X,
} from 'lucide-react';

interface CuratedScholarship {
  id: string;
  name: string;
  provider: string;
  amount: number;
  deadline: string;
  major: string;
  tag: string;
  link: string;
}

const defaultCurated: CuratedScholarship[] = [
  {
    id: 'c1',
    name: 'NSP - Central Sector Scheme for College Students',
    provider: 'Ministry of Education, Govt. of India',
    amount: 20000,
    deadline: '2026-12-05',
    major: 'All Undergraduate Degrees',
    tag: 'National Portal',
    link: 'https://scholarships.gov.in',
  },
  {
    id: 'c2',
    name: 'State Post-Matric Merit Scholarship',
    provider: 'State Department of Higher Education',
    amount: 15000,
    deadline: '2026-11-28',
    major: 'Degree & Diploma Courses',
    tag: 'State Merit',
    link: 'https://scholarships.gov.in',
  },
  {
    id: 'c3',
    name: 'AICTE Pragati Scholarship for Girls',
    provider: 'All India Council for Technical Education',
    amount: 50000,
    deadline: '2026-12-31',
    major: 'B.Tech / Engineering & Tech',
    tag: 'Technical Grant',
    link: 'https://www.aicte-india.org',
  },
  {
    id: 'c4',
    name: 'Foundation for Academic Excellence (FAEA) Grant',
    provider: 'FAEA India & Corporate CSR',
    amount: 30000,
    deadline: '2027-06-30',
    major: 'Arts, Science & Commerce',
    tag: 'Need-Based',
    link: 'http://www.faeaindia.org',
  },
];

export const Scholarships: React.FC = () => {
  const { user } = useAuth();
  const { format, symbol } = useCurrency();
  const { customScholarships, addScholarship } = useExpenses();

  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  // Add Scholarship Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [link, setLink] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Eligibility Advisor Modal
  const [advisorScholarship, setAdvisorScholarship] = useState<string | null>(null);
  const [profileText, setProfileText] = useState(
    '2nd year B.Tech Computer Science student with 78% marks and family income under ₹6 LPA'
  );
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorResult, setAdvisorResult] = useState<string | null>(null);

  const toggleApply = (id: string) => {
    setAppliedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = ScholarshipSchema.safeParse({
      name: name.trim(),
      amount: parseFloat(amount),
      deadline: deadline.trim(),
      link: link.trim(),
      provider: 'Student Submission',
      tag: 'My Scholarship',
    });

    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Invalid details');
      return;
    }

    try {
      await addScholarship(validation.data);
      setName('');
      setAmount('');
      setDeadline('');
      setLink('');
      setShowAddModal(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleCheckEligibility = async (scholarshipName: string) => {
    setAdvisorScholarship(scholarshipName);
    setAdvisorLoading(true);
    setAdvisorResult(null);

    try {
      const response = await checkScholarshipEligibility(
        scholarshipName,
        profileText,
        user?.isDemo
      );
      setAdvisorResult(response);
    } catch {
      setAdvisorResult(
        'Eligibility criteria typically require active university enrolment and prior degree marksheets. Check the official portal.'
      );
    } finally {
      setAdvisorLoading(false);
    }
  };

  // Combine and sort by deadline date
  const allScholarships = [
    ...defaultCurated,
    ...customScholarships.map((s: UserScholarshipItem) => ({
      id: s.id,
      name: s.name,
      provider: s.provider,
      amount: s.amount,
      deadline: s.deadline,
      major: 'Student Custom Scholarship',
      tag: s.tag,
      link: s.link,
    })),
  ].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1E293B] flex items-center gap-2">
            Scholarships & Grants
            <span className="text-[10px] bg-teal-50 text-[#0F766E] border border-[#0F766E]/20 px-2.5 py-0.5 rounded-full font-semibold">
              {allScholarships.length} Available
            </span>
          </h2>
          <p className="text-xs text-[#64748B]">Sorted by deadline with instant AI eligibility check</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="min-h-[44px] flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom</span>
        </button>
      </div>

      {/* Scholarship Cards List */}
      <div className="space-y-3">
        {allScholarships.map((scholarship) => {
          const isApplied = appliedIds.includes(scholarship.id);
          const daysLeft = calculateDaysLeft(scholarship.deadline);
          const isUrgent = daysLeft >= 0 && daysLeft < 7;

          return (
            <div
              key={scholarship.id}
              className="p-4 bg-white border border-[#E5E0D8] rounded-3xl space-y-3 shadow-sm hover:border-[#0F766E]/40 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      {scholarship.tag}
                    </span>
                    {/* Days Left Badge (Coral only when under 7 days) */}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        isUrgent
                          ? 'bg-red-50 text-[#F87171] border-red-200 animate-pulse'
                          : 'bg-[#FAF7F2] text-[#64748B] border-[#E5E0D8]'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {daysLeft < 0
                        ? 'Passed'
                        : daysLeft === 0
                        ? 'Today!'
                        : `${daysLeft} days left`}
                    </span>
                  </div>
                  <h3 className="font-heading text-xs font-bold text-[#1E293B] mt-1.5">
                    {scholarship.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">{scholarship.provider}</p>
                </div>
                <div className="text-right">
                  <span className="font-heading text-sm font-extrabold text-[#0F766E]">
                    {format(scholarship.amount)}
                  </span>
                  <p className="text-[10px] text-[#64748B]">Award</p>
                </div>
              </div>

              <div className="pt-1 flex flex-col gap-1 text-[11px] text-[#1E293B]">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                  <span className="truncate">{scholarship.major}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span>Deadline: {scholarship.deadline}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleApply(scholarship.id)}
                    className={`min-h-[44px] flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition ${
                      isApplied
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#0F766E] hover:bg-[#115E59] text-white shadow-sm'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <span>Save</span>
                    )}
                  </button>

                  <button
                    onClick={() => handleCheckEligibility(scholarship.name)}
                    className="min-h-[44px] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-[#0F766E]/20 text-xs font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Am I eligible?</span>
                  </button>
                </div>

                {scholarship.link && (
                  <a
                    href={scholarship.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#64748B] hover:text-[#0F766E] p-2"
                    aria-label={`Open link for ${scholarship.name}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Scholarship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-xl">
            <h3 className="font-heading text-sm font-bold text-[#1E293B] mb-3">
              Add Scholarship Opportunity
            </h3>

            {formError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-[#F87171]">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddScholarship} className="space-y-3">
              <div>
                <label htmlFor="scholarship-name" className="text-xs font-semibold text-[#1E293B]">
                  Scholarship / Scheme Name *
                </label>
                <input
                  id="scholarship-name"
                  type="text"
                  placeholder="e.g. State Merit Fellowship"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="scholarship-amount" className="text-xs font-semibold text-[#1E293B]">
                  Award Amount ({symbol}) *
                </label>
                <input
                  id="scholarship-amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="scholarship-deadline" className="text-xs font-semibold text-[#1E293B]">
                  Deadline Date *
                </label>
                <input
                  id="scholarship-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="scholarship-link" className="text-xs font-semibold text-[#1E293B]">
                  Portal / Application Link
                </label>
                <input
                  id="scholarship-link"
                  type="url"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="min-h-[44px] mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] flex-1 py-2.5 rounded-xl bg-[#FAF7F2] text-xs font-semibold text-[#64748B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] flex-1 py-2.5 rounded-xl bg-[#0F766E] text-xs font-semibold text-white shadow-sm hover:bg-[#115E59]"
                >
                  Save Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gemini AI Eligibility Advisor Modal */}
      {advisorScholarship && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F766E]" />
                <h3 className="font-heading text-sm font-bold text-[#1E293B]">Eligibility Advisor</h3>
              </div>
              <button
                onClick={() => setAdvisorScholarship(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#64748B]"
                aria-label="Close eligibility advisor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-semibold text-[#0F766E]">{advisorScholarship}</p>

            <div>
              <label htmlFor="student-profile-input" className="text-xs font-semibold text-[#1E293B]">
                Your Student Profile
              </label>
              <textarea
                id="student-profile-input"
                rows={2}
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                className="mt-1 w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl p-2.5 text-xs text-[#1E293B] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>

            <div aria-live="polite" className="p-3 bg-teal-50 border border-[#0F766E]/20 rounded-2xl min-h-[70px]">
              {advisorLoading ? (
                <p className="text-xs text-[#64748B] animate-pulse">Consulting Gemini on eligibility...</p>
              ) : (
                <p className="text-xs text-[#1E293B] leading-relaxed">{advisorResult}</p>
              )}
            </div>

            <button
              onClick={() => handleCheckEligibility(advisorScholarship)}
              disabled={advisorLoading}
              className="min-h-[44px] w-full py-2.5 rounded-xl bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] disabled:opacity-50"
            >
              Re-check with Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scholarships;
