const { useHotTokenPairs } = await require('solarea://velas-dextools/utils');
const ImportantActions = render('velas-dextools', 'important-actions');
const DashboardCard = render('dev', 'dashboard-card');
const Link = render('dev', 'link');
const HotPairCard = render('velas-dextools', 'hot-pair-card');
const HotIcon = () => (
  <div style={{ paddingBottom: 20 }}>
    <svg
      width="177"
      height="33"
      viewBox="0 0 132 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M37.1959 3.2H40.4839V20H37.1959V13.04H30.9559V20H27.6439V3.2H30.9559V9.872H37.1959V3.2ZM57.7408 17.816C56.0448 19.496 53.9808 20.336 51.5488 20.336C49.1168 20.336 47.0528 19.496 45.3568 17.816C43.6768 16.12 42.8368 14.048 42.8368 11.6C42.8368 9.152 43.6768 7.088 45.3568 5.408C47.0528 3.712 49.1168 2.864 51.5488 2.864C53.9808 2.864 56.0448 3.712 57.7408 5.408C59.4368 7.088 60.2848 9.152 60.2848 11.6C60.2848 14.048 59.4368 16.12 57.7408 17.816ZM47.6848 15.56C48.7248 16.584 50.0128 17.096 51.5488 17.096C53.0848 17.096 54.3728 16.584 55.4128 15.56C56.4528 14.52 56.9728 13.2 56.9728 11.6C56.9728 10 56.4528 8.68 55.4128 7.64C54.3728 6.6 53.0848 6.08 51.5488 6.08C50.0128 6.08 48.7248 6.6 47.6848 7.64C46.6448 8.68 46.1248 10 46.1248 11.6C46.1248 13.2 46.6448 14.52 47.6848 15.56ZM72.7637 3.2V6.368H68.2277V20H64.9157V6.368H60.4037V3.2H72.7637Z"
        fill="#FF8000"
      />
      <path
        d="M87.1646 7.712C88.8766 7.712 90.3326 8.32 91.5326 9.536C92.7486 10.752 93.3566 12.24 93.3566 14C93.3566 15.76 92.7486 17.248 91.5326 18.464C90.3326 19.68 88.8766 20.288 87.1646 20.288C85.0366 20.288 83.4206 19.408 82.3166 17.648V24.8H80.7326V8H82.3166V10.352C83.4206 8.592 85.0366 7.712 87.1646 7.712ZM83.6846 17.384C84.5966 18.296 85.7166 18.752 87.0446 18.752C88.3726 18.752 89.4926 18.296 90.4046 17.384C91.3166 16.456 91.7726 15.328 91.7726 14C91.7726 12.672 91.3166 11.552 90.4046 10.64C89.4926 9.712 88.3726 9.248 87.0446 9.248C85.7166 9.248 84.5966 9.712 83.6846 10.64C82.7726 11.552 82.3166 12.672 82.3166 14C82.3166 15.328 82.7726 16.456 83.6846 17.384ZM106.31 8H107.894V20H106.31V17.648C105.206 19.408 103.59 20.288 101.462 20.288C99.7504 20.288 98.2864 19.68 97.0704 18.464C95.8704 17.248 95.2704 15.76 95.2704 14C95.2704 12.24 95.8704 10.752 97.0704 9.536C98.2864 8.32 99.7504 7.712 101.462 7.712C103.59 7.712 105.206 8.592 106.31 10.352V8ZM98.2224 17.384C99.1344 18.296 100.254 18.752 101.582 18.752C102.91 18.752 104.03 18.296 104.942 17.384C105.854 16.456 106.31 15.328 106.31 14C106.31 12.672 105.854 11.552 104.942 10.64C104.03 9.712 102.91 9.248 101.582 9.248C100.254 9.248 99.1344 9.712 98.2224 10.64C97.3104 11.552 96.8544 12.672 96.8544 14C96.8544 15.328 97.3104 16.456 98.2224 17.384ZM112.856 5.12C112.632 5.344 112.36 5.456 112.04 5.456C111.72 5.456 111.448 5.344 111.224 5.12C111 4.896 110.888 4.624 110.888 4.304C110.888 3.984 111 3.712 111.224 3.488C111.448 3.264 111.72 3.152 112.04 3.152C112.36 3.152 112.632 3.264 112.856 3.488C113.08 3.712 113.192 3.984 113.192 4.304C113.192 4.624 113.08 4.896 112.856 5.12ZM111.248 20V8H112.832V20H111.248ZM117.778 9.992C118.514 8.536 119.778 7.808 121.57 7.808V9.344C120.482 9.344 119.578 9.664 118.858 10.304C118.138 10.944 117.778 11.952 117.778 13.328V20H116.194V8H117.778V9.992ZM124.52 11.144C124.52 11.688 124.76 12.12 125.24 12.44C125.72 12.76 126.304 13.008 126.992 13.184C127.68 13.36 128.368 13.56 129.056 13.784C129.744 13.992 130.328 14.352 130.808 14.864C131.288 15.36 131.528 16.016 131.528 16.832C131.528 17.856 131.12 18.688 130.304 19.328C129.504 19.968 128.464 20.288 127.184 20.288C126.032 20.288 125.048 20.032 124.232 19.52C123.432 19.008 122.872 18.344 122.552 17.528L123.896 16.736C124.12 17.36 124.52 17.856 125.096 18.224C125.688 18.576 126.384 18.752 127.184 18.752C127.968 18.752 128.624 18.6 129.152 18.296C129.68 17.976 129.944 17.488 129.944 16.832C129.944 16.288 129.704 15.856 129.224 15.536C128.744 15.216 128.16 14.968 127.472 14.792C126.784 14.616 126.096 14.424 125.408 14.216C124.72 13.992 124.136 13.632 123.656 13.136C123.176 12.624 122.936 11.96 122.936 11.144C122.936 10.168 123.32 9.352 124.088 8.696C124.872 8.04 125.856 7.712 127.04 7.712C128.016 7.712 128.872 7.936 129.608 8.384C130.344 8.816 130.888 9.408 131.24 10.16L129.92 10.928C129.456 9.808 128.496 9.248 127.04 9.248C126.352 9.248 125.76 9.416 125.264 9.752C124.768 10.072 124.52 10.536 124.52 11.144Z"
        fill="currentColor"
      />
      <g clipPath="url(#clip0_0_1)">
        <path
          d="M8.19026 0C11.052 2.04 14.2805 5.78313 14.4047 10.0598C16.752 8.34506 15.9262 6.23422 15.7085 3.52626C18.3845 8.66602 20.1311 13.6945 18.1317 18.8906C16.7067 22.5947 13.4094 23.8063 9.69418 23.9306C5.97895 24.0549 2.64518 22.972 0.949796 19.4125C-0.657897 16.0207 -0.219432 12.6275 2.22572 9.65928C3.10264 8.5894 5.41918 6.71711 6.27857 5.75566C8.01633 3.83422 8.53664 2.4506 8.19026 0ZM8.65503 8.34506C9.34487 11.1976 6.9158 12.6231 5.75387 14.4376C4.87695 15.7952 5.23064 18.2429 6.07395 19.4212C6.81641 20.4607 9.16657 21.0231 10.6047 20.7484C12.6596 20.3537 13.4766 18.4077 13.2472 16.2549C12.9023 13.0352 10.7421 10.5065 8.65503 8.34506Z"
          fill="#FF8000"
        />
        <mask
          id="mask0_0_1"
          style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="19"
          height="24"
        >
          <path
            d="M8.19026 0C11.052 2.04 14.2805 5.78313 14.4047 10.0598C16.752 8.34506 15.9262 6.23422 15.7085 3.52626C18.3845 8.66602 20.1311 13.6945 18.1317 18.8906C16.7067 22.5947 13.4094 23.8063 9.69418 23.9306C5.97895 24.0549 2.64518 22.972 0.949796 19.4125C-0.657897 16.0207 -0.219432 12.6275 2.22572 9.65928C3.10264 8.5894 5.41918 6.71711 6.27857 5.75566C8.01633 3.83422 8.53664 2.4506 8.19026 0ZM8.65503 8.34506C9.34487 11.1976 6.9158 12.6231 5.75387 14.4376C4.87695 15.7952 5.23064 18.2429 6.07395 19.4212C6.81641 20.4607 9.16657 21.0231 10.6047 20.7484C12.6596 20.3537 13.4766 18.4077 13.2472 16.2549C12.9023 13.0352 10.7421 10.5065 8.65503 8.34506Z"
            fill="#FF8000"
          />
        </mask>
        <g mask="url(#mask0_0_1)">
          <path
            d="M35.6925 18.4311L23.6386 5.20482L-4.17421e-05 26.2862L12.0538 39.5125L35.6925 18.4311Z"
            fill="#FC6100"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_0_1">
          <rect width="19" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </div>
);
const LastActionsIcon = () => (
  <div style={{ paddingBottom: 20 }}>
    <svg
      width="177"
      height="33"
      viewBox="0 0 162 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4531 19.0938V23H0.875V0.453125H5.59375V19.0938H15.4531ZM24.3281 19.9688C25.3385 19.9688 26.1927 19.6771 26.8906 19.0938C27.599 18.5 27.9531 17.7552 27.9531 16.8594V15.6406L24.4219 15.8594C23.5677 15.9219 22.9062 16.1354 22.4375 16.5C21.9792 16.8646 21.75 17.3438 21.75 17.9375C21.75 18.5625 21.9844 19.0573 22.4531 19.4219C22.9219 19.7865 23.5469 19.9688 24.3281 19.9688ZM22.8281 23.2656C21.2135 23.2656 19.875 22.7917 18.8125 21.8438C17.75 20.8958 17.2188 19.6771 17.2188 18.1875C17.2188 16.6667 17.7812 15.474 18.9062 14.6094C20.0312 13.7448 21.6406 13.25 23.7344 13.125L27.9531 12.875V11.7656C27.9531 10.9948 27.6979 10.3906 27.1875 9.95312C26.6875 9.51562 26.0052 9.29688 25.1406 9.29688C24.3073 9.29688 23.625 9.48438 23.0938 9.85938C22.5729 10.2344 22.2552 10.7396 22.1406 11.375H17.9688C18.0521 9.72917 18.7552 8.40625 20.0781 7.40625C21.401 6.39583 23.1562 5.89062 25.3438 5.89062C27.4896 5.89062 29.2083 6.40104 30.5 7.42188C31.7917 8.44271 32.4375 9.79688 32.4375 11.4844V23H28.0312V20.4375H27.9375C27.4792 21.3125 26.7812 22.0052 25.8438 22.5156C24.9062 23.0156 23.901 23.2656 22.8281 23.2656ZM35.1094 11.1719C35.1094 9.57812 35.75 8.30208 37.0312 7.34375C38.3125 6.375 40.026 5.89062 42.1719 5.89062C44.2656 5.89062 45.9479 6.38021 47.2188 7.35938C48.4896 8.33854 49.1406 9.64062 49.1719 11.2656H44.9688C44.9167 10.5885 44.6354 10.0573 44.125 9.67188C43.625 9.28646 42.9531 9.09375 42.1094 9.09375C41.3177 9.09375 40.6823 9.26042 40.2031 9.59375C39.7344 9.91667 39.5 10.349 39.5 10.8906C39.5 11.7031 40.2292 12.2812 41.6875 12.625L44.8906 13.3125C46.5677 13.6875 47.7708 14.2344 48.5 14.9531C49.2396 15.6615 49.6094 16.6406 49.6094 17.8906C49.6094 19.5365 48.9219 20.8594 47.5469 21.8594C46.1719 22.8594 44.375 23.3594 42.1562 23.3594C39.9479 23.3594 38.1823 22.8698 36.8594 21.8906C35.5365 20.9115 34.8125 19.5938 34.6875 17.9375H39.1406C39.2552 18.6458 39.5781 19.1927 40.1094 19.5781C40.651 19.9635 41.375 20.1562 42.2812 20.1562C43.1458 20.1562 43.8229 20 44.3125 19.6875C44.8125 19.3646 45.0625 18.9271 45.0625 18.375C45.0625 17.9479 44.9062 17.6094 44.5938 17.3594C44.2812 17.099 43.75 16.8802 43 16.7031L39.9062 16.0156C36.7083 15.2865 35.1094 13.6719 35.1094 11.1719ZM53.1094 2.39062H57.6719V6.25H60.7656V9.6875H57.6719V17.7031C57.6719 18.9635 58.3281 19.5938 59.6406 19.5938C60.0677 19.5938 60.4375 19.5677 60.75 19.5156V22.875C60.2188 23 59.4948 23.0625 58.5781 23.0625C56.6094 23.0625 55.2031 22.7083 54.3594 22C53.526 21.2917 53.1094 20.1198 53.1094 18.4844V9.6875H50.75V6.25H53.1094V2.39062ZM75.2969 21.4844C76.724 21.4844 77.9271 21.0417 78.9062 20.1562C79.8854 19.2708 80.375 18.1823 80.375 16.8906V15.0938L75.5625 15.4219C74.2812 15.5052 73.2969 15.8177 72.6094 16.3594C71.9219 16.8906 71.5781 17.6042 71.5781 18.5C71.5781 19.3854 71.9219 20.1042 72.6094 20.6562C73.2969 21.2083 74.1927 21.4844 75.2969 21.4844ZM74.875 23.2656C73.2708 23.2656 71.9688 22.8281 70.9688 21.9531C69.9792 21.0677 69.4844 19.9167 69.4844 18.5C69.4844 17.1042 69.9844 16 70.9844 15.1875C71.9948 14.375 73.4375 13.9062 75.3125 13.7812L80.375 13.4688V12.0625C80.375 10.8854 80.0208 9.96875 79.3125 9.3125C78.6042 8.64583 77.6198 8.3125 76.3594 8.3125C75.1719 8.3125 74.2031 8.58854 73.4531 9.14062C72.7135 9.69271 72.2552 10.4635 72.0781 11.4531H70.0781C70.1927 9.97396 70.8177 8.77604 71.9531 7.85938C73.099 6.94271 74.5833 6.48438 76.4062 6.48438C78.2604 6.48438 79.7292 6.96875 80.8125 7.9375C81.8958 8.90625 82.4375 10.2188 82.4375 11.875V23H80.4688V19.9062H80.4219C79.974 20.9167 79.2396 21.7292 78.2188 22.3438C77.1979 22.9583 76.0833 23.2656 74.875 23.2656ZM99.125 11.8906H97.0938C96.8646 10.8385 96.3385 9.97917 95.5156 9.3125C94.7031 8.64583 93.6823 8.3125 92.4531 8.3125C90.8594 8.3125 89.5833 8.90625 88.625 10.0938C87.6771 11.2812 87.2031 12.875 87.2031 14.875C87.2031 16.8958 87.6823 18.4948 88.6406 19.6719C89.599 20.849 90.875 21.4375 92.4688 21.4375C93.6771 21.4375 94.6875 21.125 95.5 20.5C96.3229 19.875 96.8542 19.0312 97.0938 17.9688H99.1406C98.9115 19.5312 98.1823 20.8073 96.9531 21.7969C95.7344 22.776 94.2344 23.2656 92.4531 23.2656C90.224 23.2656 88.4375 22.5156 87.0938 21.0156C85.7604 19.5052 85.0938 17.4583 85.0938 14.875C85.0938 12.3229 85.7604 10.2865 87.0938 8.76562C88.4375 7.24479 90.2188 6.48438 92.4375 6.48438C94.2812 6.48438 95.8021 7.00521 97 8.04688C98.2083 9.08854 98.9167 10.3698 99.125 11.8906ZM102.609 2.6875H104.672V6.75H107.875V8.46875H104.672V18.9062C104.672 19.7396 104.844 20.349 105.188 20.7344C105.531 21.1094 106.078 21.2969 106.828 21.2969C107.411 21.2969 107.786 21.276 107.953 21.2344V23C107.661 23.0625 107.151 23.0938 106.422 23.0938C105.057 23.0938 104.078 22.7812 103.484 22.1562C102.901 21.5208 102.609 20.4688 102.609 19V8.46875H100.188V6.75H102.609V2.6875ZM110.953 23V6.75H113.016V23H110.953ZM111.984 3.46875C111.609 3.46875 111.286 3.33854 111.016 3.07812C110.745 2.80729 110.609 2.47917 110.609 2.09375C110.609 1.71875 110.745 1.40104 111.016 1.14062C111.286 0.869792 111.609 0.734375 111.984 0.734375C112.37 0.734375 112.698 0.869792 112.969 1.14062C113.24 1.40104 113.375 1.71875 113.375 2.09375C113.375 2.47917 113.24 2.80729 112.969 3.07812C112.698 3.33854 112.37 3.46875 111.984 3.46875ZM128.688 21C127.333 22.5104 125.542 23.2656 123.312 23.2656C121.083 23.2656 119.292 22.5104 117.938 21C116.583 19.4792 115.906 17.4375 115.906 14.875C115.906 12.3125 116.583 10.276 117.938 8.76562C119.302 7.24479 121.094 6.48438 123.312 6.48438C125.542 6.48438 127.333 7.24479 128.688 8.76562C130.042 10.276 130.719 12.3125 130.719 14.875C130.719 17.4375 130.042 19.4792 128.688 21ZM119.453 19.6875C120.411 20.8542 121.698 21.4375 123.312 21.4375C124.927 21.4375 126.214 20.8542 127.172 19.6875C128.141 18.5208 128.625 16.9167 128.625 14.875C128.625 12.8333 128.141 11.2292 127.172 10.0625C126.214 8.89583 124.927 8.3125 123.312 8.3125C121.698 8.3125 120.411 8.89583 119.453 10.0625C118.495 11.2292 118.016 12.8333 118.016 14.875C118.016 16.9167 118.495 18.5208 119.453 19.6875ZM133.469 23V6.75H135.422V9.75H135.469C135.896 8.73958 136.573 7.94271 137.5 7.35938C138.438 6.77604 139.547 6.48438 140.828 6.48438C142.609 6.48438 144.01 7.02083 145.031 8.09375C146.062 9.16667 146.578 10.625 146.578 12.4688V23H144.516V12.7969C144.516 11.3802 144.141 10.2812 143.391 9.5C142.651 8.71875 141.599 8.32812 140.234 8.32812C138.828 8.32812 137.693 8.79167 136.828 9.71875C135.964 10.6458 135.531 11.8646 135.531 13.375V23H133.469ZM149.734 11.0938C149.734 9.75 150.276 8.64583 151.359 7.78125C152.453 6.91667 153.859 6.48438 155.578 6.48438C157.234 6.48438 158.604 6.93229 159.688 7.82812C160.781 8.71354 161.38 9.86979 161.484 11.2969H159.5C159.375 10.3281 158.958 9.56771 158.25 9.01562C157.552 8.46354 156.641 8.1875 155.516 8.1875C154.411 8.1875 153.51 8.45312 152.812 8.98438C152.125 9.50521 151.781 10.1719 151.781 10.9844C151.781 11.651 152.031 12.1979 152.531 12.625C153.031 13.0417 153.823 13.3854 154.906 13.6562L157.312 14.2344C158.938 14.6406 160.089 15.1719 160.766 15.8281C161.443 16.4844 161.781 17.3958 161.781 18.5625C161.781 19.9375 161.198 21.0677 160.031 21.9531C158.865 22.8281 157.365 23.2656 155.531 23.2656C153.792 23.2656 152.344 22.8229 151.188 21.9375C150.042 21.0521 149.401 19.8906 149.266 18.4531H151.328C151.474 19.4219 151.927 20.1823 152.688 20.7344C153.458 21.2865 154.448 21.5625 155.656 21.5625C156.875 21.5625 157.854 21.3021 158.594 20.7812C159.333 20.2604 159.703 19.5729 159.703 18.7188C159.703 18.0104 159.474 17.4531 159.016 17.0469C158.568 16.6302 157.802 16.2917 156.719 16.0312L154.078 15.375C152.609 15.0104 151.516 14.4792 150.797 13.7812C150.089 13.0729 149.734 12.1771 149.734 11.0938Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

add(() => {
  const [hotTokens, isHotTokensLoading] = useHotTokenPairs();

  return (
    <div>
      <div className="bu-columns">
        <div className="bu-column bu-is-5">
          <div>
            <HotIcon />
          </div>

          {isHotTokensLoading ? (
            <div>
              Loading hottest pairs...
              <span className="spinner-grow spinner-grow-sm m-r-4" />
            </div>
          ) : hotTokens && hotTokens.length ? (
            hotTokens.map(
              (
                { _id: { base_address, base_symbol, quote_address, quote_symbol }, count, price },
                index,
              ) => (
                <Link to={`/${base_address}?quote=${quote_address}`}>
                  <HotPairCard
                    large={index < 3}
                    count={count}
                    price={
                      price < 100
                        ? Math.round(price * 10000000) / 10000000
                        : Math.round(price * 100) / 100
                    }
                    quote_symbol={quote_symbol}
                    base_symbol={base_symbol}
                  />
                </Link>
              ),
            )
          ) : (
            'No token trades in last 24 hr'
          )}
        </div>
        <div className="bu-column bu-is-7">
          <LastActionsIcon />
          <DashboardCard size="large" subcard style={{ padding: 0 }}>
            <ImportantActions />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
});
