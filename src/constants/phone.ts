export type DialCode = {
  code: string;
  country: string;
};

export const DIAL_CODES: DialCode[] = [
  { code: '+84', country: 'Vietnam' },
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+61', country: 'Australia' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+66', country: 'Thailand' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+86', country: 'China' },
];

export const DEFAULT_DIAL_CODE = DIAL_CODES[0].code;
