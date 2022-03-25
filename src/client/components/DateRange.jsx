import * as React from 'react';
import { useState } from 'react';
import { DateRange } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const now = new Date();
const yes = new Date();
yes.setDate(yes.getDate() - 1);

export default function () {
  const [state, setState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
      autoFocus: false,
    },
  });

  console.log(state);

  const onChange = (item) => {
    console.log(item);
    setState({
      ...state,
      ...item,
    });
  };
  return (
    <DateRange
      editableDateInputs={true}
      onChange={onChange}
      moveRangeOnFirstSelection={false}
      ranges={Object.values(state)}
    />
  );
}
