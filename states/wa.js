const puppeteer = require('puppeteer');
const luxon = require("luxon");

module.exports = {
    lookupPlate: async function (plateQuery) {
        const url = 'https://online.transport.wa.gov.au/webExternal/registration';

        async function getContent(selector) {
            try {
                let element = await page.waitForSelector(selector, {timeout: 5000})
                return await element.evaluate(el => el.textContent);
            } catch(error) {
                console.log("ERR TIMED OUT")
                await browser.close()
                return {
                    "error": "TIMEOUT: Failed to get content"
                }
            }
        }

        const browser = await puppeteer.launch({ 
            headless: true // false: enables one to view the Chrome instance in action
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Enter plate in lookup box
        await page.evaluate(val => document.querySelector('input[name="plate"]').value = val, plateQuery);
        await page.click('input[name="searchButton"]');

        await page.waitForNavigation();
        

        let errorMessage = await page.evaluate(() => {
            let el = document.querySelector("#content > div > div.section-body > p:nth-child(1)")
            return el ? el.innerHTML : ""
        })
        if (errorMessage) {
            await browser.close()
            return {"error": errorMessage };
        } else {
            let plateDetails = {}
            // Get rego status
            let expiry = await getContent('#content > div > div.licensing-big-form > table.registrationTable > tbody > tr:nth-child(6) > td.data > span')
            let now = new Date();
            now.setHours(0,0,0,0);
            let expiryDate = luxon.DateTime.fromFormat(expiry, "dd/MM/yyyy");
            plateDetails.active = ( expiryDate > now ) ? true : false;
            plateDetails.expiry = expiryDate
            plateDetails.year = await getContent('#content > div > div.licensing-big-form > table.registrationTable > tbody > tr:nth-child(4) > td.data > span')
            plateDetails.colour = await getContent('#content > div > div.licensing-big-form > table.registrationTable > tbody > tr:nth-child(5) > td.data > span')
            plateDetails.make = await getContent('#content > div > div.licensing-big-form > table.registrationTable > tbody > tr:nth-child(2) > td.data > span')
            plateDetails.model = await getContent('#content > div > div.licensing-big-form > table.registrationTable > tbody > tr:nth-child(3) > td.data > span')
            
            await browser.close()
            return plateDetails
        }
    }
}