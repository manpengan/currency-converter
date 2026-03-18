const { CURRENCIES, getPickerData } = require('../../utils/currencies');
const { getRates, convert, formatAmount, formatRate } = require('../../utils/rate');

const pickerData = getPickerData();

Page({
  data: {
    pickerData,
    baseIndex: 0, // CNY
    amount: '100',
    list: [],
    updatedAt: '',
    loading: true,
    error: '',
    rates: null,
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
      const baseCode = CURRENCIES[this.data.baseIndex].code;
      const { rates, updatedAt } = await getRates(baseCode);
      this.setData({
        rates,
        updatedAt,
        loading: false,
      });
      this.buildList();
    } catch (e) {
      this.setData({
        loading: false,
        error: '汇率获取失败，请检查网络后下拉刷新',
      });
    }
  },

  buildList() {
    const { rates, baseIndex, amount } = this.data;
    if (!rates) return;

    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      this.setData({ list: [] });
      return;
    }

    const baseCode = CURRENCIES[baseIndex].code;
    const list = CURRENCIES
      .filter((c) => c.code !== baseCode)
      .map((c) => {
        const converted = convert(num, baseCode, c.code, rates);
        const unitRate = convert(1, baseCode, c.code, rates);
        return {
          flag: c.flag,
          code: c.code,
          name: c.name,
          converted: formatAmount(converted, c.code),
          unitRate: formatRate(unitRate),
        };
      });

    this.setData({ list });
  },

  handleBaseChange(e) {
    this.setData({ baseIndex: Number(e.detail.value) });
    this.loadRates();
  },

  handleAmountInput(e) {
    this.setData({ amount: e.detail.value });
    this.buildList();
  },
});
