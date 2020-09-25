const { Shop, Item } = require("../src/gilded_rose");

const sellInRate = 1;
const qualityRate = 1;
const qualityValue = 40;
const sellInValue = 10;
const maxQuality = 50;
const normalItemName = "Elixir of the Mongoose";
const legendaryItemName = "Sulfuras, Hand of Ragnaros";
const agedBrieName = "Aged Brie";
const backstagePassesName = "Backstage passes to a TAFKAL80ETC concert";
const conjuredItemName = "Conjured Mana Cake";

const createShop = (name, sellIn, quality) => {
  return new Shop([new Item(name, sellIn, quality)]);
};

describe("An item", () => {
  it("has its sellIn value descreased by 1 per day", () => {
    const gildedRose = createShop(normalItemName, sellInValue, qualityValue);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(sellInValue - sellInRate);
  });

  it("has its quality value descreased by 1 per day", () => {
    const gildedRose = createShop(normalItemName, sellInValue, qualityValue);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(qualityValue - qualityRate);
  });

  it("has its quality degrate twice as fast once the sell by date has passed", () => {
    const gildedRose = createShop(normalItemName, -1, qualityValue);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(qualityValue - 2 * qualityRate);
  });

  it(`never gets more quality than ${maxQuality}`, () => {
    const qualityValue = 50;
    const gildedRose = createShop(agedBrieName, -1, qualityValue);
    const gildedRose2 = createShop(backstagePassesName, 5, qualityValue);
    const items = gildedRose.updateQuality();
    const items2 = gildedRose2.updateQuality();
    expect(items[0].quality).toBe(maxQuality);
    expect(items2[0].quality).toBe(maxQuality);
  });

  it("never gets a negative quality", () => {
    const qualityValue = 0;
    const gildedRose = createShop(normalItemName, sellInValue, qualityValue);
    const gildedRose2 = createShop(conjuredItemName, sellInValue, qualityValue);
    const items = gildedRose.updateQuality();
    const items2 = gildedRose2.updateQuality();
    expect(items[0].quality).not.toBeLessThan(0);
    expect(items2[0].quality).not.toBeLessThan(0);
  });
});

describe("Legendary item", () => {
  const qualityValue = 80;
  const sellInValue = -1;
  it("never has to be sold", () => {
    const gildedRose = createShop(legendaryItemName, sellInValue, qualityValue);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(sellInValue);
  });

  it(`always has a quality of ${qualityValue}`, () => {
    const gildedRose = createShop(legendaryItemName, sellInValue, qualityValue);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(qualityValue);
  });
});

describe(`${agedBrieName}`, () => {
  it("increases in quality the older it gets", () => {
    const gildedRose = createShop(agedBrieName, sellInValue, qualityValue);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(qualityValue + qualityRate);
  });
});

describe("Backstage passes", () => {
  const sellInValue = 10;

  it("quality increases by 2 when there are 10 days or less", () => {
    const gildedRose = createShop(
      backstagePassesName,
      sellInValue,
      qualityValue
    );
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(qualityValue + 2 * qualityRate);
  });

  it("quality increases by 3 when there are 5 days or less", () => {
    const sellInValue = 5;
    const gildedRose = createShop(
      backstagePassesName,
      sellInValue,
      qualityValue
    );
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(qualityValue + 3 * qualityRate);
  });

  it("quality drops to 0 after the concert", () => {
    const gildedRose = createShop(backstagePassesName, -1, qualityValue);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });
});

describe("Conjured item ", () => {
  it("degrades twice as fast", () => {
    const gildedRose = createShop(conjuredItemName, sellInValue, qualityValue);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(qualityValue - 2 * qualityRate);
  });
});
