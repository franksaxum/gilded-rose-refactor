class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const Constants = {
  MAX_QUALITY: 50,
  MIN_QUALITY: 0,
  PAST_SELL_DATE: -1,
  REGULAR_ITEM: "Elixir of the Mongoose",
  LEGENDARY_ITEM: "Sulfuras, Hand of Ragnaros",
  AGED_BRIE: "Aged Brie",
  BACKSTAGE_PASSES: "Backstage passes to a TAFKAL80ETC concert",
  DEFAULT_DEGRADATION_DELTA: 1,
  CONJURED_DEGRADATION_MULTIPLIER: 2,
};

class Shop {
  static doubleDegradationDelta = Constants.DEFAULT_DEGRADATION_DELTA * 2;
  static qualityImprovingItems = [
    Constants.AGED_BRIE,
    Constants.BACKSTAGE_PASSES,
  ];
  constructor(items = []) {
    this.items = items;
  }

  updateItem(item) {
    if (item.name === Constants.LEGENDARY_ITEM) {
      return new Item(item.name, item.sellIn, item.quality);
    }
    const sellIn = this.updateSellIn(item.sellIn);
    const quality = this.updateItemQuality(item);

    return new Item(item.name, sellIn, quality);
  }

  updateItemQuality(item) {
    const delta = this.isQualityImprovingItem(item)
      ? this.getQualityImprovementDelta(item)
      : -this.getDegradationDelta(item);
    const newQuality = item.quality + delta;

    if (this.qualityIsBiggerThanMax(newQuality)) {
      return Constants.MAX_QUALITY;
    }
    if (this.qualityIsSmallerThanMin(newQuality)) {
      return Constants.MIN_QUALITY;
    }
    return newQuality;
  }

  getDegradationDelta(item) {
    const {
      DEFAULT_DEGRADATION_DELTA,
      CONJURED_DEGRADATION_MULTIPLIER,
    } = Constants;
    const isConjured = this.isConjuredItem(item.name);

    if (this.isPastSellDate(item)) {
      if (isConjured) {
        return Shop.doubleDegradationDelta * CONJURED_DEGRADATION_MULTIPLIER;
      }
      return Shop.doubleDegradationDelta;
    }

    return isConjured
      ? DEFAULT_DEGRADATION_DELTA * CONJURED_DEGRADATION_MULTIPLIER
      : DEFAULT_DEGRADATION_DELTA;
  }

  getQualityImprovementDelta(item) {
    const {
      AGED_BRIE,
      MIN_QUALITY,
      PAST_SELL_DATE,
      BACKSTAGE_PASSES,
      DEFAULT_DEGRADATION_DELTA,
    } = Constants;
    const { name, sellIn } = item;

    if (name === AGED_BRIE) {
      if (this.isPastSellDate(item)) {
        return Shop.doubleDegradationDelta;
      }
      return DEFAULT_DEGRADATION_DELTA;
    }

    if (name === BACKSTAGE_PASSES) {
      if (sellIn > 10) {
        return 1;
      }

      if (sellIn <= 10 && sellIn > 5) {
        return 2;
      }

      if (sellIn <= 5 && sellIn > PAST_SELL_DATE) {
        return 3;
      }

      if (this.isPastSellDate(sellIn)) {
        return MIN_QUALITY;
      }
    }
  }

  isQualityImprovingItem(item) {
    return Shop.qualityImprovingItems.includes(item.name);
  }

  qualityIsBiggerThanMax(quality) {
    if (quality > Constants.MAX_QUALITY) {
      return true;
    }
    false;
  }

  qualityIsSmallerThanMin(quality) {
    if (quality < Constants.MIN_QUALITY) {
      return true;
    }
    false;
  }

  isPastSellDate(sellIn) {
    return sellIn <= Constants.PAST_SELL_DATE;
  }

  isConjuredItem(name) {
    if (name.startsWith("Conjured")) {
      return true;
    }
    return false;
  }

  updateSellIn(sellIn) {
    return sellIn - 1;
  }

  updateQuality() {
    return this.items.map((item) => {
      return this.updateItem(item);
    });
  }
}

module.exports = {
  Item,
  Shop,
};
