const { CURRENCIES, getPickerData } = require('../../utils/currencies');
const { getRates, convert, formatAmount, formatRate } = require('../../utils/rate');

const pickerData = getPickerData();
const DEFAULT_FROM = 0;
const DEFAULT_TO = 1;

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
    // picker state
    showPicker: false,
    pickerTarget: '',  // 'from' or 'to'
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
      this.setData({ rates, baseCurrency: 'CNY', updatedAt, loading: false });
      this.calculate();
    } catch (e) {
      this.setData({ loading: false, error: '汇率获取失败，请下拉刷新重试' });
    }
  },

  calculate() {
    const { rates, fromIndex, toIndex, amount } = this.data;
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
    this.setData({ amount: e.detail.value });
    this.calculate();
  },

  openFromPicker() {
    this.setData({ showPicker: true, pickerTarget: 'from' });
  },

  openToPicker() {
    this.setData({ showPicker: true, pickerTarget: 'to' });
  },

  handlePickerSelect(e) {
    const index = e.detail.value;
    if (this.data.pickerTarget === 'from') {
      this.setData({ fromIndex: index, showPicker: false });
    } else {
      this.setData({ toIndex: index, showPicker: false });
    }
    this.calculate();
  },

  handlePickerClose() {
    this.setData({ showPicker: false });
  },

  handleSwap() {
    const { fromIndex, toIndex } = this.data;
    this.setData({ fromIndex: toIndex, toIndex: fromIndex });
    this.calculate();
  },

  goOverview() {
    wx.navigateTo({ url: '/pages/overview/overview' });
  },
});
