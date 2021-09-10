import React from 'react';
import { codeLoaderHook } from './useLoadCodeComponent';
import Render from './Render';

export const RenderCode = (props) => Render({ ...props, loaderHook: codeLoaderHook });
