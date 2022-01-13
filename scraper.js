const { children } = require("cheerio/lib/api/traversing");
const { getAttributeValue, innerText } = require("domutils");
const puppeteer = require('puppeteer-extra');
const pup = require('puppeteer')
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio  = require("cheerio");

// stealth mode for the web scraper
puppeteer.use(StealthPlugin());

(async () => {
    // initalize browser, headless: false means browser window opens, headless: true means without browser window 
    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();
    console.log('Browser intialized')
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

    // const testurl = 'https://www.zillow.com/homedetails/3122-3124-P-St-NW-Washington-DC-20007/35725211_zpid/'
    // await page.goto(testurl);
    // //parent element from which to start
    // const parentEl = 'div.summary-container'
    
    // //wait for parent seletor to load
    // await page.waitForSelector(parentEl).then(() => {
    //     //first arg makes color green cuz why not
    //     console.log('\x1b[32m%s\x1b[0m',`${parentEl} loaded`);
    // }).catch( e => {
    //     console.log(e);
    // });

    // const summary_container = await page.$eval(parentEl, el => {
    //     return el.innerHTML;
    // })

    const summary_container = `<div><div><div class="Spacer-c11n-8-62-4__sc-17suqs2-0 kpojdn"<div class="hdp__sc-7rrrvq-0 dpHnFH"><div class="hdp__sc-7rrrvq-1 gIiYBD"><span data-testid="price" class="Text-c11n-8-62-4__sc-aiai24-0 dpf__sc-1me8eh6-0 dDBGhS ingUtO"><span>$13,500,000</span></span><div class="hdp__sc-7rrrvq-2 hkwhrB"><span data-testid="bed-bath-beyond"><span data-testid="bed-bath-item" class="Text-c11n-8-62-4__sc-aiai24-0 bnmVPu"><strong>5</strong><span> bd</span></span><span class="dpf__sc-13frln-0 krEHlf"></span><button type="button" aria-expanded="false" aria-haspopup="false" class="TriggerText-c11n-8-62-4__sc-139r5uq-0 PHqux TooltipPopper-c11n-8-62-4__sc-io290n-0 hdp__sc-1vcj1w9-0 efoDhH dSuSZZ"><span data-testid="bed-bath-item" class="Text-c11n-8-62-4__sc-aiai24-0 bnmVPu"><strong>7</strong><span> ba</span></span></button><span class="dpf__sc-13frln-0 krEHlf"></span><span data-testid="bed-bath-item" class="Text-c11n-8-62-4__sc-aiai24-0 bnmVPu"><strong>6,300</strong><span> sqft</span></span></span></div></div></div><div class="hdp__sc-1gqth4d-0 fPXYHa"><h1 class="Text-c11n-8-62-4__sc-aiai24-0 bnmVPu">3122-3124 P St NW,&nbsp;Washington, DC 20007</h1></div><div class="hdp__sc-crj6pq-0 ds-chip-removable-content"><span class="Text-c11n-8-62-4__sc-aiai24-0 hdp__sc-s9676m-0 bnmVPu iWSjQx"><div class="dpf__sc-1yftt2a-0 eBHcZp"><span class="dpf__sc-1s8zaki-0 eAGrIl"></span><span class="Text-c11n-8-62-4__sc-aiai24-0 dpf__sc-1yftt2a-1 bnmVPu LbQI">For sale</span></div><span class="dpf__sc-13frln-0 krEHlf"></span><div class="hdp__sc-s9676m-1 hQGIBn"><span data-testid="zestimate-text" class="Text-c11n-8-62-4__sc-aiai24-0 bnmVPu"><button type="button" aria-expanded="false" aria-haspopup="dialog" class="TriggerText-c11n-8-62-4__sc-139r5uq-0 PHqux">Zestimate<sup>®</sup></button>: <span class="Text-c11n-8-62-4__sc-aiai24-0 ctTLh"><span>$13,031,400</span></span></span></div></span></div><div class="sc-ezredP jEmiHb"><div class="Spacer-c11n-8-62-4__sc-17suqs2-0 beSERh"><span class="sc-iktFfs jNrKZg">Est. payment:&nbsp;</span><span>$57,526/mo</span></div><a href="https://www.zillow.com/pre-qualify/#/pre-qualify&amp;zipCode=20007&amp;propertyValue=13500000&amp;propertyType=SingleFamilyHome&amp;source=Z_ForsaleHDP_Getpre-approved&amp;hdpSource=FS_HDP" class="sc-giImIA bkEkUs sc-kLgnNl grVIjx"><span class="sc-bYEvvW lmMXsV"><svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" height="20px" width="20px"><g fill-rule="nonzero" fill="none"><circle fill="#0074E4" cx="25" cy="25" r="25"></circle><path d="M33.438 14.688l-1.876 3.124c-1.562-1.25-3.125-1.875-5-2.187v6.563c5.313 1.25 7.5 3.437 7.5 7.187 0 3.75-2.812 6.25-7.187 6.563v3.437H23.75v-3.438c-3.125-.312-5.938-1.562-8.125-3.437l2.188-3.125c1.875 1.563 3.75 2.5 5.937 3.125v-6.875c-5-1.25-7.5-3.125-7.5-7.188 0-3.75 2.813-6.25 7.188-6.562V10h3.125v2.188c2.5 0 5 .937 6.875 2.5zM30 29.374c0-1.563-.625-2.5-3.438-3.125v6.25c2.5-.313 3.438-1.25 3.438-3.125zm-9.375-11.25c0 1.563.625 2.5 3.438 3.125v-5.938c-2.188.313-3.438 1.25-3.438 2.813z" fill="#FFF"></path></g></svg></span><span class="Text-c11n-8-62-4__sc-aiai24-0 kQflru">Get pre-qualified</span></a></div></div></div><div data-cft-name="contact-buttons" class="hdp__sc-h6x2kh-0 gVltFf"><ul class="contact-button-group"><li class="contact-button"><button class="StyledButton-c11n-8-62-4__sc-wpcbcc-0 jqsrVz contact-button-condensed ds-button ds-label-small" data-cft-name="contact-button-message">Contact Agent</button></li><li class="contact-button"><button class="StyledButton-c11n-8-62-4__sc-wpcbcc-0 hVskIF contact-button-condensed ds-button ds-label-small" data-cft-name="contact-button-tour">Take a Tour</button></li></ul></div></div>`

    const $ = cheerio.load(summary_container, {
        recognizeSelfClosing: true
    })

    // console.log(summary_container)  

    const price = $('[data-testid="price"]').text();

    const bed = $('div > div > div > div > div > span > span > strong').html()

    const bath = $('div > div > div > div > div > span > button > span > strong').html()

    const sq = $('div > div > div > div > div > span').contents().last().children('strong').text()

    console.log(`price:${price}\nbed:${bed}\nbath:${bath}\nsq:${sq}`)
     
    await browser.close();
})();