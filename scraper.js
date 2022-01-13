const { children } = require("cheerio/lib/api/traversing");
const { getAttributeValue, innerText } = require("domutils");
const puppeteer = require('puppeteer-extra');
const pup = require('puppeteer')
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio  = require("cheerio");
const pretty = require('pretty');

// stealth mode for the web scraper
puppeteer.use(StealthPlugin());

(async () => {
    // initalize browser, headless: false means browser window opens, headless: true means without browser window 
    const browser = await puppeteer.launch({ headless: true, args: [`--window-size=${1920},${1080}`]});
    const page = await browser.newPage();
    console.log('Browser intialized\n')

    //helper function for waiting for selector to load
    async function waitForEl(element) {
        await page.waitForSelector(element, {setTimeout:10000}).then(() => {
            //first arg makes color green cuz why not
            console.log('\x1b[32m%s\x1b[0m',`${element} loaded`);
        }).catch(error)
    }
    //url for washington dc homes, price > $900k
    // const dc_url = 'https://www.zillow.com/washington-dc/houses/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%22Washington%2C%20DC%22%2C%22mapBounds%22%3A%7B%22west%22%3A-77.41626362202771%2C%22east%22%3A-76.61288837788709%2C%22south%22%3A38.677702084919346%2C%22north%22%3A39.108982541733354%7D%2C%22mapZoom%22%3A11%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A41568%2C%22regionType%22%3A6%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22price%22%3A%7B%22min%22%3A900000%7D%2C%22con%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22mf%22%3A%7B%22value%22%3Afalse%7D%2C%22mp%22%3A%7B%22min%22%3A3035%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22sort%22%3A%7B%22value%22%3A%22priced%22%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22tow%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22apco%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D'
    // console.log('Going to DC')
    // await page.goto(dc_url);

    // // wait for specific page elements
    // await page.waitForSelector('li');
    // // set houses equal to specific DOM elements 
    // const houses = await page.$$('.list-card-info');

    // //list for hyperlinks to the more detailed page for each house
    // const houses_href_list = []

    // //go through first 5 houses and retrieve url for the more detailed page for each house
    // for(let i = 0; i < 5; i++){

    //     const house = houses[i];

    //     const househref = await house.$eval('a', e => e.getAttribute('href'))

    //     console.log(househref)
    //     houses_href_list.push(househref)
    // }

    // //go to each page in house_href_list then retrieve and store info in JSON
    // for(let i = 0; i < houses_href_list.length; i++){
    //     await page.goto(houses_href_list[i])
    //     await page.waitForSelector('h1')
        
    //     const location = await page.$eval('h1.Text-c11n-8-62-4__sc-aiai24-0.bnmVPu', e => e.textContent)
    //     const price = await page.$eval('span[data-testid="price"]', e => {
    //         console.log(e)
    //     })

    //     console.log(location)
    // }

    const testurl = 'https://www.zillow.com/homedetails/3122-3124-P-St-NW-Washington-DC-20007/35725211_zpid/'
    await page.goto(testurl);
    //parent element from which to start
    let parentEl = 'div.summary-container'
    
    //wait for parent seletor to load

    console.log('\x1b[33m%s\x1b[0m','Attempting to load desktop version\n')

    await page.waitForSelector(parentEl, {timeout:15000}).then(() => {
        console.log('\n\x1b[32m%s\x1b[0m',`${parentEl} loaded`)
    }).catch(async () => {
        console.log('\x1b[31m%s\x1b[0m','Desktop loading failed\n')
        console.log('\x1b[33m%s\x1b[0m', 'Attempting to load mobile version\n')
        parentEl = '.hdp__sc-1tsvzbc-1.ds-chip'
        await page.waitForSelector(parentEl, {setTimeout:10000}).catch(console.error).then(() => {
            console.log('\n\x1b[32m%s\x1b[0m',`${parentEl} loaded`);
        })
    })
    

    const summary_container = await page.$eval(parentEl, el => {
        return el.innerHTML;
    })

    const $ = cheerio.load(summary_container)

    console.log(pretty(summary_container, {ocd: true}))  

    const price = $('[data-testid="price"]').text();

    const bed = $('div > div > div > div > div > span > span > strong').html()

    const bath = $('div > div > div > div > div > span > button > span > strong').html()

    const sq = $('div > div > div > div > div > div').contents().last().children('strong').html()
    // const sq = $('div > div > div > div > div > span').contents()




    console.log(`\nprice:${price}\nbed:${bed}\nbath:${bath}\nsq:${sq}`)
     
    await browser.close();
})();