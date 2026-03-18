/**
 * 主流货币配置（约 30 种）
 * flag: emoji 国旗
 * code: ISO 4217 货币代码
 * name: 中文名
 */
const CURRENCIES = [
  { flag: '🇨🇳', code: 'CNY', name: '人民币' },
  { flag: '🇺🇸', code: 'USD', name: '美元' },
  { flag: '🇪🇺', code: 'EUR', name: '欧元' },
  { flag: '🇬🇧', code: 'GBP', name: '英镑' },
  { flag: '🇯🇵', code: 'JPY', name: '日元' },
  { flag: '🇰🇷', code: 'KRW', name: '韩元' },
  { flag: '🇭🇰', code: 'HKD', name: '港币' },
  { flag: '🇹🇼', code: 'TWD', name: '新台币' },
  { flag: '🇲🇴', code: 'MOP', name: '澳门元' },
  { flag: '🇸🇬', code: 'SGD', name: '新加坡元' },
  { flag: '🇦🇺', code: 'AUD', name: '澳元' },
  { flag: '🇨🇦', code: 'CAD', name: '加元' },
  { flag: '🇳🇿', code: 'NZD', name: '新西兰元' },
  { flag: '🇹🇭', code: 'THB', name: '泰铢' },
  { flag: '🇲🇾', code: 'MYR', name: '马来西亚林吉特' },
  { flag: '🇵🇭', code: 'PHP', name: '菲律宾比索' },
  { flag: '🇮🇩', code: 'IDR', name: '印尼盾' },
  { flag: '🇻🇳', code: 'VND', name: '越南盾' },
  { flag: '🇮🇳', code: 'INR', name: '印度卢比' },
  { flag: '🇷🇺', code: 'RUB', name: '俄罗斯卢布' },
  { flag: '🇧🇷', code: 'BRL', name: '巴西雷亚尔' },
  { flag: '🇲🇽', code: 'MXN', name: '墨西哥比索' },
  { flag: '🇿🇦', code: 'ZAR', name: '南非兰特' },
  { flag: '🇹🇷', code: 'TRY', name: '土耳其里拉' },
  { flag: '🇸🇦', code: 'SAR', name: '沙特里亚尔' },
  { flag: '🇦🇪', code: 'AED', name: '阿联酋迪拉姆' },
  { flag: '🇨🇭', code: 'CHF', name: '瑞士法郎' },
  { flag: '🇸🇪', code: 'SEK', name: '瑞典克朗' },
  { flag: '🇩🇰', code: 'DKK', name: '丹麦克朗' },
  { flag: '🇳🇴', code: 'NOK', name: '挪威克朗' },
];

const CURRENCY_MAP = {};
CURRENCIES.forEach((c) => {
  CURRENCY_MAP[c.code] = c;
});

function getCurrency(code) {
  return CURRENCY_MAP[code] || null;
}

function getCurrencyLabel(code) {
  const c = CURRENCY_MAP[code];
  if (!c) return code;
  return `${c.flag} ${c.code} ${c.name}`;
}

function getPickerData() {
  return CURRENCIES.map((c) => `${c.flag} ${c.code} ${c.name}`);
}

module.exports = {
  CURRENCIES,
  CURRENCY_MAP,
  getCurrency,
  getCurrencyLabel,
  getPickerData,
};
