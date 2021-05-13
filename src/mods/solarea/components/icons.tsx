import React from 'react';

export const icons = {
  forward: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-arrow-forward"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M15 11l4 4l-4 4m4 -4h-11a4 4 0 0 1 0 -8h1"></path>
    </svg>
  ),
  refresh: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-refresh"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
    </svg>
  ),
  settings: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path
        d="M8.3 2.29995C8.7 0.499951 11.2 0.499951 11.6 2.29995C11.8 3.19995 12.8 3.79994 13.7 3.59994C13.9 3.59994 14 3.49993 14.2 3.39993C15.7 2.49993 17.5 4.19995 16.6 5.79995C16.1 6.59995 16.4 7.69994 17.2 8.19994C17.4 8.29994 17.5 8.39993 17.7 8.39993C19.5 8.79993 19.5 11.3 17.7 11.8C16.8 12 16.2 12.9999 16.4 13.8999C16.4 14.0999 16.5 14.1999 16.6 14.3999C17.5 15.8999 15.8 17.7 14.2 16.8C13.4 16.3 12.3 16.5999 11.8 17.3999C11.7 17.5999 11.6 17.6999 11.6 17.8999C11.2 19.6999 8.7 19.6999 8.2 17.8999C8 16.9999 7 16.3999 6.1 16.5999C5.9 16.5999 5.8 16.7 5.6 16.8C4.1 17.7 2.3 15.9999 3.2 14.3999C3.7 13.5999 3.4 12.4999 2.6 11.9999C2.4 11.8999 2.3 11.8 2.1 11.8C0.3 11.4 0.3 8.89993 2.1 8.39993C3 8.19993 3.6 7.19995 3.4 6.29995C3.4 6.09995 3.3 5.99995 3.2 5.79995C2.3 4.29995 4 2.49993 5.6 3.39993C6.8 3.89993 8 3.39995 8.3 2.29995ZM10 6.99993C11.7 6.99993 13 8.29993 13 9.99993C13 11.6999 11.7 12.9999 10 12.9999C8.3 12.9999 7 11.6999 7 9.99993C7 8.29993 8.3 6.99993 10 6.99993Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  save: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-cloud-upload"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"></path>
      <polyline points="9 15 12 12 15 15"></polyline>
      <line x1="12" y1="12" x2="12" y2="21"></line>
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-chevrons-left"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="11 7 6 12 11 17"></polyline>
      <polyline points="17 7 12 12 17 17"></polyline>
    </svg>
  ),
  chevronDown: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-chevron-down"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  chevronUp: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-chevron-up"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="6 15 12 9 18 15"></polyline>
    </svg>
  ),
  play: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-player-play"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M7 4v16l13 -8z"></path>
    </svg>
  ),
  info: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path
        d="M10 10V14M10 6.20001V5.20001M10 1C15 1 19 5 19 10C19 15 15 19 10 19C5 19 1 15 1 10C1 5 5 1 10 1Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
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
      <path
        d="M0.5 13.5H15.5M0.5 0.5H15.5H0.5ZM0.5 7H15.5H0.5Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  solana: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.99996 18C5.75223 18 4.55561 17.5259 3.67334 16.682C2.79107 15.8381 2.29541 14.6935 2.29541 13.5C2.29541 12.3065 2.79107 11.1619 3.67334 10.318C4.55561 9.47411 5.75223 9 6.99996 9C7.29464 7.68718 8.15672 6.53348 9.39654 5.79271C10.0104 5.42592 10.6986 5.17155 11.4217 5.04411C12.1449 4.91668 12.8888 4.91868 13.6111 5.05C14.3333 5.18132 15.0198 5.43939 15.6312 5.80948C16.2427 6.17957 16.7672 6.65442 17.1747 7.20693C17.5823 7.75944 17.8649 8.37878 18.0065 9.0296C18.1481 9.68041 18.1459 10.35 18 11H19C19.9282 11 20.8185 11.3687 21.4748 12.0251C22.1312 12.6815 22.5 13.5717 22.5 14.5C22.5 15.4283 22.1312 16.3185 21.4748 16.9749C20.8185 17.6313 19.9282 18 19 18H18"
        stroke="url(#paint0_linear)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 15L12 12L15 15"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 12V21"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="12.3977"
          y1="4.95"
          x2="12.3977"
          y2="18"
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
      className="icon icon-tabler icon-tabler-file-upload"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
      <line x1="12" y1="11" x2="12" y2="17"></line>
      <polyline points="9 14 12 11 15 14"></polyline>
    </svg>
  ),
  reload: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor">
      <path
        d="M1.1 8C1.7 3.6 5.7 0.500001 10.1 1.1C14.5 1.7 17.6 5.7 17 10.1C16.4 14.5 12.4 17.6 8 17C5.1 16.6 2.7 14.7 1.6 12M1.1 17V12H6.1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  back_arrow: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-arrow-back"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1"></path>
    </svg>
  ),
  mobile: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-device-mobile"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="7" y="4" width="10" height="16" rx="1" />
      <line x1="11" y1="5" x2="13" y2="5" />
      <line x1="12" y1="17" x2="12" y2="17.01" />
    </svg>
  ),
  tablet: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-device-tablet"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  ),
  desktop: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-device-desktop"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <line x1="7" y1="20" x2="17" y2="20" />
      <line x1="9" y1="16" x2="9" y2="20" />
      <line x1="15" y1="16" x2="15" y2="20" />
    </svg>
  ),
  fullscreen: () => (
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
      className="feather feather-maximize"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
    </svg>
  ),
};
