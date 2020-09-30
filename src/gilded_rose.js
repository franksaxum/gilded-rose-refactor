class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const Names = {
  REGULAR: "Elixir of the Mongoose",
  LEGENDARY_ITEM: "Sulfuras, Hand of Ragnaros",
  AGED_BRIE: "Aged Brie",
  BACKSTAGE_PASSES: "Backstage passes to a TAFKAL80ETC concert",
  CONJURED: "Conjured",
};

const Quality = {
  MAX: 50,
  MIN: 0,
};

const Dates = {
  EXPIRY: -1,
};

const Legendary = {
  QUALITY: 80,
};

const Deltas = {
  DEFAULT_DEGRADE: -1,
  DEFAULT_IMPROVE: 1,
  CONJURED_DEGRADE: 2,
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
    return Legendary.QUALITY;
  }

  updateBrieQuality(quality, sellIn) {
    const newQuality = this.itemIsExpired(sellIn)
      ? quality + Deltas.DEFAULT_IMPROVE * 2
      : quality + Deltas.DEFAULT_IMPROVE;
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
      ? quality + Deltas.CONJURED_DEGRADE * 2
      : quality + Deltas.CONJURED_DEGRADE;
    return Math.max(newQuality, Quality.MIN);
  }

  updateRegularQuality(quality, sellIn) {
    const newQuality = this.itemIsExpired(sellIn)
      ? quality + Deltas.DEFAULT_DEGRADE * 2
      : quality + Deltas.DEFAULT_DEGRADE;
    return Math.max(newQuality, Quality.MIN);
  }

  itemIsExpired(sellIn) {
    if (sellIn <= Dates.EXPIRY) {
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
    return sellIn <= Dates.EXPIRY;
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
  Names,
  Quality,
  Dates,
  Legendary,
  Deltas,
};
