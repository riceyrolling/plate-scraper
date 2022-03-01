const puppeteer = require('puppeteer');
const luxon = require("luxon");

module.exports = {
    lookupPlate: async function (plateQuery) {
        const url = 'https://www.vicroads.vic.gov.au/registration/buy-sell-or-transfer-a-vehicle/check-vehicle-registration/vehicle-registration-enquiry';

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
        await page.evaluate(val => document.querySelector('input[name="ph_pagebody_0$phthreecolumnmaincontent_1$panel$VehicleSearch$RegistrationNumberCar$RegistrationNumber_CtrlHolderDivShown"]').value = val, plateQuery);
        await page.click('input[name="ph_pagebody_0$phthreecolumnmaincontent_1$panel$btnSearch"]');

        await page.waitForNavigation();
        
        let errorMessage = await page.evaluate(() => {
            let el = document.querySelector("#ph_pagebody_0_phthreecolumnmaincontent_1_panel_divAccountErrorMessage > p")
            return el ? el.innerHTML : ""
        })
        if (errorMessage) {
            await browser.close()
            return {"error": errorMessage };
        } else {
            let plateDetails = {}
            // Get rego status
            let expiry = await getContent('#main > div > div.detail-module > div > div:nth-child(2) > div')
            plateDetails.active = (expiry.split("-")[0].trim() == "Current") ? true : false;
            plateDetails.expiry = expiry.split("-")[1].trim()
            let carDetails = await getContent('#main > div > div.detail-module > div > div:nth-child(3) > div')
            plateDetails.year = carDetails.split(" ").filter(e =>  e)[0]
            plateDetails.colour = carDetails.split(" ").filter(e =>  e)[1]
            plateDetails.make = carDetails.split(" ").filter(e =>  e)[2]
            plateDetails.model = carDetails.split(" ").filter(e =>  e)[3]
            plateDetails.engineNumber = await getContent('#main > div > div.detail-module > div > div:nth-child(5) > div')
            plateDetails.vin = await getContent('#main > div > div.detail-module > div > div:nth-child(4) > div')
            
            await browser.close()
            return plateDetails
        }
    }
}