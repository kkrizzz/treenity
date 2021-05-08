import React from 'react';

export const icons = {
  refresh: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
  settings: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M8.3 2.29995C8.7 0.499951 11.2 0.499951 11.6 2.29995C11.8 3.19995 12.8 3.79994 13.7 3.59994C13.9 3.59994 14 3.49993 14.2 3.39993C15.7 2.49993 17.5 4.19995 16.6 5.79995C16.1 6.59995 16.4 7.69994 17.2 8.19994C17.4 8.29994 17.5 8.39993 17.7 8.39993C19.5 8.79993 19.5 11.3 17.7 11.8C16.8 12 16.2 12.9999 16.4 13.8999C16.4 14.0999 16.5 14.1999 16.6 14.3999C17.5 15.8999 15.8 17.7 14.2 16.8C13.4 16.3 12.3 16.5999 11.8 17.3999C11.7 17.5999 11.6 17.6999 11.6 17.8999C11.2 19.6999 8.7 19.6999 8.2 17.8999C8 16.9999 7 16.3999 6.1 16.5999C5.9 16.5999 5.8 16.7 5.6 16.8C4.1 17.7 2.3 15.9999 3.2 14.3999C3.7 13.5999 3.4 12.4999 2.6 11.9999C2.4 11.8999 2.3 11.8 2.1 11.8C0.3 11.4 0.3 8.89993 2.1 8.39993C3 8.19993 3.6 7.19995 3.4 6.29995C3.4 6.09995 3.3 5.99995 3.2 5.79995C2.3 4.29995 4 2.49993 5.6 3.39993C6.8 3.89993 8 3.39995 8.3 2.29995ZM10 6.99993C11.7 6.99993 13 8.29993 13 9.99993C13 11.6999 11.7 12.9999 10 12.9999C8.3 12.9999 7 11.6999 7 9.99993C7 8.29993 8.3 6.99993 10 6.99993Z" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  ),
  save: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4.5 0.5V4.5H11M14.6 15.5H1.4C0.9 15.5 0.5 15.1 0.5 14.6V1.4C0.5 0.9 0.9 0.5 1.4 0.5H11.9C12.2 0.5 12.5 0.6 12.8 0.9L15.1 3.2C15.3 3.4 15.5 3.7 15.5 4.1V14.6C15.5 15.1 15.1 15.5 14.6 15.5ZM12.5 15.5V8.5H3.5V15.5H12.5Z" stroke="#CCDDEE" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  ),
  close: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-x"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  rewind: (width = 24, height = 24) => (
    <svg width="21" height="16" viewBox="0 0 21 16" fill="none" stroke="currentColor">
      <path d="M0.799999 8L9.9 1V15.1L0.799999 8ZM19.6 15.1V1L10.5 8L19.6 15.1Z" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  ),
  play: () => (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
      <path d="M13.4 9.99999L0.599998 0.899994V19.1L13.4 9.99999Z" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  ),
  info: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 10V14M10 6.20001V5.20001M10 1C15 1 19 5 19 10C19 15 15 19 10 19C5 19 1 15 1 10C1 5 5 1 10 1Z" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  ),
  burger: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-menu"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  burger2: () => (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor">
      <path d="M0.5 13.5H15.5M0.5 0.5H15.5H0.5ZM0.5 7H15.5H0.5Z" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  ),
  solana: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H14L19 6V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19Z"
        stroke="url(#paint0_linear)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15 19V11H5V19"
        stroke="url(#paint1_linear)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 1V6H13"
        stroke="url(#paint2_linear)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="19.5"
          y1="-1.5"
          x2="2"
          y2="22.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#DC1FFF" />
          <stop offset="1" stop-color="#00FFA3" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="16.5"
          y1="1.5"
          x2="3.5"
          y2="23.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#DC1FFF" />
          <stop offset="1" stop-color="#00FFA3" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="14.5"
          y1="-1.5"
          x2="3"
          y2="12.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#DC1FFF" />
          <stop offset="1" stop-color="#00FFA3" />
        </linearGradient>
      </defs>
    </svg>
  ),
  upload: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-upload"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  reload: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor">
      <path d="M1.1 8C1.7 3.6 5.7 0.500001 10.1 1.1C14.5 1.7 17.6 5.7 17 10.1C16.4 14.5 12.4 17.6 8 17C5.1 16.6 2.7 14.7 1.6 12M1.1 17V12H6.1" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  ),
};
