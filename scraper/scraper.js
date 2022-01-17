const { children } = require("cheerio/lib/api/traversing");
const { getAttributeValue, innerText } = require("domutils");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio  = require("cheerio");
const pretty = require('pretty');
const fs = require('fs')
const colors = require('colors')

const log = console.log;

// stealth mode for the web scraper
puppeteer.use(StealthPlugin());

runScraper()

function runScraper() {
    (async () => {
        // initalize browser, headless: false means browser window opens, headless: true means without browser window 
        const browser = await puppeteer.launch({ headless: true, args: [`--window-size=${1920},${1080}`]});
        const page = await browser.newPage();

        log('> Browser intialized\n'.brightYellow)

        // url for washington dc homes, price > $900k
        const dc_url = 'https://www.zillow.com/washington-dc/houses/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%22Washington%2C%20DC%22%2C%22mapBounds%22%3A%7B%22west%22%3A-77.41626362202771%2C%22east%22%3A-76.61288837788709%2C%22south%22%3A38.677702084919346%2C%22north%22%3A39.108982541733354%7D%2C%22mapZoom%22%3A11%2C%22regionSelection%22%3A%5B%7B%22regionId%22%3A41568%2C%22regionType%22%3A6%7D%5D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22price%22%3A%7B%22min%22%3A900000%7D%2C%22con%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22mf%22%3A%7B%22value%22%3Afalse%7D%2C%22mp%22%3A%7B%22min%22%3A3035%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22sort%22%3A%7B%22value%22%3A%22priced%22%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22tow%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22apco%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D'
        log('> Going to DC\n'.brightYellow)
        await page.goto(dc_url);

        // wait for specific page elements
        await page.waitForSelector('li');
        // set houses equal to specific DOM elements 
        const houses = await page.$$('.list-card-info');

        //list for hyperlinks to the more detailed page for each house
        const houses_href_list = []
        
        log('> Pulling home listing links\n'.brightYellow)

        //breaking on 10 houses 
        //go through first 10 houses and retrieve url for the more detailed page for each house
        for(let i = 0; i < 8; i++){

            const house = houses[i];

            const househref = await house.$eval('a', e => e.getAttribute('href'))

            log(`${i}: ${househref}`)
            houses_href_list.push(househref)
        }

        //inital json data for all data for writing to home-data file
        let homesData = {}

        // go to each page in house_href_list then retrieve and store info in JSON
        for(let i = 0; i < houses_href_list.length; i++){
            await page.goto(houses_href_list[i])
            log(`> At location #${i}\n`.brightYellow)

            // start with pulling home info (then pics)
            
            // parent element from which to start
            let parentEl = 'div.summary-container'

            // default is desktop, switched to false when mobile version is detected 
            let desktop = true;
            
            //wait for parent seletor to load
            log('> Attempting to load desktop version\n'.brightYellow)
            
            await page.waitForSelector(parentEl, {timeout:10000}).then(() => {
                log(`> ${parentEl} loaded`.brightGreen)  
            }).catch(async () => {
                log('> Desktop loading failed\n'.brightRed)
                log('> Attempting to load mobile version\n'.brightYellow)
                parentEl = '.hdp__sc-1tsvzbc-1.ds-chip'
                await page.waitForSelector(parentEl, {setTimeout:10000}).then(() => {
                    log(`> ${parentEl} loaded\n`.brightGreen);
                    desktop = false;
                }).catch(console.error)
            })           
            
            const summary_container = await page.$eval(parentEl, el => {
                return el.innerHTML;
            })
        
            // console.log(pretty(summary_container, {ocd: true}))  
        
            const homeInfo = parseHomeInfo(desktop, summary_container)
        
            // set parent element based on version
            if(desktop){
                parentEl = '.hdp__sc-1wi9vqt-0.lWxLY.ds-media-col.media-stream'
            } else {
                parentEl = 'ul.media-stream'
            }
            
            // wait for selector with imgs to load
            await page.waitForSelector(parentEl, {timeout:10000}).then(() => {
                log(`> ${parentEl} loaded`.brightGreen)
            }).catch(console.error).then()
        
            const photo_carousel = await page.$eval(parentEl, el => {
                return el.innerHTML;
            })
        
            // console.log(pretty(photo_carousel, {ocd: true}))
        
            const homePics = parseHomePics(photo_carousel);
        
            homeInfo.homePics = homePics

            homesData[i] = homeInfo
        }

        // for testing
        // const testurl = 'https://www.zillow.com/homedetails/3122-3124-P-St-NW-Washington-DC-20007/35725211_zpid/'
        await page.goto(testurl);

        // formats json data
        homesData = JSON.stringify(homesData, null, 2);
        //write json data to file
        fs.writeFileSync('home-data.json', homesData)

        await browser.close();
    })();
}

// parses and pulls data of homes based on version (desktop/mobile)
function parseHomeInfo(desktop = true, data) {
    log('> Parsing for home info\n'.brightYellow)

    const $ = cheerio.load(data)

    let location = ''
    let price = '';
    let bed = '';
    let bath = '';
    let sq = '';

    //if desktop version
    if(desktop) {
        location = $('div > div > div > div > h1').text()

        price = $('[data-testid="price"]').text();

        bed = $('div > div > div > div > div > span > span > strong').html()

        bath = $('div > div > div > div > div > span > button > span > strong').html()

        // TODO: still need to fix this
        sq = $('div > div > div > div > div > div > span').children().last().children().text()
    }
    //if mobile version
    if(!desktop){
        // location = $('div').contents().next().next().children().children().contents().html() + $('div').contents().next().next().children().children().children().next().html()
        location = $('div > div').next().children().children().text() + $('div > div').next().children().children().last().text()
        // cut off irrelevant part of the string (I don't know why it does this :( )
        location = location.slice(0, location.indexOf('For sale'))
        location = location.slice(0, location.indexOf('New construction'))

        price = $('div  > div > div > div > span > span').contents().html()

        bed = $('div  > div > div > div > div > span > span').contents().html()

        bath = $('div  > div > div > div > div > span > button > span').contents().html()

        sq = $('div > div > div > div > div > span').contents().last().children().html()
    }

    let homeData = {
        location: location.slice(1).replace(/,/g, ''),
        price: price,
        bed: bed,
        bath: bath,
        sq, sq
    }
    console.log(`\nlocation:${location}\nprice:${price}\nbed:${bed}\nbath:${bath}\nsq:${sq}`)
    return homeData
}

// parse and pull links for pictures 
function parseHomePics(data) {
    log('> Parsing for home pics\n'.brightYellow)

    const $ = cheerio.load(data)

    let picsList = []

    const imgEls = $('img').toArray();
    // console.log(imgEls)
    let src  = ''
    for(i = 0; i < 7; i++){
        if(imgEls[i] == null){
            src = ''
        }
        else {
            src = imgEls[i]['attribs']['src']
        }
        picsList.push(src);
    }
    console.log(picsList)
    return picsList
}