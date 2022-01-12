const cheerio = require("cheerio");
const { getAttributeValue } = require("domutils");
const puppeteer = require("puppeteer");

(async () => {
    // initalize browser, headless: false means browser window opens, headless: true means without browser window 
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    console.log('Browser intialized')
    //url for washington dc homes, price > $900k
    const dc_url = 'https://www.zillow.com/homes/for_sale/?searchQueryState=%7B%22usersSearchTerm%22%3A%22Washington%2C+DC%22%2C%22mapBounds%22%3A%7B%22west%22%3A-77.25146870015271%2C%22east%22%3A-76.77768329976209%2C%22south%22%3A38.72592996996342%2C%22north%22%3A39.06101415185121%7D%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A41568%2C%22regionType%22%3A6%7D%5D%2C%22filterState%22%3A%7B%22price%22%3A%7B%22min%22%3A900000%7D%2C%22mp%22%3A%7B%22min%22%3A3035%7D%2C%22sort%22%3A%7B%22value%22%3A%22priced%22%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22tow%22%3A%7B%22value%22%3Afalse%7D%2C%22mf%22%3A%7B%22value%22%3Afalse%7D%2C%22con%22%3A%7B%22value%22%3Afalse%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22apco%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22mapZoom%22%3A11%2C%22savedSearchEnrollmentId%22%3A%22X1-SSsavy12cucpqm1000000000_4hjdl%22%7D'
    console.log('Going to DC')
    await page.goto(dc_url);

    // wait for specific page elements and set houses equal to specific elements 
    await page.waitForSelector('li');
    const houses = await page.$$('.list-card-info');

    //go through houses and retrieve url for the more detailed page (for each house)
    for(let i = 0; i < 5; i++){

        const house = houses[i];

        const househref = await house.$eval('a', e => e.getAttribute('href'))

        console.log(househref)
    }
    await browser.close();
})();