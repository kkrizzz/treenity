import React from 'react';

import './menuMarkup.scss'
import { Icon } from '../../components/Icon';

type Props = {}

export function MenuMarkup({}: Props) {
    return (
          <div className="menu-markup">
              <ul className="menu-markup-list">
                  <li>
                      <button className="btn btn-menu-markup" title="Menu">
                          <Icon name="burger2" />
                      </button>
                  </li>
                  <li>
                      <button className="btn btn-menu-markup" title="Reload">
                          <Icon name="reload" />
                      </button>
                  </li>
                  <li>
                      <button className="btn btn-menu-markup" title="Save">
                          <Icon name="save" />
                      </button>
                  </li>
                  <li>
                      <button className="btn btn-menu-markup" title="Start">
                          <Icon name="play" />
                      </button>
                  </li>
                  <li>
                      <button className="btn btn-menu-markup" title="Start">
                          <Icon name="rewind" />
                      </button>
                  </li>
              </ul>
              <ul className="menu-markup-list-sub">
                  <li>
                      <button className="btn btn-menu-markup" title="Information">
                          <Icon name="info" />
                      </button>
                  </li>
                  <li>
                      <button className="btn btn-menu-markup" title="Settings">
                          <Icon name="settings" />
                      </button>
                  </li>
              </ul>
          </div>
    );
}
