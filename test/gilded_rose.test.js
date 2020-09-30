const { Names, Quality, Dates, Legendary, Deltas, Shop, Item } = require("../src/gilded_rose");

const Defaults = {
  SELL_IN: 10,
  QUALITY: 40,
};

const createShop = (name, sellIn, quality) => {
  return new Shop([new Item(name, sellIn, quality)]);
};

describe("An item", () => {
  it("has its sellIn value descreased by 1 per day", () => {
    const gildedRose = createShop(Names.REGULAR, Defaults.SELL_IN, Defaults.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(Defaults.SELL_IN + Deltas.DEFAULT_DEGRADE);
  });

  it("has its quality value descreased by 1 per day", () => {
    const gildedRose = createShop(Names.REGULAR, Defaults.SELL_IN, Defaults.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(Defaults.QUALITY + Deltas.DEFAULT_DEGRADE);
  });

  it("has its quality degrate twice as fast once the expiry date has passed", () => {
    const gildedRose = createShop(Names.REGULAR, Dates.EXPIRY, Defaults.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(Defaults.QUALITY + 2 * Deltas.DEFAULT_DEGRADE);
  });

  it(`never gets more quality than ${Quality.MAX}`, () => {
    const gildedRose = createShop(Names.AGED_BRIE, Dates.EXPIRY, Quality.MAX);
    const gildedRose2 = createShop(Names.BACKSTAGE_PASSES, 5, Quality.MAX);
    const items = gildedRose.updateQuality();
    const items2 = gildedRose2.updateQuality();
    expect(items[0].quality).toBe(Quality.MAX);
    expect(items2[0].quality).toBe(Quality.MAX);
  });

  it("never gets a negative quality", () => {
    const gildedRose = createShop(Names.REGULAR, Defaults.SELL_IN, Quality.MIN);
    const gildedRose2 = createShop(Names.CONJURED, Defaults.SELL_IN, Quality.MIN);
    const items = gildedRose.updateQuality();
    const items2 = gildedRose2.updateQuality();
    expect(items[0].quality).not.toBeLessThan(Quality.MIN);
    expect(items2[0].quality).not.toBeLessThan(Quality.MIN);
  });
});

describe("Legendary item", () => {
  it("never has to be sold", () => {
    const gildedRose = createShop(Names.LEGENDARY_ITEM, Defaults.SELL_IN, Legendary.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(Defaults.SELL_IN);
  });

  it(`always has a quality of ${Legendary.QUALITY}`, () => {
    const gildedRose = createShop(Names.LEGENDARY_ITEM, Defaults.SELL_IN, Legendary.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(Legendary.QUALITY);
  });
});

describe(`${Names.AGED_BRIE}`, () => {
  it("increases in quality the older it gets", () => {
    const gildedRose = createShop(Names.AGED_BRIE, Defaults.SELL_IN, Defaults.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(Defaults.QUALITY + Deltas.DEFAULT_IMPROVE);
  });

  it("doubly increases in quality when expiry date is reached", () => {
    const gildedRose = createShop(Names.AGED_BRIE, Dates.EXPIRY, Defaults.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(Defaults.QUALITY + Deltas.DEFAULT_IMPROVE * 2);
  });
});

describe(`${Names.BACKSTAGE_PASSES}`, () => {
  it("quality increases by 2 when there are 10 days or less", () => {
    const gildedRose = createShop(Names.BACKSTAGE_PASSES, Defaults.SELL_IN, Defaults.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(Defaults.QUALITY + 2 * Deltas.DEFAULT_IMPROVE);
  });

  it("quality increases by 3 when there are 5 days or less", () => {
    const sellIn = 5;
    const gildedRose = createShop(Names.BACKSTAGE_PASSES, sellIn, Defaults.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(Defaults.QUALITY + 3 * Deltas.DEFAULT_IMPROVE);
  });

  it("quality drops to 0 after the concert", () => {
    const gildedRose = createShop(Names.BACKSTAGE_PASSES, Dates.EXPIRY, Defaults.QUALITY);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(Quality.MIN);
  });
});

describe("Conjured item ", () => {
  it("degrades twice as fast", () => {
    const gildedRose = createShop(Names.CONJURED, Defaults.SELL_IN, Defaults.QUALITY);
    const gildedRose2 = createShop(Names.CONJURED, Dates.EXPIRY, Defaults.QUALITY);
    const items = gildedRose.updateQuality();
    const items2 = gildedRose2.updateQuality();
    expect(items[0].quality).toBe(Defaults.QUALITY + Deltas.CONJURED_DEGRADE);
    expect(items2[0].quality).toBe(Defaults.QUALITY + Deltas.CONJURED_DEGRADE * 2);
  });
});
