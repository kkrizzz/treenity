import React from 'react';
import { addComponent } from '../component-db';

addComponent('default', 'default', 'react', {}, () => (
  <div>
    <p>
      This is the default view. Want to <a
      href="?edit=true"
      style={{ color: '#104378', textDecoration: 'underline' }}>customize?</a>
    </p>
  </div>
));
