class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const Names = {
  LEGENDARY_ITEM: "Sulfuras, Hand of Ragnaros",
  AGED_BRIE: "Aged Brie",
  BACKSTAGE_PASSES: "Backstage passes to a TAFKAL80ETC concert",
  CONJURED: "Conjured",
};

const Quality = {
  MAX: 50,
  MIN: 0,
};

const Constants = {
  EXPIRY_DATE: -1,
  DEFAULT_DEGRADATION_DELTA: -1,
  DEFAULT_IMPROVEMENT_DELTA: 1,
  CONJURED_DEGRADATION_MULTIPLIER: 2,
  LEGENDARY_QUALITY: 80,
};

class Shop {
  constructor(items = []) {
    this.items = items;
  }

  updateItem(item) {
    const sellIn = this.updateSellIn(item);
    const quality = this.updateItemQuality(item, sellIn);

    return new Item(item.name, sellIn, quality);
  }

  updateItemQuality(item, sellIn) {
    const name = this.getName(item.name);
    switch (name) {
      case Names.LEGENDARY_ITEM:
        return this.updateLegendaryQuality();
      case Names.AGED_BRIE:
        return this.updateBrieQuality(item.quality, sellIn);
      case Names.BACKSTAGE_PASSES:
        return this.updateBackstageQuality(item.quality, sellIn);
      case Names.CONJURED:
        return this.updateConjuredQuality(item.quality, sellIn);
      default:
        return this.updateRegularQuality(item.quality, sellIn);
    }
  }

  updateLegendaryQuality() {
    return Constants.LEGENDARY_QUALITY;
  }

  updateBrieQuality(quality, sellIn) {
    const newQuality = this.itemIsExpired(sellIn)
      ? quality + Constants.DEFAULT_IMPROVEMENT_DELTA * 2
      : quality + Constants.DEFAULT_IMPROVEMENT_DELTA;
    return Math.min(newQuality, Quality.MAX);
  }

  updateBackstageQuality(quality, sellIn) {
    if (sellIn < 0) {
      return 0;
    }
    if (sellIn <= 5) {
      return Math.min(quality + 3, Quality.MAX);
    }
    if (sellIn <= 10) {
      return Math.min(quality + 2, Quality.MAX);
    }
    return Math.min(quality + 1, Quality.MAX);
  }

  updateConjuredQuality(quality, sellIn) {
    const newQuality = this.itemIsExpired(sellIn)
      ? quality + Constants.DEFAULT_DEGRADATION_DELTA * 2 * Constants.CONJURED_DEGRADATION_MULTIPLIER
      : quality + Constants.DEFAULT_DEGRADATION_DELTA * Constants.CONJURED_DEGRADATION_MULTIPLIER;
    return Math.max(newQuality, Quality.MIN);
  }

  updateRegularQuality(quality, sellIn) {
    const newQuality = this.itemIsExpired(sellIn)
      ? quality + Constants.DEFAULT_DEGRADATION_DELTA * 2
      : quality + Constants.DEFAULT_DEGRADATION_DELTA;
    return Math.max(newQuality, Quality.MIN);
  }

  itemIsExpired(sellIn) {
    if (sellIn <= Constants.EXPIRY_DATE) {
      return true;
    }
    return false;
  }

  getName(name) {
    if (name.startsWith(Names.CONJURED)) {
      return Names.CONJURED;
    }
    return name;
  }

  isPastSellDate(sellIn) {
    return sellIn <= Constants.PAST_SELL_DATE;
  }

  updateSellIn(item) {
    switch (item.name) {
      case Names.LEGENDARY_ITEM:
        return item.sellIn;
      default:
        return item.sellIn - 1;
    }
  }

  updateQuality() {
    this.items = this.items.map((item) => {
      return this.updateItem(item);
    });
    return this.items;
  }
}

module.exports = {
  Item,
  Shop,
};
