const formatToCurrency = (amout) => amout.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
export default formatToCurrency;
