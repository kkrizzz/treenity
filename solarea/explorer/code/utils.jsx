const LPS = 0.000000001;

exports.lpsRound = (lamports, digits = 4) => {
  return (lamports * LPS).toFixed(digits);
};
