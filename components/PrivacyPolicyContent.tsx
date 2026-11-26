'use client';

import React from 'react';
import { LegalDocumentPage, LegalSection } from '../components/LegalDocumentPage';

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    titleEn: '1. Overview & Data Controller',
    titleBn: '১. পরিচিতি ও তথ্য নিয়ন্ত্রণকারী',
    paragraphsEn: [
      'EPSR (Easy Product Service Rajshahi) operates the EPSR mobile application and online grocery storefront. This Privacy Policy explains how we collect, use, store, and protect information when you browse groceries, create an account, or place Cash-on-Delivery (COD) orders through our mobile app or website.',
    ],
    paragraphsBn: [
      'EPSR (Easy Product Service Rajshahi) এই মোবাইল অ্যাপ্লিকেশন ও অনলাইন গ্রোসারি ওয়েবসাইট পরিচালনা করে। আপনি যখন আমাদের অ্যাপ বা ওয়েবসাইটে গ্রোসারি ব্রাউজ করেন, অ্যাকাউন্ট খোলেন বা ক্যাশ অন ডেলিভারি (COD) অর্ডার দেন, তখন আপনার তথ্য কীভাবে সংগৃহীত, ব্যবহৃত ও সুরক্ষিত হয় তা এই নীতিমালায় বর্ণিত হয়েছে।',
    ],
  },
  {
    titleEn: '2. Information We Collect',
    titleBn: '২. আমরা যে তথ্য সংগ্রহ করি',
    paragraphsEn: [
      'You can browse our grocery catalog as a guest without creating an account. When you register, sign in, or place an order, we collect only the information needed to fulfill your grocery delivery:',
    ],
    paragraphsBn: [
      'আপনি অ্যাকাউন্ট না খুলেও গেস্ট হিসেবে আমাদের পণ্য দেখতে পারেন। নিবন্ধন বা অর্ডার করার সময় ডেলিভারি সম্পন্ন করতে আমরা কেবল প্রয়োজনীয় তথ্য সংগ্রহ করি:',
    ],
    bulletsEn: [
      'Account & Contact Details: Full name, email address, Bangladesh mobile phone number, and preferred language setting.',
      'Delivery & Order Details: Delivery street address, order items, quantities, order notes, promo code usage, and order status updates.',
      'App Usage & Diagnostics: Anonymous visitor/session identifiers, screen/product views, search keywords, cart events, platform type (Android, iOS, Web), and local cache preferences stored on your device.',
      'Payment Information: EPSR currently uses Cash on Delivery (COD). We do not collect or store credit card, debit card, or mobile-banking PINs inside the app.',
    ],
    bulletsBn: [
      'অ্যাকাউন্ট ও যোগাযোগ তথ্য: পূর্ণ নাম, ইমেইল ঠিকানা, বাংলাদেশি ফোন নম্বর এবং পছন্দের ভাষা।',
      'ডেলিভারি ও অর্ডার তথ্য: সম্পূর্ণ ডেলিভারি ঠিকানা, পণ্যের তালিকা ও পরিমাণ, ডেলিভারি নির্দেশনা, প্রমো কোড ও অর্ডার স্ট্যাটাস।',
      'অ্যাপ ব্যবহারের তথ্য: বেনামী ভিজিটর/সেশন আইডি, পণ্য ভিউ, সার্চ শব্দ, কার্ট ইভেন্ট, প্ল্যাটফর্মের ধরন (Android, iOS, Web) এবং ডিভাইসে সংরক্ষিত ভাষা ও ইমেজ ক্যাশ।',
      'পেমেন্ট তথ্য: EPSR বর্তমানে ক্যাশ অন ডেলিভারি (COD) পদ্ধতিতে পরিচালিত হয়। অ্যাপে কোনো কার্ড বা মোবাইল ব্যাংকিং পিন সংরক্ষণ করা হয় না।',
    ],
  },
  {
    titleEn: '3. Device Permissions',
    titleBn: '৩. ডিভাইস অনুমতি (Permissions)',
    paragraphsEn: [
      'The EPSR customer Android app requests only standard Internet access (android.permission.INTERNET) to load product listings, submit orders, and fetch live order status updates. We do not access your camera, microphone, contacts, SMS, or background GPS location.',
    ],
    paragraphsBn: [
      'EPSR গ্রাহক অ্যান্ড্রয়েড অ্যাপ কেবল পণ্যের তথ্য লোড করা, অর্ডার পাঠানো এবং লাইভ অর্ডার স্ট্যাটাস দেখার জন্য ইন্টারনেট অনুমতি (INTERNET) ব্যবহার করে। অ্যাপটি আপনার ক্যামেরা, মাইক্রোফোন, কন্টাক্টস, এসএমএস বা ব্যাকগ্রাউন্ড লোকেশন সংগ্রহ করে না।',
    ],
  },
  {
    titleEn: '4. How We Use Information',
    titleBn: '৪. তথ্য ব্যবহারের উদ্দেশ্য',
    paragraphsEn: ['We use collected information strictly to:'],
    paragraphsBn: ['সংগৃহীত তথ্য কেবল নিচের উদ্দেশ্যে ব্যবহৃত হয়:'],
    bulletsEn: [
      'Process, pack, dispatch, and deliver your grocery orders in Rajshahi.',
      'Contact you via phone or email regarding order confirmation, delivery coordination, or customer support.',
      'Display live order tracking status and optional external Google Maps route directions.',
      'Improve product availability, search accuracy, app speed, and service reliability.',
    ],
    bulletsBn: [
      'রাজশাহীতে আপনার গ্রোসারি অর্ডার প্রক্রিয়াকরণ, প্যাকিং ও হোম ডেলিভারি সম্পন্ন করা।',
      'অর্ডার নিশ্চিতকরণ, রাইডার সমন্বয় বা কাস্টমার সাপোর্টের জন্য ফোন বা ইমেইলে যোগাযোগ করা।',
      'লাইভ অর্ডার স্ট্যাটাস ও গুগল ম্যাপস রুটের তথ্য প্রদর্শন করা।',
      'পণ্যের প্রাপ্যতা, সার্চ ফলাফল এবং অ্যাপের গতি ও মান উন্নত করা।',
    ],
  },
  {
    titleEn: '5. Data Sharing & Third-Party Services',
    titleBn: '৫. তথ্য শেয়ারিং ও তৃতীয় পক্ষের সেবা',
    paragraphsEn: [
      'We never sell, rent, or trade your personal information to third-party advertisers or data brokers.',
    ],
    paragraphsBn: [
      'আমরা কখনোই আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের বিজ্ঞাপনদাতা বা ডেটা ব্রোকারের কাছে বিক্রি বা ভাড়া দিই না।',
    ],
    bulletsEn: [
      'Delivery Partners: Assigned EPSR delivery riders receive your delivery address, name, and phone number solely to complete delivery.',
      'Infrastructure & Maps: Account, catalog, and order records are stored on our secured Supabase backend over encrypted HTTPS/TLS connections. Choosing "Open in Google Maps" launches Google Maps externally.',
    ],
    bulletsBn: [
      'ডেলিভারি পার্টনার: নির্ধারিত ডেলিভারি রাইডার কেবল পণ্য পৌঁছে দেওয়ার জন্য আপনার নাম, ঠিকানা ও ফোন নম্বর দেখতে পান।',
      'সার্ভার ও ম্যাপস: অ্যাকাউন্ট ও অর্ডার তথ্য এনক্রিপ্টেড HTTPS সংযোগের মাধ্যমে আমাদের Supabase সার্ভারে সংরক্ষিত থাকে। ম্যাপ বাটনে ট্যাপ করলে বাহ্যিক Google Maps অ্যাপ/সাইট খোলে।',
    ],
  },
  {
    titleEn: '6. Data Security & Retention',
    titleBn: '৬. তথ্য সুরক্ষা ও সংরক্ষণকাল',
    paragraphsEn: [
      'All network communications between the EPSR app, website, and backend use HTTPS/TLS encryption, and database tables are protected by Role-Based Row-Level Security (RLS). We retain account and order data only as long as your account remains active or as required for accounting and legal compliance.',
    ],
    paragraphsBn: [
      'অ্যাপ, ওয়েবসাইট ও সার্ভারের সকল যোগাযোগ HTTPS/TLS এনক্রিপশনের মাধ্যমে সুরক্ষিত এবং ডাটাবেজে Row-Level Security (RLS) নীতি প্রয়োগ করা আছে। আপনার অ্যাকাউন্ট সক্রিয় থাকা পর্যন্ত অথবা আইনি ও হিসাবরক্ষণের প্রয়োজনে তথ্য সংরক্ষণ করা হয়।',
    ],
  },
  {
    titleEn: '7. Account & Data Deletion (Google Play Data Safety)',
    titleBn: '৭. অ্যাকাউন্ট ও ডেটা মুছে ফেলার অধিকার',
    paragraphsEn: [
      'You may request permanent deletion of your EPSR account and associated personal profile data at any time:',
    ],
    paragraphsBn: [
      'আপনি যেকোনো সময় আপনার EPSR অ্যাকাউন্ট ও ব্যক্তিগত তথ্য স্থায়ীভাবে মুছে ফেলার অনুরোধ করতে পারেন:',
    ],
    bulletsEn: [
      'Send an email to support@epsr.com with subject "Account Deletion Request" from your registered email address, or call our support hotline (+880 1700-000000).',
      'Upon verification, we will delete your profile, saved addresses, and personal identifiers within 7 business days, except minimal transaction records strictly required by applicable tax or regulatory law.',
      'To clear locally stored preferences or cached thumbnails on your device, you can log out, clear app storage, or uninstall the EPSR app.',
    ],
    bulletsBn: [
      'আপনার নিবন্ধিত ইমেইল থেকে support@epsr.com-এ "Account Deletion Request" লিখে পাঠান অথবা হটলাইনে (+880 1700-000000) কল করুন।',
      'যাচাইকরণের পর ৭ কার্যদিবসের মধ্যে আপনার প্রোফাইল, সংরক্ষিত ঠিকানা ও ব্যক্তিগত তথ্য মুছে ফেলা হবে (আইনগতভাবে সংরক্ষণযোগ্য ন্যূনতম হিসাব তথ্য ব্যতীত)।',
      'ডিভাইসে সংরক্ষিত লোকাল তথ্য মুছতে লগআউট করুন অথবা অ্যাপের স্টোরেজ ক্লিয়ার/আনইনস্টল করুন।',
    ],
  },
  {
    titleEn: '8. Children’s Privacy & Policy Changes',
    titleBn: '৮. শিশুদের গোপনীয়তা ও নীতিমালা পরিবর্তন',
    paragraphsEn: [
      'EPSR is intended for users aged 18 and above (or under parental supervision) placing household grocery orders. We do not knowingly collect personal information from children under 13. Any updates to this Privacy Policy will be published on this page with an updated effective date.',
    ],
    paragraphsBn: [
      'EPSR মূলত ১৮ বছর বা তদূর্ধ্ব ব্যবহারকারীদের (অথবা অভিভাবকের তত্ত্বাবধানে) ঘরোয়া গ্রোসারি অর্ডারের জন্য তৈরি। আমরা জেনেশুনে ১৩ বছরের কম বয়সী শিশুদের কোনো তথ্য সংগ্রহ করি না। নীতিমালায় কোনো পরিবর্তন এলে নতুন তারিখসহ এই পৃষ্ঠায় প্রকাশ করা হবে।',
    ],
  },
];

export const PrivacyPolicyContent = () => (
  <LegalDocumentPage
    badgeEn="Google Play Store Compliant • Privacy Policy"
    badgeBn="গুগল প্লে স্টোর কমপ্লায়েন্ট • গোপনীয়তা নীতি"
    titleEn="Privacy Policy — EPSR"
    titleBn="গোপনীয়তা নীতিমালা (Privacy Policy) — EPSR"
    subtitleEn="How EPSR (Easy Product Service Rajshahi) collects, uses, safeguards, and deletes user data across our Android app and web store."
    subtitleBn="EPSR (Easy Product Service Rajshahi) অ্যান্ড্রয়েড অ্যাপ ও ওয়েবসাইটে আপনার ব্যক্তিগত তথ্য কীভাবে সংগৃহীত, ব্যবহৃত ও সুরক্ষিত হয়।"
    lastUpdatedEn="Effective Date: November 25, 2026 • Jurisdiction: Rajshahi, Bangladesh"
    lastUpdatedBn="কার্যকর তারিখ: ২৫ নভেম্বর ২০২৬ • অবস্থান: রাজশাহী, বাংলাদেশ"
    sections={PRIVACY_SECTIONS}
    companionHref="/terms-and-conditions"
    companionLabelEn="Read Terms & Conditions →"
    companionLabelBn="শর্তাবলি (Terms) পড়ুন →"
  />
);
