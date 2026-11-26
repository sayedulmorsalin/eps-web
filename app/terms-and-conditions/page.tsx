import type { Metadata } from 'next';
import { TermsConditionsContent } from '../../components/TermsConditionsContent';

export const metadata: Metadata = {
  title: 'Terms & Conditions | EPSR — Easy Product Service Rajshahi',
  description:
    'Terms and Conditions for ordering groceries, Cash on Delivery, delivery timelines, and returns with EPSR (Easy Product Service Rajshahi).',
};

export default function TermsAndConditionsPage() {
  return <TermsConditionsContent />;
}
