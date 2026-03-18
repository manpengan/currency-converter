const { CURRENCIES, getPickerData } = require('../../utils/currencies');
const { getRates, convert, formatAmount, formatRate } = require('../../utils/rate');

const pickerData = getPickerData();
const DEFAULT_FROM = 0;  // CNY
const DEFAULT_TO = 1;    // USD

Page({
  data: {
    pickerData,
    fromIndex: DEFAULT_FROM,
    toIndex: DEFAULT_TO,
    amount: '100',
    result: '',
    unitRate: '',
    reverseRate: '',
    updatedAt: '',
    loading: true,
    error: '',
    rates: null,
    baseCurrency: 'CNY',
  },

  onLoad() {
    this.loadRates();
  },

  onPullDownRefresh() {
    this.loadRates().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadRates() {
    this.setData({ loading: true, error: '' });
    try {
      const { rates, updatedAt } = await getRates('CNY');
      this.setData({
        rates,
        baseCurrency: 'CNY',
        updatedAt,
        loading: false,
      });
      this.calculate();
    } catch (e) {
      this.setData({
        loading: false,
        error: '汇率获取失败，请检查网络后下拉刷新',
      });
    }
  },

  calculate() {
    const { rates, fromIndex, toIndex, amount, baseCurrency } = this.data;
    if (!rates) return;

    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      this.setData({ result: '', unitRate: '', reverseRate: '' });
      return;
    }

    const fromCode = CURRENCIES[fromIndex].code;
    const toCode = CURRENCIES[toIndex].code;
    const converted = convert(num, fromCode, toCode, rates);
    const unitForward = convert(1, fromCode, toCode, rates);
    const unitReverse = convert(1, toCode, fromCode, rates);

    this.setData({
      result: formatAmount(converted, toCode),
      unitRate: `1 ${fromCode} = ${formatRate(unitForward)} ${toCode}`,
      reverseRate: `1 ${toCode} = ${formatRate(unitReverse)} ${fromCode}`,
    });
  },

  handleAmountInput(e) {
    const value = e.detail.value;
    this.setData({ amount: value });
    this.calculate();
  },

  handleFromChange(e) {
    this.setData({ fromIndex: Number(e.detail.value) });
    this.calculate();
  },

  handleToChange(e) {
    this.setData({ toIndex: Number(e.detail.value) });
    this.calculate();
  },

  handleSwap() {
    const { fromIndex, toIndex } = this.data;
    this.setData({
      fromIndex: toIndex,
      toIndex: fromIndex,
    });
    this.calculate();
  },

  goOverview() {
    wx.navigateTo({
      url: '/pages/overview/overview',
    });
  },
});
