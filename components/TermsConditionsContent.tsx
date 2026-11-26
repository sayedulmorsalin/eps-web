'use client';

import React from 'react';
import { LegalDocumentPage, LegalSection } from '../components/LegalDocumentPage';

const TERMS_SECTIONS: LegalSection[] = [
  {
    titleEn: '1. Acceptance of Terms',
    titleBn: '১. শর্তাবলি গ্রহণ',
    paragraphsEn: [
      'By downloading, installing, accessing, or placing an order through the EPSR mobile application or website (operated by EPSR — Easy Product Service Rajshahi), you agree to be bound by these Terms and Conditions and our Privacy Policy.',
    ],
    paragraphsBn: [
      'EPSR (Easy Product Service Rajshahi) মোবাইল অ্যাপ্লিকেশন বা ওয়েবসাইট ব্যবহার ও অর্ডার করার মাধ্যমে আপনি এই শর্তাবলি ও আমাদের গোপনীয়তা নীতিমালা মেনে চলতে সম্মত হচ্ছেন।',
    ],
  },
  {
    titleEn: '2. Service Coverage & Eligibility',
    titleBn: '২. সেবার আওতা ও যোগ্যতা',
    paragraphsEn: [
      'EPSR currently provides online grocery ordering and home delivery primarily within Rajshahi City and nearby designated zones during active operating hours (9:00 AM – 10:00 PM). Users must be at least 18 years old, or place orders with parental/guardian consent.',
    ],
    paragraphsBn: [
      'EPSR বর্তমানে প্রধানত রাজশাহী মহানগর ও নির্ধারিত আশপাশের এলাকায় সকাল ৯টা থেকে রাত ১০টা পর্যন্ত অনলাইন গ্রোসারি ডেলিভারি সেবা প্রদান করে। অর্ডার দেওয়ার জন্য আপনার বয়স অন্তত ১৮ বছর হতে হবে অথবা অভিভাবকের সম্মতি থাকতে হবে।',
    ],
  },
  {
    titleEn: '3. Accounts & Accurate Information',
    titleBn: '৩. অ্যাকাউন্ট ও সঠিক তথ্য প্রদান',
    paragraphsEn: [
      'When registering or checking out, you agree to provide accurate contact details (name, active mobile phone number, and complete delivery address) so our riders can contact you and complete delivery without delay. You are responsible for maintaining the confidentiality of your login credentials.',
    ],
    paragraphsBn: [
      'নিবন্ধন বা চেকআউটের সময় ডেলিভারি নিশ্চিত করতে সঠিক নাম, সচল মোবাইল নম্বর ও পূর্ণ ঠিকানা প্রদান করা বাধ্যতামূলক। আপনার অ্যাকাউন্টের পাসওয়ার্ড ও নিরাপত্তার দায়িত্ব আপনার নিজের।',
    ],
  },
  {
    titleEn: '4. Products, Pricing & Promo Codes',
    titleBn: '৪. পণ্য, মূল্য ও প্রমো কোড',
    paragraphsEn: [
      'All prices are listed in Bangladeshi Taka (৳ / BDT). While we strive to keep stock counts and pricing accurate in real time, weights of fresh produce may vary slightly and items are subject to availability. Promotional discounts and promo codes apply only while active and may be modified or withdrawn without prior notice.',
    ],
    paragraphsBn: [
      'সকল পণ্যের মূল্য বাংলাদেশি টাকায় (৳) প্রদর্শিত হয়। তাজা শাকসবজি ও মাছ-মাংসের ওজন সামান্য তারতম্য হতে পারে এবং প্রাপ্যতা সাপেক্ষে সরবরাহ করা হয়। প্রমো কোড ও ছাড় নির্ধারিত সময় ও শর্ত সাপেক্ষে প্রযোজ্য।',
    ],
  },
  {
    titleEn: '5. Orders, Delivery & Cash on Delivery (COD)',
    titleBn: '৫. অর্ডার, ডেলিভারি ও ক্যাশ অন ডেলিভারি (COD)',
    paragraphsEn: [
      'Orders placed are subject to confirmation and stock verification. Express delivery times (such as 60 minutes in central Rajshahi) are estimates and may vary due to weather, traffic, or peak demand. Payment is collected in cash upon delivery (COD) after inspecting the delivered items.',
    ],
    paragraphsBn: [
      'অর্ডার গ্রহণের পর স্টক যাচাই সাপেক্ষে তা নিশ্চিত করা হয়। ৬০ মিনিটে ডেলিভারি একটি আনুমানিক সময়; আবহাওয়া, যানজট বা অতিরিক্ত চাহিদার কারণে সময় পরিবর্তিত হতে পারে। পণ্য হাতে পেয়ে যাচাই করার পর ক্যাশ অন ডেলিভারি (COD) মাধ্যমে মূল্য পরিশোধ করতে হবে।',
    ],
  },
  {
    titleEn: '6. Cancellation, Return & Replacement Policy',
    titleBn: '৬. অর্ডার বাতিল, রিটার্ন ও প্রতিস্থাপন নীতি',
    paragraphsEn: [
      'You may cancel an order before it is picked up for delivery by contacting customer support. If any item arrives damaged, spoiled, expired, or incorrect, you may return it directly to the delivery rider at the doorstep or contact support (+880 1700-000000 / support@epsr.com) for prompt replacement or adjustment.',
    ],
    paragraphsBn: [
      'রাইডার পণ্য সংগ্রহের আগে সাপোর্টে যোগাযোগ করে অর্ডার বাতিল করা যাবে। ডেলিভারির সময় কোনো পণ্য নষ্ট, ত্রুটিপূর্ণ বা ভুল মনে হলে সাথে সাথেই রাইডারের কাছে ফেরত দিতে পারবেন অথবা সাপোর্টে (+880 1700-000000 / support@epsr.com) যোগাযোগ করে দ্রুত প্রতিস্থাপন বা সমাধান নিতে পারবেন।',
    ],
  },
  {
    titleEn: '7. Acceptable Use & Intellectual Property',
    titleBn: '৭. গ্রহণযোগ্য ব্যবহার ও মেধাস্বত্ব',
    paragraphsEn: [
      'You agree not to misuse the EPSR app or website, place fraudulent orders, scrape or interfere with backend APIs, or infringe upon EPSR branding, logos, and content.',
    ],
    paragraphsBn: [
      'EPSR অ্যাপ বা ওয়েবসাইটের অপব্যবহার, ভুয়া অর্ডার প্রদান, সার্ভার বা এপিআই-তে অননুমোদিত হস্তক্ষেপ এবং EPSR-এর লোগো বা কনটেন্টের অপব্যবহার সম্পূর্ণ নিষিদ্ধ।',
    ],
  },
  {
    titleEn: '8. Limitation of Liability & Governing Law',
    titleBn: '৮. দায়বদ্ধতার সীমা ও প্রযোজ্য আইন',
    paragraphsEn: [
      'To the maximum extent permitted by applicable law, EPSR shall not be liable for indirect or incidental damages arising from temporary service interruptions or delivery delays caused by events outside our reasonable control. These Terms are governed by the laws of the People’s Republic of Bangladesh.',
    ],
    paragraphsBn: [
      'আইনের অনুমোদিত সর্বোচ্চ সীমা পর্যন্ত, আমাদের নিয়ন্ত্রণের বাইরের কোনো কারণ বা সাময়িক প্রযুক্তিগত ত্রুটির জন্য উদ্ভূত পরোক্ষ ক্ষতির জন্য EPSR দায়ী থাকবে না। এই শর্তাবলি গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন অনুযায়ী পরিচালিত হবে।',
    ],
  },
];

export const TermsConditionsContent = () => (
  <LegalDocumentPage
    badgeEn="Google Play Store Compliant • Terms & Conditions"
    badgeBn="গুগল প্লে স্টোর কমপ্লায়েন্ট • ব্যবহারের শর্তাবলি"
    titleEn="Terms & Conditions — EPSR"
    titleBn="ব্যবহারের শর্তাবলি (Terms & Conditions) — EPSR"
    subtitleEn="Terms governing the use of the EPSR mobile application, online store, ordering, delivery, and returns."
    subtitleBn="EPSR মোবাইল অ্যাপ ও ওয়েবসাইটে অর্ডার, ডেলিভারি, পেমেন্ট ও রিটার্ন সংক্রান্ত শর্তাবলি।"
    lastUpdatedEn="Effective Date: November 25, 2026 • Governing Law: Bangladesh"
    lastUpdatedBn="কার্যকর তারিখ: ২৫ নভেম্বর ২০২৬ • আইন: বাংলাদেশ"
    sections={TERMS_SECTIONS}
    companionHref="/privacy-policy"
    companionLabelEn="Read Privacy Policy →"
    companionLabelBn="গোপনীয়তা নীতি (Privacy Policy) পড়ুন →"
  />
);
