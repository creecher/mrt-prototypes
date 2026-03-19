import { createSvgIcon } from '@mui/material/utils';

/** Same tile as checked; white horizontal bar instead of check. */
export default createSvgIcon(
  <>
    <rect width="24" height="24" rx="6" ry="6" fill="rgba(33, 31, 38, 0.90)" />
    <path
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M7 12h10"
    />
  </>,
  'CheckboxIndeterminateCustom'
);
