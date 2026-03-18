/**
 * 汇率 API 调用 + 本地缓存
 * 数据源：https://open.er-api.com/v6/latest/{base}
 * 免费，无需 key，每日更新，1500 次/月
 */

const CACHE_KEY = 'exchange_rates';
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 小时

function getCache() {
  try {
    const data = wx.getStorageSync(CACHE_KEY);
    if (!data) return null;
    return data;
  } catch (e) {
    return null;
  }
}

function setCache(data) {
  try {
    wx.setStorageSync(CACHE_KEY, data);
  } catch (e) {
    console.warn('cache write failed', e);
  }
}

function isCacheValid(cache, base) {
  if (!cache || !cache.rates || !cache.timestamp) return false;
  if (cache.base !== base) return false;
  return Date.now() - cache.timestamp < CACHE_TTL;
}

function fetchRates(base) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://open.er-api.com/v6/latest/${base}`,
      method: 'GET',
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.result === 'success') {
          resolve(res.data.rates);
        } else {
          reject(new Error('API 返回异常'));
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

async function getRates(base) {
  const cache = getCache();

  if (isCacheValid(cache, base)) {
    return {
      rates: cache.rates,
      updatedAt: cache.updatedAt,
      fromCache: true,
    };
  }

  try {
    const rates = await fetchRates(base);
    const now = new Date();
    const cacheData = {
      base,
      rates,
      timestamp: now.getTime(),
      updatedAt: formatTime(now),
    };
    setCache(cacheData);
    return {
      rates,
      updatedAt: cacheData.updatedAt,
      fromCache: false,
    };
  } catch (e) {
    // API 失败时用过期缓存兜底
    if (cache && cache.rates) {
      return {
        rates: cache.rates,
        updatedAt: cache.updatedAt + '（缓存）',
        fromCache: true,
      };
    }
    throw e;
  }
}

function convert(amount, fromCode, toCode, rates) {
  if (!rates || !rates[fromCode] || !rates[toCode]) return 0;
  if (fromCode === toCode) return amount;
  return (amount / rates[fromCode]) * rates[toCode];
}

function formatAmount(value, code) {
  // 日元、韩元、越南盾、印尼盾等无小数货币
  const noDecimal = ['JPY', 'KRW', 'VND', 'IDR'];
  if (noDecimal.includes(code)) {
    return Math.round(value).toLocaleString('en-US');
  }
  return Number(value.toFixed(2)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatRate(value) {
  if (value >= 100) return value.toFixed(2);
  if (value >= 1) return value.toFixed(4);
  return value.toFixed(6);
}

function formatTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

module.exports = {
  getRates,
  convert,
  formatAmount,
  formatRate,
};
