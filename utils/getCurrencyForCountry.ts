import currencyCodes from 'currency-codes';

export function getCurrencyForCountry(countryCode: string): string | undefined {
  const currencies = currencyCodes.data;
  const matched = currencies.find(curr => curr.countries?.includes(countryCode));
  return matched?.code;
}