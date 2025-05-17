import puppeteer from 'puppeteer';

let cache: {[key: string] : any} = {};

const getPagePokemon = async (url: string) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
        });

        const page = await browser.newPage();

        let cacheKey: string = `${url}`;
        if (cache.hasOwnProperty(cacheKey)) {
            console.log('Cache hit for:', cacheKey);
            return cache[cacheKey];
        }


        //Test page url to scrape from 
        //Webscraping should get you the names Espeon, Umbreon, Zigzagoon, and Whismur
        await page.goto('https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Colosseum/Part_1', {
            waitUntil: 'domcontentloaded',
        }); 
        console.log('Page loaded');
        console.log('Page title:', await page.title());

        // This has not been tested on pages other than the Pokemon Colosseum Walkthrough Pt 1 page

        // Idea -> on Bulbapdeia, the pokemon trainer names that have their 
        // parties displayed are enclosed in <b></b> tags.
        // We can use this to group the pokemon data that we can scrape from the <table> tags directly after
        // and piece together the trainer battle information.

        

        const pokemonMentioned = await page.evaluate(() => {
            const elements = document.querySelectorAll('a[href^="/wiki/"][href$="(Pok%C3%A9mon)"]');
            const pokemonNames: string[] = [];
            elements.forEach((element) => {
                const href = element.getAttribute('href');
                if (href && href.startsWith('/wiki/') && !href.includes(':')) {
                    const name = href.split('/wiki/')[1].split('_(Pok%C3%A9mon)')[0];
                    if (!pokemonNames.includes(name)) {
                        pokemonNames.push(name);
                    }
                }
            });
            return pokemonNames;
        });

        console.log('Pokemon mentioned on the page:', pokemonMentioned);

        await browser.close();
        cache[cacheKey] = pokemonMentioned; // Cache the response

        return pokemonMentioned
    }
    catch (error) {
        console.error('Error while scraping:', error);
        return "error while scraping";
    }
    
};

export { getPagePokemon };