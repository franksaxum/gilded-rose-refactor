class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  maxQuality = 50;
  normalItemName = "Elixir of the Mongoose";
  legendaryItemName = "Sulfuras, Hand of Ragnaros";
  agedBrieName = "Aged Brie";
  backstagePassesName = "Backstage passes to a TAFKAL80ETC concert";

  constructor(items = []) {
    this.items = items;
  }

  handleBackstagePassesQuality(sellIn, quality) {
    if (sellIn < 0) {
      return 0;
    }
    if (sellIn <= 5) {
      return quality + 3;
    }
    if (sellIn <= 10) {
      return quality + 2;
    }
    return quality + 1;
  }

  updateQuality() {
    return this.items.map((item) => {
      const { sellIn, quality } = item;

      if (item.name === this.legendaryItemName) {
        return item;
      }

      item.sellIn = item.sellIn - 1;

      if (item.name === this.backstagePassesName) {
        item.quality =
          this.handleBackstagePassesQuality(sellIn, quality) > maxQuality
            ? maxQuality
            : this.handleBackstagePassesQuality(sellIn, quality);
        return item;
      }

      if (item.name === this.agedBrieName) {
        item.quality =
          item.quality + 1 > maxQuality ? maxQuality : item.quality + 1;
        return item;
      }

      if (item.sellIn < 0 || item.name.startsWith("Conjured")) {
        item.quality = item.quality - 2 < 0 ? item.quality : item.quality - 2;
        return item;
      }

      item.quality = item.quality - 1 < 0 ? item.quality : item.quality - 1;
      return item;
    });
  }
}

module.exports = {
  Item,
  Shop,
};
