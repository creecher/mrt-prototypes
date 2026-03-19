import { createSvgIcon } from '@mui/material/utils';

/** Checked state: dark fill + white mark (MUI default icon is one `currentColor` path, not suitable here). */
export default createSvgIcon(
  <>
    <rect width="24" height="24" rx="6" ry="6" fill="rgba(33, 31, 38, 0.90)" />
    <path
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 12.5l2.5 2.5 6.5-6.5"
    />
  </>,
  'CheckboxCheckedCustom'
);
