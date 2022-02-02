import React, { FC } from 'react';

const icons = {
  home: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.48838 1.00888C9.78931 0.774823 10.2107 0.774823 10.5116 1.00888L18.0116 6.84221C18.2146 7.00009 18.3333 7.24284 18.3333 7.5V16.6667C18.3333 17.3297 18.0699 17.9656 17.6011 18.4344C17.1323 18.9033 16.4964 19.1667 15.8333 19.1667H4.16667C3.50362 19.1667 2.86774 18.9033 2.3989 18.4344C1.93006 17.9656 1.66667 17.3297 1.66667 16.6667V7.5C1.66667 7.24284 1.78539 7.00009 1.98838 6.84221L9.48838 1.00888ZM3.33333 7.90757V16.6667C3.33333 16.8877 3.42113 17.0996 3.57741 17.2559C3.73369 17.4122 3.94565 17.5 4.16667 17.5H15.8333C16.0543 17.5 16.2663 17.4122 16.4226 17.2559C16.5789 17.0996 16.6667 16.8877 16.6667 16.6667V7.90757L10 2.72239L3.33333 7.90757Z"
        fill="url(#paint0_linear_473_177)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.66667 10C6.66667 9.53976 7.03976 9.16666 7.5 9.16666H12.5C12.9602 9.16666 13.3333 9.53976 13.3333 10V18.3333C13.3333 18.7936 12.9602 19.1667 12.5 19.1667C12.0398 19.1667 11.6667 18.7936 11.6667 18.3333V10.8333H8.33333V18.3333C8.33333 18.7936 7.96024 19.1667 7.5 19.1667C7.03976 19.1667 6.66667 18.7936 6.66667 18.3333V10Z"
        fill="url(#paint1_linear_473_177)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_473_177"
          x1="1.66667"
          y1="-3.04483"
          x2="18.745"
          y2="-2.76872"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF0168" />
          <stop offset="0.96875" stop-color="#FF9A01" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_473_177"
          x1="6.66667"
          y1="7.0513"
          x2="13.4988"
          y2="7.1323"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF0168" />
          <stop offset="0.96875" stop-color="#FF9A01" />
        </linearGradient>
      </defs>
    </svg>
  ),
  addFile: () => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.58579 1.75245C2.96086 1.37738 3.46957 1.16667 4 1.16667H9.33333C9.51015 1.16667 9.67971 1.23691 9.80474 1.36193L13.8047 5.36193C13.9298 5.48695 14 5.65652 14 5.83333V13.8333C14 14.3638 13.7893 14.8725 13.4142 15.2475C13.0391 15.6226 12.5304 15.8333 12 15.8333H4C3.46957 15.8333 2.96086 15.6226 2.58579 15.2475C2.21071 14.8725 2 14.3638 2 13.8333V3.16667C2 2.63623 2.21071 2.12753 2.58579 1.75245ZM4 2.5C3.82319 2.5 3.65362 2.57024 3.5286 2.69526C3.40357 2.82029 3.33333 2.98986 3.33333 3.16667V13.8333C3.33333 14.0101 3.40357 14.1797 3.5286 14.3047C3.65362 14.4298 3.82319 14.5 4 14.5H12C12.1768 14.5 12.3464 14.4298 12.4714 14.3047C12.5964 14.1797 12.6667 14.0101 12.6667 13.8333V6.10948L9.05719 2.5H4Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.33332 1.16667C9.70151 1.16667 9.99999 1.46514 9.99999 1.83333V5.16667H13.3333C13.7015 5.16667 14 5.46515 14 5.83333C14 6.20152 13.7015 6.5 13.3333 6.5H9.33332C8.96513 6.5 8.66666 6.20152 8.66666 5.83333V1.83333C8.66666 1.46514 8.96513 1.16667 9.33332 1.16667Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.00001 7.83333C8.3682 7.83333 8.66668 8.13181 8.66668 8.5V12.5C8.66668 12.8682 8.3682 13.1667 8.00001 13.1667C7.63182 13.1667 7.33334 12.8682 7.33334 12.5V8.5C7.33334 8.13181 7.63182 7.83333 8.00001 7.83333Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.33334 10.5C5.33334 10.1318 5.63182 9.83333 6.00001 9.83333H10C10.3682 9.83333 10.6667 10.1318 10.6667 10.5C10.6667 10.8682 10.3682 11.1667 10 11.1667H6.00001C5.63182 11.1667 5.33334 10.8682 5.33334 10.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  addFolder: () => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.66666 3.16667C2.48985 3.16667 2.32028 3.2369 2.19525 3.36193C2.07023 3.48695 1.99999 3.65652 1.99999 3.83333V13.1667C1.99999 13.3435 2.07023 13.513 2.19525 13.6381C2.32028 13.7631 2.48985 13.8333 2.66666 13.8333H13.3333C13.5101 13.8333 13.6797 13.7631 13.8047 13.6381C13.9298 13.513 14 13.3435 14 13.1667V5.83333C14 5.65652 13.9298 5.48695 13.8047 5.36193C13.6797 5.2369 13.5101 5.16667 13.3333 5.16667H7.33332C7.11042 5.16667 6.90227 5.05526 6.77862 4.8698L5.6432 3.16667H2.66666ZM1.25244 2.41912C1.62752 2.04405 2.13622 1.83333 2.66666 1.83333H5.99999C6.22289 1.83333 6.43105 1.94473 6.55469 2.1302L7.69011 3.83333H13.3333C13.8638 3.83333 14.3725 4.04405 14.7475 4.41912C15.1226 4.79419 15.3333 5.3029 15.3333 5.83333V13.1667C15.3333 13.6971 15.1226 14.2058 14.7475 14.5809C14.3725 14.956 13.8638 15.1667 13.3333 15.1667H2.66666C2.13622 15.1667 1.62752 14.956 1.25244 14.5809C0.87737 14.2058 0.666656 13.6971 0.666656 13.1667V3.83333C0.666656 3.3029 0.87737 2.79419 1.25244 2.41912Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.00001 7.16667C8.3682 7.16667 8.66668 7.46514 8.66668 7.83333V11.8333C8.66668 12.2015 8.3682 12.5 8.00001 12.5C7.63182 12.5 7.33334 12.2015 7.33334 11.8333V7.83333C7.33334 7.46514 7.63182 7.16667 8.00001 7.16667Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.33334 9.83333C5.33334 9.46514 5.63182 9.16667 6.00001 9.16667H10C10.3682 9.16667 10.6667 9.46514 10.6667 9.83333C10.6667 10.2015 10.3682 10.5 10 10.5H6.00001C5.63182 10.5 5.33334 10.2015 5.33334 9.83333Z"
        fill="currentColor"
      />
    </svg>
  ),
  save: () => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.33334 3.16667C3.15653 3.16667 2.98696 3.2369 2.86194 3.36193C2.73691 3.48695 2.66668 3.65652 2.66668 3.83333V13.1667C2.66668 13.3435 2.73691 13.513 2.86194 13.6381C2.98696 13.7631 3.15653 13.8333 3.33334 13.8333H12.6667C12.8435 13.8333 13.0131 13.7631 13.1381 13.6381C13.2631 13.513 13.3333 13.3435 13.3333 13.1667V6.10948L10.3905 3.16667H3.33334ZM1.91913 2.41912C2.2942 2.04405 2.80291 1.83333 3.33334 1.83333H10.6667C10.8435 1.83333 11.0131 1.90357 11.1381 2.02859L14.4714 5.36193C14.5964 5.48695 14.6667 5.65652 14.6667 5.83333V13.1667C14.6667 13.6971 14.456 14.2058 14.0809 14.5809C13.7058 14.956 13.1971 15.1667 12.6667 15.1667H3.33334C2.80291 15.1667 2.2942 14.956 1.91913 14.5809C1.54406 14.2058 1.33334 13.6971 1.33334 13.1667V3.83333C1.33334 3.3029 1.54406 2.79419 1.91913 2.41912Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 9.16667C4 8.79848 4.29848 8.5 4.66667 8.5H11.3333C11.7015 8.5 12 8.79848 12 9.16667V14.5C12 14.8682 11.7015 15.1667 11.3333 15.1667C10.9651 15.1667 10.6667 14.8682 10.6667 14.5V9.83333H5.33333V14.5C5.33333 14.8682 5.03486 15.1667 4.66667 15.1667C4.29848 15.1667 4 14.8682 4 14.5V9.16667Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.66667 1.83333C5.03486 1.83333 5.33333 2.13181 5.33333 2.5V5.16667H10C10.3682 5.16667 10.6667 5.46514 10.6667 5.83333C10.6667 6.20152 10.3682 6.5 10 6.5H4.66667C4.29848 6.5 4 6.20152 4 5.83333V2.5C4 2.13181 4.29848 1.83333 4.66667 1.83333Z"
        fill="currentColor"
      />
    </svg>
  ),
  maximize: () => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.33331 2.5C9.33331 2.13181 9.63179 1.83333 9.99998 1.83333H14C14.3682 1.83333 14.6666 2.13181 14.6666 2.5V6.5C14.6666 6.86819 14.3682 7.16667 14 7.16667C13.6318 7.16667 13.3333 6.86819 13.3333 6.5V3.16667H9.99998C9.63179 3.16667 9.33331 2.86819 9.33331 2.5Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.99998 9.83333C2.36817 9.83333 2.66665 10.1318 2.66665 10.5V13.8333H5.99998C6.36817 13.8333 6.66665 14.1318 6.66665 14.5C6.66665 14.8682 6.36817 15.1667 5.99998 15.1667H1.99998C1.63179 15.1667 1.33331 14.8682 1.33331 14.5V10.5C1.33331 10.1318 1.63179 9.83333 1.99998 9.83333Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.4714 2.02859C14.7318 2.28894 14.7318 2.71105 14.4714 2.9714L9.80476 7.63807C9.54441 7.89842 9.1223 7.89842 8.86195 7.63807C8.6016 7.37772 8.6016 6.95561 8.86195 6.69526L13.5286 2.02859C13.789 1.76824 14.2111 1.76824 14.4714 2.02859Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.13805 9.36193C7.3984 9.62228 7.3984 10.0444 7.13805 10.3047L2.47138 14.9714C2.21103 15.2318 1.78892 15.2318 1.52858 14.9714C1.26823 14.7111 1.26823 14.2889 1.52858 14.0286L6.19524 9.36193C6.45559 9.10158 6.8777 9.10158 7.13805 9.36193Z"
        fill="currentColor"
      />
    </svg>
  ),

  terminal: () => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.19526 3.36193C2.45561 3.10158 2.87772 3.10158 3.13807 3.36193L7.13807 7.36193C7.39842 7.62228 7.39842 8.04439 7.13807 8.30474L3.13807 12.3047C2.87772 12.5651 2.45561 12.5651 2.19526 12.3047C1.93491 12.0444 1.93491 11.6223 2.19526 11.3619L5.72386 7.83333L2.19526 4.30474C1.93491 4.04439 1.93491 3.62228 2.19526 3.36193Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.33331 13.1667C7.33331 12.7985 7.63179 12.5 7.99998 12.5H13.3333C13.7015 12.5 14 12.7985 14 13.1667C14 13.5349 13.7015 13.8333 13.3333 13.8333H7.99998C7.63179 13.8333 7.33331 13.5349 7.33331 13.1667Z"
        fill="currentColor"
      />
    </svg>
  ),
  share: () => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 2.5C11.2636 2.5 10.6666 3.09695 10.6666 3.83333C10.6666 4.56971 11.2636 5.16667 12 5.16667C12.7364 5.16667 13.3333 4.56971 13.3333 3.83333C13.3333 3.09695 12.7364 2.5 12 2.5ZM9.33331 3.83333C9.33331 2.36058 10.5272 1.16667 12 1.16667C13.4727 1.16667 14.6666 2.36058 14.6666 3.83333C14.6666 5.30609 13.4727 6.5 12 6.5C10.5272 6.5 9.33331 5.30609 9.33331 3.83333Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.99998 7.16667C3.2636 7.16667 2.66665 7.76362 2.66665 8.5C2.66665 9.23638 3.2636 9.83333 3.99998 9.83333C4.73636 9.83333 5.33331 9.23638 5.33331 8.5C5.33331 7.76362 4.73636 7.16667 3.99998 7.16667ZM1.33331 8.5C1.33331 7.02724 2.52722 5.83333 3.99998 5.83333C5.47274 5.83333 6.66665 7.02724 6.66665 8.5C6.66665 9.97276 5.47274 11.1667 3.99998 11.1667C2.52722 11.1667 1.33331 9.97276 1.33331 8.5Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 11.8333C11.2636 11.8333 10.6666 12.4303 10.6666 13.1667C10.6666 13.903 11.2636 14.5 12 14.5C12.7364 14.5 13.3333 13.903 13.3333 13.1667C13.3333 12.4303 12.7364 11.8333 12 11.8333ZM9.33331 13.1667C9.33331 11.6939 10.5272 10.5 12 10.5C13.4727 10.5 14.6666 11.6939 14.6666 13.1667C14.6666 14.6394 13.4727 15.8333 12 15.8333C10.5272 15.8333 9.33331 14.6394 9.33331 13.1667Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.15065 9.17101C5.33602 8.85289 5.74418 8.74528 6.0623 8.93066L10.6156 11.584C10.9338 11.7694 11.0414 12.1775 10.856 12.4956C10.6706 12.8138 10.2625 12.9214 9.94433 12.736L5.391 10.0827C5.07288 9.8973 4.96527 9.48913 5.15065 9.17101Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.8491 4.50398C11.0347 4.82198 10.9273 5.23021 10.6093 5.41579L6.06267 8.06912C5.74467 8.2547 5.33644 8.14735 5.15086 7.82935C4.96528 7.51135 5.07263 7.10312 5.39063 6.91754L9.9373 4.26421C10.2553 4.07863 10.6635 4.18598 10.8491 4.50398Z"
        fill="currentColor"
      />
    </svg>
  ),
};

interface IconProps {
  name: keyof typeof icons;
}

const Icon: FC<IconProps> = ({ name }) => {
  return icons[name]();
};

export default Icon;
