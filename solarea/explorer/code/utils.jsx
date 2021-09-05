const LPS = 0.000000001;

exports.lpsRound = (lamports, digits = 4) => {
  return (lamports * LPS).toFixed(digits);
};

const digRe = /^[\d\.]{3,31}$/;
const replaceRe = /(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g;
exports.numberWithSpaces = (x) => {
  if (typeof x === 'number' || (typeof x === 'string' && digRe.test(x))) {
    return String(x).replace(replaceRe, '$1,');
  }
  return x;
};

const { BigNumber } = await require('solarea://explorer/bignumber');
const WEI_IN_ETH = new BigNumber(10).pow(18);
exports.weiToEth = (valueString, prec = 18) => {
  const value =
    typeof valueString === 'string' && valueString.startsWith('0x')
      ? parseInt(valueString, 16)
      : parseInt(valueString, 10);
  let eth = new BigNumber(value, 18).divide(WEI_IN_ETH).toString();
  const point = eth.indexOf('.');
  prec += 1;
  if (eth.length - point > prec) {
    eth = eth.slice(0, eth.length - point - prec);
  }
  return eth;
};

exports.tokenRegExp = new RegExp(`  <td class="stakes-td">
      <!-- incremented number by order in the list -->
      <span class="color-lighten">
.*
      <\\/span>
  <\\/td>
  <td class="stakes-td">

<a class="text-truncate" data-test="token_link" href="\\/tokens\\/.*">(.*)<\\/a>
  <\\/td>
  <td class="stakes-td">

<a data-test="address_hash_link" href="\\/address\\/(.*)">
<span class="contract-address" data-address-hash=".*">


      <span class="d-none d-md-none d-xl-inline">.*<\\/span>
      <span class="d-md-inline-block d-xl-none">.*<\\/span>


<\\/span>

<\\/a>

  <\\/td>

  <td class="stakes-td">

      <span data-test="token_supply">(.*)<\\/span>
 .*
  <\\/td>
  <td class="stakes-td">
    <span class="mr-4">
      <span data-test="transaction_count">
(.*)
    <\\/span>
  <\\/td>
<\\/tr>`);
