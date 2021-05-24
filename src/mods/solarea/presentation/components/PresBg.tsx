import React, { useLayoutEffect } from 'react';

import './pres-bg.scss';

type Props = {};

export function PresBg({}: Props) {
  useLayoutEffect(() => {
    (() => {
      const box = document.querySelector('.sol-pres-bg');
      setInterval(function () {
        let rand1 = Math.floor(Math.random() * 1000);
        let rand2 = Math.floor(Math.random() * 1000);

        const ball = document.querySelector('.sol-pres-bg__b');
        if (rand1 >= box.clientWidth) {
          rand1 = box.clientWidth - 480;
        }
        if (rand2 >= box.clientHeight) {
          rand2 = box.clientHeight - 480;
        }
        ball.style.right = rand1 + 'px';
        ball.style.top = rand2 + 'px';
      }, 5000);
      setInterval(function () {
        let rand3 = Math.floor(Math.random() * 1000);
        let rand4 = Math.floor(Math.random() * 1000);

        const ball2 = document.querySelector('.sol-pres-bg__m');
        if (rand3 >= box.clientWidth) {
          rand3 = box.clientWidth - 460;
        }
        if (rand4 >= box.clientHeight) {
          rand4 = box.clientHeight - 460;
        }
        ball2.style.left = rand3 + 'px';
        ball2.style.top = rand4 + 'px';
      }, 10000);
      setInterval(function () {
        let rand5 = Math.floor(Math.random() * 1000);
        let rand6 = Math.floor(Math.random() * 1000);

        const ball3 = document.querySelector('.sol-pres-bg__s');
        if (rand5 >= box.clientWidth) {
          rand5 = box.clientWidth - 170;
        }
        if (rand6 >= box.clientHeight) {
          rand6 = box.clientHeight - 170;
        }
        ball3.style.right = rand5 + 'px';
        ball3.style.top = rand6 + 'px';
      }, 7500);
    })();
  });

  return (
    <div className="sol-pres-bg">
      <img
        src="/img/presentation/ball-b.png"
        className="sol-pres-bg__b animate"
        id="dot"
        alt="balloon big"
      />
      <img
        src="/img/presentation/ball-b.png"
        className="sol-pres-bg__m animate"
        alt="balloon middle"
      />
      <img
        src="/img/presentation/ball-b.png"
        className="sol-pres-bg__s animate"
        alt="balloon small"
      />
    </div>
  );
}
