import * as React from 'react';
import { checkboxClasses } from '@mui/material/Checkbox';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { palette } from './palette';
import CheckboxCheckedIcon from './checkboxCheckedIcon.jsx';
import CheckboxIndeterminateIcon from './checkboxIndeterminateIcon.jsx';

const baseTheme = createTheme({
  palette,
  cssVariables: true,
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid rgba(33, 31, 38, 0.9)',
            outlineOffset: '2px',
            borderRadius: 'inherit',
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
        checkedIcon: React.createElement(CheckboxCheckedIcon),
        indeterminateIcon: React.createElement(CheckboxIndeterminateIcon),
      },
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-focusVisible': {
            outline: '2px solid rgba(33, 31, 38, 0.9)',
            outlineOffset: '2px',
            borderRadius: '6px',
          },
          // Match 16px glyph; default MUI is 24px with 9px padding.
          padding: 6,
          // Outline icon is a filled path using `currentColor`; hide it so only the
          // styled SVG box (shadow + radius) reads as the control—not a second border.
          // `indeterminate` uses `MuiCheckbox-indeterminate`, not `Mui-indeterminate`.
          [`&:not(.${checkboxClasses.checked}):not(.${checkboxClasses.indeterminate})`]: {
            color: 'transparent',
          },
          '& .MuiSvgIcon-root': {
            width: 16,
            height: 16,
            fontSize: 16,
            flexShrink: 0,
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#FFF',
            boxShadow:
              '0 0 0 1px rgba(20, 0, 53, 0.15), 0 1px 3px 0 rgba(33, 31, 38, 0.10), 0 1px 2px -1px rgba(33, 31, 38, 0.10)',
          },
          // Checked: custom SVG supplies fill + white stroke; wrapper stays chrome-free.
          [`&.${checkboxClasses.checked} .MuiSvgIcon-root`]: {
            borderRadius: '4px',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
          // Indeterminate: custom SVG matches checked tile (fill is inside the icon).
          [`&.${checkboxClasses.indeterminate} .MuiSvgIcon-root`]: {
            borderRadius: '4px',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
          [`&.Mui-disabled:not(.${checkboxClasses.checked}):not(.${checkboxClasses.indeterminate}) .MuiSvgIcon-root`]:
            {
            opacity:
              (theme.vars || theme).palette.action.disabledOpacity ?? 0.38,
          },
        }),
      },
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiSwitch: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  typography: {
    fontFamily: '"Figtree", "Roboto", sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 600,
      lineHeight: 1.09,       // 3 / 2.75
      letterSpacing: '-0.0275rem',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.22,       // 2.75 / 2.25
      letterSpacing: '-0.011875rem',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.25,       // 2.5 / 2
      letterSpacing: '-0.01rem',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.29,       // 2.25 / 1.75
      letterSpacing: '-0.00875rem',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.33,       // 2 / 1.5
      letterSpacing: '-0.00625rem',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.33,       // 1.5 / 1.125
      letterSpacing: '-0.00375rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,        // 1.5 / 1
      letterSpacing: '0rem',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.43,       // 1.25 / 0.875
      letterSpacing: '0rem',
    },
    overline: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.14,       // 1 / 0.875
      letterSpacing: '0.075rem',
      textTransform: 'uppercase',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,        // 1.5 / 1
      letterSpacing: '0rem',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,       // 1.25 / 0.875
      letterSpacing: '0rem',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.17,       // 0.875 / 0.75
      letterSpacing: '0rem',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.43,       // 1.25 / 0.875
      letterSpacing: '0.00938rem',
      textTransform: 'none',
    },
  },
});

const theme = responsiveFontSizes(baseTheme);

export default theme;
