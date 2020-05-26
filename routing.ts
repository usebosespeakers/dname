import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import * as config from "./config.ts" 
export const router = new Router(); 

/*
* Make Name.com API request to checkAvailability endpoint and return response as an array of results
*/
const makeAvailabilityRequest = async(domains: Array<string>) => {

    const dataToPost = JSON.stringify({"domainNames":domains}); 

    const requestOptions: any = {
    method: 'POST',
        headers: new Headers({
            "Authorization": `Basic ${btoa(config.user + ":" + config.apiKey)}`,
            "Content-Type": "application/json",
        }),
        body: dataToPost,
    };

    const response = await fetch("https://api.name.com/v4/domains:checkAvailability", requestOptions);

    const text = await response.text(); 

    return JSON.parse(text).results; 

    /* Sampe return value
     *
     *   [{
     *      "domainName":"announce.one",
     *      "sld":"announce",
     *      "tld":"one",
     *      "purchasable":true,
     *      "purchasePrice":7.9900000000000002,
     *      "purchaseType":"registration",
     *      "renewalPrice":7.9900000000000002}]},
     *   ]
     * 
     */

}

/*
* Receives the form data and iterates the lines in the appropriate file
*/ 
const checkAvailability = async(ctx: any, next: Function) => {

    const body = await ctx.request.body(); 
    const values = body.value; 
    const json = JSON.parse(values); 
    const maxPrice = parseFloat(json.maxPrice);
    const maxLength = parseFloat(json.maxLength);
    const fileName = `${Deno.cwd()}/word-lists/${json.wordList}`
    const file = await Deno.open(fileName); 
    const bufReader = new BufReader(file);
    let line: string | null;
    let domains: Array<string> = [];
    let results: Array<any> = [];

    // Use buffer to iterate lines in file
    while ((line = await bufReader.readString("\n")) != null) { 

        // Construct domain from line in file and form data
        const domain = `${json.prefix}${line.trim()}${json.suffix}${json.extension}`.toLowerCase();

        // If maxLength is a number and line length is less than maxLength, use domain 
        if ( isNaN(maxLength) == false && line.trim().length <= maxLength ) {
            domains.push(domain); 
        } else if ( isNaN(maxLength) ) { 
            domains.push(domain); 
        } else {
            continue;
        } 

        if (domains.length == 50) { 
            const result = await makeAvailabilityRequest(domains);
            for (const r of result) { 
                if (r.hasOwnProperty("purchasePrice")) {
                    let price = parseFloat(parseFloat(r.purchasePrice).toFixed(2));
                    if ( price <= maxPrice ){ results.push(r) }
                }
            }
            domains = []; 
        }
    }

    file.close(); 

    if (domains.length > 0) { 
        const result = await makeAvailabilityRequest(domains);
        for (const r of result) { 
            if (r.hasOwnProperty("purchasePrice")) {
                    let price = parseFloat(parseFloat(r.purchasePrice).toFixed(2));
                    if ( price <= maxPrice ){ results.push(r) }
            }
        }
        domains = [];
    } 

    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {"results":results};

}

router.post("/api/name/checkAvailability", checkAvailability);