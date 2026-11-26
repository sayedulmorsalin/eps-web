'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, ShieldCheck, Mail, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface LegalSection {
  titleEn: string;
  titleBn: string;
  paragraphsEn: string[];
  paragraphsBn: string[];
  bulletsEn?: string[];
  bulletsBn?: string[];
}

interface LegalDocumentPageProps {
  badgeEn: string;
  badgeBn: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  lastUpdatedEn: string;
  lastUpdatedBn: string;
  sections: LegalSection[];
  companionHref: string;
  companionLabelEn: string;
  companionLabelBn: string;
}

export const LegalDocumentPage: React.FC<LegalDocumentPageProps> = ({
  badgeEn,
  badgeBn,
  titleEn,
  titleBn,
  subtitleEn,
  subtitleBn,
  lastUpdatedEn,
  lastUpdatedBn,
  sections,
  companionHref,
  companionLabelEn,
  companionLabelBn,
}) => {
  const { language, setLanguage } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-5 sm:space-y-6">
      {/* Top navigation & language switcher */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#F48721] transition py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
        </Link>

        <button
          type="button"
          onClick={() => setLanguage(isBn ? 'en' : 'bn')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-[#F48721] text-xs font-bold text-gray-800 transition shadow-2xs"
        >
          <Globe className="w-3.5 h-3.5 text-[#F48721]" />
          <span>{isBn ? 'Read in English' : 'বাংলায় পড়ুন'}</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <header className="bg-gradient-to-br from-[#221E1F] to-[#342D2F] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg border border-neutral-800 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F48721]/20 text-[#F48721] text-[11px] font-extrabold border border-[#F48721]/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isBn ? badgeBn : badgeEn}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          {isBn ? titleBn : titleEn}
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          {isBn ? subtitleBn : subtitleEn}
        </p>
        <p className="text-[11px] text-gray-400 font-semibold pt-1">
          {isBn ? lastUpdatedBn : lastUpdatedEn}
        </p>
      </header>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, idx) => {
          const title = isBn ? section.titleBn : section.titleEn;
          const paragraphs = isBn ? section.paragraphsBn : section.paragraphsEn;
          const bullets = isBn ? section.bulletsBn : section.bulletsEn;

          return (
            <section
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-2xs space-y-2.5"
            >
              <h2 className="text-sm sm:text-base font-black text-[#221E1F]">
                {title}
              </h2>
              {paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-xs sm:text-sm text-gray-700 leading-relaxed"
                >
                  {p}
                </p>
              ))}
              {bullets && bullets.length > 0 && (
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-700 leading-relaxed pt-1">
                  {bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Contact & Cross-Link Footer Box */}
      <div className="bg-[#FFF7ED] border border-[#F48721]/30 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-sm font-black text-[#221E1F]">
            {isBn ? 'যোগাযোগ ও সহায়তা' : 'Contact & Data Support'}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-700 font-semibold">
            <a
              href="mailto:support@epsr.com"
              className="inline-flex items-center gap-1.5 hover:text-[#F48721]"
            >
              <Mail className="w-3.5 h-3.5 text-[#F48721]" />
              <span>support@epsr.com</span>
            </a>
            <a
              href="tel:+8801700000000"
              className="inline-flex items-center gap-1.5 hover:text-[#F48721]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#F48721]" />
              <span>+880 1700-000000</span>
            </a>
          </div>
        </div>

        <Link
          href={companionHref}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[#221E1F] hover:bg-black text-white text-xs font-bold rounded-xl transition shrink-0"
        >
          {isBn ? companionLabelBn : companionLabelEn}
        </Link>
      </div>
    </div>
  );
};
