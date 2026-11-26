import type { Metadata } from 'next';
import { PrivacyPolicyContent } from '../../components/PrivacyPolicyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | EPSR — Easy Product Service Rajshahi',
  description:
    'Official Privacy Policy and Google Play Data Safety & Account Deletion Policy for EPSR (Easy Product Service Rajshahi).',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
