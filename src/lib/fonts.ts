import { Fraunces, Instrument_Sans } from 'next/font/google'

// Heading/display serif — warm, authoritative, distinctive
// Rationale: Variable humanist serif with optical size axis; pairs with Instrument Sans;
// distinctive for a Canadian medical alert brand targeting caregivers
export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

// Body/UI sans-serif — clean, readable
export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})
