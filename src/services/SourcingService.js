import cheerio from 'cheerio';
import fetch from 'node-fetch';

export class SourcingService {
  detectSourceType(url) {
    if (url.includes('1688.com')) return '1688';
    if (url.includes('taobao.com')) return 'taobao';
    if (url.includes('weidian.com')) return 'weidian';
    if (url.includes('tmall.com')) return 'tmall';
    if (url.includes('superbuy.com') || url.includes('cssbuy.com') || url.includes('sugargoo.com') || url.includes('basetao.com') || url.includes('yoybuy.com') || url.includes('bhiner.com')) {
      return 'agent';
    }
    return 'unknown';
  }

  buildAgentUrl(sourceUrl, agentName) {
    const encodedUrl = encodeURIComponent(sourceUrl);
    switch (agentName.toLowerCase()) {
      case 'superbuy':
        return `https://www.superbuy.com/en/page/buy/?url=${encodedUrl}`;
      case 'cssbuy':
        return `https://www.cssbuy.com/item.html?url=${encodedUrl}`;
      case 'sugargoo':
        return `https://www.sugargoo.com/#/home/productDetail?productLink=${encodedUrl}`;
      case 'basetao':
        return `https://www.basetao.com/?agent=basetao&url=${encodedUrl}`;
      case 'yoybuy':
        return `https://www.yoybuy.com/buy?url=${encodedUrl}`;
      case 'bhiner':
        return `https://www.bhiner.com/quotation/search?url=${encodedUrl}`;
      default:
        return sourceUrl;
    }
  }

  async fetchProductInfo(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept-Language': 'zh-CN,zh;q=0.9',
        }
      });
      const html = await response.text();
      const $ = cheerio.load(html);

      let title = '';
      let images = [];
      let priceRmb = null;

      const sourceType = this.detectSourceType(url);
      
      if (sourceType === '1688') {
        title = $('.mod-detail-title .title-text').text().trim() || $('title').text();
        $('.img-gallery img, .detail-gallery-img').each((i, el) => {
          if ($(el).attr('src')) images.push($(el).attr('src'));
        });
      } else if (sourceType === 'taobao' || sourceType === 'tmall') {
        title = $('#J_Title').text().trim() || $('title').text();
        $('#J_UlThumb img').each((i, el) => {
          if ($(el).attr('src')) images.push($(el).attr('src'));
        });
      } else {
        title = $('title').text().trim();
      }

      return {
        title,
        images: [...new Set(images)], // Unique images
        priceRmb,
        variants: [],
        supplierName: null
      };
    } catch (error) {
      console.error("fetchProductInfo error:", error);
      return {
        title: '',
        images: [],
        priceRmb: null,
        variants: [],
        supplierName: null
      };
    }
  }

  convertPrice(rmb) {
    const rate = parseFloat(process.env.RMB_TO_USD_RATE || '0.138');
    return rmb * rate;
  }

  suggestSellingPrice(costRmb, marginPercent = 40) {
    const costUsd = this.convertPrice(costRmb);
    return Math.ceil(costUsd * (1 + marginPercent / 100) * 100) / 100;
  }
}

export const sourcingService = new SourcingService();
