import { Actor } from 'apify';
import { PlaywrightCrawler, RequestList } from 'crawlee';
import * as cheerio from 'cheerio'

await Actor.init();
const input = await Actor.getInput();
let { oper } = input;
let { items } = input;
let { inmtype } = input;
let { loc } = input;
let { rooms } = input;
let { minprice } = input;
let { maxprice } = input;
let pages = (items % 10 != 0)? Math.floor(items / 10) + 1: (items/10)
let defUrl;
let count = 0;
if (oper === 'Venta') {
    defUrl = 'https://viviendasyvalores.com.co/ventas/?operation=venta&tipoinm= &sectorinm= &nhabitaciones= &minNprecio= 9500000 &maxNprecio= 16000000000 &listform=0'
    replaceLink();
    if (minprice <= 9500000) {
        minprice = 9500000
    }
    if (maxprice <= 9500000) {
        maxprice = 9500000
    }
} else {
    defUrl = 'https://viviendasyvalores.com.co/arriendos/?operation=arriendo&tipoinm= &sectorinm= &nhabitaciones= &minNprecio= 350000 &maxNprecio= 5350000 &listform=0'
    replaceLink();
}


const url = [];
for (let i = 0; i < pages; i++) {
    url.push(defUrl + `&sheet=${i}`)
}

const requestList = await RequestList.open('urls', url);


const crawler = new PlaywrightCrawler({
    requestList,
    maxConcurrency: 1,
    maxRequestRetries: 3,
    requestHandlerTimeoutSecs: 30,
    requestHandler: async ({page, request}) => {
        await page.waitForSelector('div.list-card')
        const html = await page.content();
        const $ = cheerio.load(html);
        const object = [];
        if ($('div.list-card').children().length === 1) {
            console.log('No se han encontrado mas resultados')
            crawler.stop();
        } else {
            $('div.card').each((i, element) => {
                if (count === items) {
                    crawler.stop();
                    return false
                } else {
                    if ($(element).length > 0){
                        const infoObject = {
                            img: $(element).find('div.img').attr('style').split('(')[1].split(')')[0].trim(),
                            name: $(element).find('div.body-container div div.description h3').text().trim(),
                            area: $(element).find('div.body-container div div.detail div:nth-child(1) p').text().replaceAll(' ','').replaceAll('2','²'),
                            price: parseInt($(element).find('div.footer div p').text().split('$')[1].replaceAll('.','')),
                            link: $(element).find('div.footer div a').prop('href').trim(),
                        };
                        object.push(infoObject)
                        count++
                    } else {
                        console.log('No hay mas elementos')
                        crawler.stop();
                        return false
                    }
                }
            })
        }
        Actor.pushData(object);
        console.log(object);
    }
});

await crawler.run(url);


await Actor.exit();

function replaceLink() {
    if (inmtype) {
        defUrl = defUrl.replace(/(tipoinm=)(.*?)(?= &)/, `$1 ${inmtype}`)
    }
    if (rooms) {
        defUrl = defUrl.replace(/(habitaciones=)(.*?)(?= &)/, `$1 ${rooms}`)
    }
    if (loc) {
        defUrl = defUrl.replace(/(sectorinm=)(.*?)(?= &)/, `$1 ${loc}`)
    }
    if (minprice) {
        defUrl = defUrl.replace(/(9500000)(.*?)(?= &)/, ` ${minprice}`)
    }
    if (maxprice) {
        defUrl = defUrl.replace(/(16000000000)(.*?)(?= &)/, ` ${maxprice}`)
    }
    defUrl = defUrl.replaceAll(' ', '')
}