const { children } = require("cheerio/lib/api/traversing");
const { getAttributeValue, innerText } = require("domutils");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio  = require("cheerio");
const pretty = require('pretty');
const fs = require('fs')
const colors = require('colors')

const log = console.log;

const headless = true; // headless: false means browser window opens, headless: true means without browser window 
const args = [`--window-size=${1920},${1080}`]
let browserRestarted = false;

// stealth mode for the web scraper
puppeteer.use(StealthPlugin());

runScraper()

async function runScraper() {
        // get all the city URLS (with search params)
        const cityURLs = await scrapeCityURLs()
        
        // scrape each cities' page for URLs to house detail pages 
        const house_URL_list = await goToEachCity(cityURLs)
    
        log(`> houses_URL_list.length: ${house_URL_list.length}`)

        log(`> starting to scrape each individual house page\n`.yellow)
        await goToEachHouse(house_URL_list)

        log('\nSUCCESS!\n'.rainbow)
}

/* 
    loops through hardcoded list of cities, goes to their individual pages, filter results, 
    and grabs the resulting URL (which includes the search filter params)
*/
async function scrapeCityURLs() {
    let browser = await puppeteer.launch({ headless: headless, args: args});
    let page = await browser.newPage();
    log('> Browser intialized\n'.brightYellow)

    const cities = [
        'san-francisco-ca',
        'washington-dc',
        'miami-fl',
        'austin-tx',
        'kansas-city-mo',
        'houston-tx',
        'phoenix-az',
        'fort-worth-tx',
        'los-angeles-ca',
        'portland-or'
    ]

    const cityURLs = []

    for(let i=0;i<cities.length;i++) {
        const url = 'https://www.zillow.com/' + cities[i] + '/houses/'
        log(`> Going to ${cities[i]}\n`.brightYellow)

        if(browserRestarted){
            await page.waitForTimeout(1000).then(async () => {
                page = await browser.newPage();
                browserRestarted = false;
            })
        } 

        await page.goto(url)

        log('> Scanning for bot protection\n'.brightYellow)
        const robotDetected = await robotDetect(page);
        if(robotDetected){
            //for some reason I cannot isolate this restarting browser sequence in a function thus cannot keep DRY
            log('> Restarting browser instance\n'.brightYellow)
            browserRestarted = true;
            await browser.close()
            browser = await puppeteer.launch({ headless: headless, args: args});
            i -= 1; 
            continue;
        }

        await page.waitForSelector('#sort-popover').then(async () => {
            log('> #sort-popover loaded'.green)
            await page.click('#sort-popover').then(() => {
                log('> #sort-popover clicked'.green)
            }).catch(console.error)
        }).catch(console.error)
    
        await page.waitForSelector('[data-value="priced"]').then(async () => {
            log('> [data-value=priced] loaded'.green)
            await page.click('[data-value="priced"]').then(() => {
                log('> [data-value="priced"]\n'.green)
                log('--------------------------------------------------------------------------------------')
            }).catch(console.error)
        })

        const cityURL = await page.url()

        cityURLs.push(cityURL)
    }

    log(cityURLs)

    log(`> Browser closed`.brightYellow)
    await browser.close()

    return cityURLs
}

// goes to each individual city and runs scrapeHouseURls
async function goToEachCity(cityURLs) {
    let house_URL_list = []
    
    // initalize browser
    let browser = await puppeteer.launch({ headless: headless, args: args});
    let page = await browser.newPage();
    log('> Browser intialized\n'.brightYellow)

    log('> Scraping for house URLs within each city'.brightYellow)
    for(let i=0;i<cityURLs.length;i++){
        // gives time for browser to reintialize before continuing (if the browser was just restarted)
        if(browserRestarted){
            await page.waitForTimeout(1000).then(async () => {
                page = await browser.newPage();
                browserRestarted = false;
            })
        }

        log(`> houseURL[${i}]`.brightYellow)
        await page.goto(cityURLs[i])

        const robotDetected = await robotDetect(page);
        if(robotDetected){
            //for some reason I cannot isolate this restarting browser sequence in a function thus cannot keep DRY
            log('> Restarting browser instance\n'.brightYellow)
            browserRestarted = true;
            await browser.close()
            browser = await puppeteer.launch({ headless: headless, args: args});
            i -= 1; 
            continue;
        }

        //scrape page for house URLS
        let houseURLS = await scrapeHouseURLs(page)

        house_URL_list.push.apply(house_URL_list, houseURLS)
    }

    log(`> Browser closed`.brightYellow)
    await browser.close()

    return house_URL_list
}

// scrapes for URLs to individual house detail pages 
// TODO: add functionality to scroll page a little and load more of the content
async function scrapeHouseURLs(page) {
    await page.waitForSelector('li');
    // set houses equal to specific DOM elements 
    const houses = await page.$$('.list-card-info');

    //list for hyperlinks to the more detailed page for each house
    const houses_href_list = []
    
    log('> Pulling home listing links\n'.brightYellow)

    //go through 8 houses and retrieve url for the more detailed page for each house
    for(let i = 0; i < 8; i++){

        const house = houses[i];

        const househref = await house.$eval('a', e => e.getAttribute('href'))

        houses_href_list.push(househref)
    }
    log(houses_href_list)

    return houses_href_list
}

async function goToEachHouse(houses_URL_list){
    // initalize browser
    let browser = await puppeteer.launch({ headless: headless, args: args});
    let page = await browser.newPage();
    log('> Browser intialized\n'.brightYellow)

    //inital json data for all data for writing to home-data file
    let homesData = {}

    // go to each page in house_URL_list then retrieve and store info in JSON
    for(let i = 0; i < houses_URL_list.length; i++){
        housePage = houses_URL_list[i]

        // gives time for browser to reintialize before continuing (if the browser was just restarted)
        if(browserRestarted){
            await page.waitForTimeout(1000).then(async () => {
                page = await browser.newPage();
                browserRestarted = false;
            })
        } 

        await page.goto(housePage).catch(console.error)
        log(`> At location[${i}]\n`.brightYellow)
        
        log('> Scanning for bot protection\n'.brightYellow)
        // if bot protection page is detected then restart browser and go back a loop iteration 
        const robotDetected = await robotDetect(page);
        if(robotDetected){
            //for some reason I cannot isolate this restarting browser sequence in a function thus cannot keep DRY
            log('> Restarting browser instance\n'.brightYellow)
            browserRestarted = true;
            await browser.close()
            browser = await puppeteer.launch({ headless: headless, args: args});
            i -= 1; 
            continue;
        }

        // sometimes the only thing that loads is an ad (I think that has something to do with the bot protection)
        // so if the page didn't load as expected (with <title>), restart the browser and go back a loop iteration 
        const titleLoaded = await checkTitleLoaded(page);
        if(!titleLoaded){
            log('> Restarting browser instance\n'.brightYellow)
            browserRestarted = true;
            await browser.close()
            browser =  await puppeteer.launch({ headless: headless, args: args});
            i -= 1; 
            continue;
        }

        // if no bot protection and the correct page loaded then continue on with scraping for data
        homesData[i] = await scrapeHomeDetailPages(page)
        log('--------------------------------------------------------------------------------------')
    }
    // for testing
    // const testurl = 'https://www.zillow.com/homede tails/3122-3124-P-St-NW-Washington-DC-20007/35725211_zpid/'
    // await page.goto(testurl);

    // formats json data
    homesData = JSON.stringify(homesData, null, 2);
    //write json data to file
    fs.writeFileSync('home-data.json', homesData)

    await browser.close()
}

// pulls home info/pics from the home detail page and returns it in JSON
async function scrapeHomeDetailPages(page) {
            
            // parent element from which to start
            let parentEl = 'div.summary-container'

            // default is desktop, switched to false when mobile version is detected 
            let desktop = true;
            
            //wait for parent seletor to load
            log('> Attempting to load desktop version\n'.brightYellow)
            
            await page.waitForSelector(parentEl, {timeout:1000}).then(() => {
                log(`> ${parentEl} loaded\n`.green.bold)  
            }).catch(async () => {
                log('> Desktop loading failed\n'.brightRed.bold)
                log('> Attempting to load mobile version\n'.brightYellow)
                parentEl = '.hdp__sc-1tsvzbc-1.ds-chip'
                await page.waitForSelector(parentEl, {setTimeout:1000}).then(() => {
                    log(`> ${parentEl} loaded\n`.green.bold);
                    desktop = false;
                }).catch(async (e) => {
                    log(e)
                    log('Mobile loading failed'.brightRed.bold)
                    pageHTML = await page.content()
                    fs.writeFileSync('mobilefailed.html', pageHTML)
                    return 
                })
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
            await page.waitForSelector(parentEl, {timeout:1000}).then(() => {
                log(`> ${parentEl} loaded\n`.green.bold)
            }).catch(console.error).then()
        
            const photo_carousel = await page.$eval(parentEl, el => {
                return el.innerHTML;
            })
        
            // console.log(pretty(photo_carousel, {ocd: true}))
        
            const homePics = parseHomePics(photo_carousel);
        
            homeInfo.homePics = homePics

            log(homeInfo)

            return homeInfo
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
        price: price.slice(1).replace(/,/g, ''),
        bed: bed,
        bath: bath,
        sq, sq
    }
    // console.log(`location:${homeData['location']}\nprice:${homeData['price']}\nbed:${bed}\nbath:${bath}\nsq:${sq}\n`)
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
    // log(picsList)
    return picsList
}

//detect if we page loaded was a bot protection page
async function robotDetect(page) {
    let robotDetected = false;
    // if captcha is detected 
    await page.waitForSelector('.captcha-container', {timeout:1000}).then(() => {
        log('> Robot detected\n'.brightRed.bold)
        robotDetected = true;
    }).catch(() => {
        log('> No bot protection detected\n'.green.bold)
        robotDetected = false;
    })
    return robotDetected;
}

// checks if page has title tag, otherwise its properly the wrong page
async function checkTitleLoaded(page){
    let titleLoaded = false;
    await page.waitForSelector('title', {timeout:1000}).then(() => {
        log('> <title> loaded\n'.green.bold);
        titleLoaded = true;
    }).catch(() => {
        log('> <title> missing\n'.brightRed.bold);
        titleLoaded = false;
    })
    return titleLoaded;
}