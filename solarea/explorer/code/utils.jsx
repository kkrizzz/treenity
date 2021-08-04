const LPS = 0.000000001;

exports.lpsRound = (lamports, digits = 4) => {
  return (lamports * LPS).toFixed(digits);
};

exports.numberWithSpaces = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
.*
    <\\/span>
  <\\/td>
<\\/tr>`);
