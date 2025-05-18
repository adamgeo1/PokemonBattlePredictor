import puppeteer from 'puppeteer';
import Trainer from './structures/trainer';

let cache: {[key: string] : any} = {};

const getPageBattles = async (url: string) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
        });

        const page = await browser.newPage();

        let cacheKey: string = `${url}`;
        if (cache.hasOwnProperty(cacheKey) && cache[cacheKey].hasOwnProperty("battles")) {
            console.log('Cache hit for:', cacheKey);
            return cache[cacheKey].battles;
        }

        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        });
        console.log('Page loaded for battle finding');


        // TODO: work on getting the information for the regular battles on pages,
        // since only the notable trainer battles, such as rival battles or gym leaders,
        // are in expandable tables, so there is a different format for the other battles
        // that we have to accomodate and account for.
        const getRegularBattles = ()=> {

        };

        // For trainer battles that are expandable on the Bulbapedia page, and have 
        // expanded info about the pokemon, including abilities, movesets and items included
        // TODO: find a way to get other information about the pokemon,
        // including the level, ability, moves, and held item
        const notableTrainerBattles = await page.evaluate(async () => {



            const expanding = document.querySelectorAll(".expandable");
            const trainers: Trainer[] = [];
            expanding.forEach((element) => {

                const pokemonMentioned = () => {
                    const pokemon = element.querySelectorAll('a[href^="/wiki/"][href$="(Pok%C3%A9mon)"]');
                            const pokemonNames: string[] = [];
                            pokemon.forEach((p) => {
                                const href = p.getAttribute('href');
                                if (href && href.startsWith('/wiki/') && !href.includes(':')) {
                                    const name = href.split('/wiki/')[1].split('_(Pok%C3%A9mon)')[0];
                                    pokemonNames.push(name);
                                }
                            });
                    return pokemonNames;
                }

                const moreTrainerInfo = () => {
                    const trainerRow = element.querySelector('tr');
                    const table = trainerRow?.querySelector(".roundy");
                    const body = table?.querySelector("tbody");
                    const info: string[] = [];
                    const rows = body?.querySelectorAll("tr");
                    rows?.forEach((row)=> {
                        info.push(row.textContent?.substring(1).slice(0, row.textContent?.substring(1).length - 1) || "");
                    });
                    info.push("bulbapedia.bulbagarden.net".concat(trainerRow?.querySelector('a[href^="/wiki/File:"][href$=".png"]')?.getAttribute('href')  || ""));

                    return info;
                };

                // It seems like all the important trainer battles on Bulbapedia are stored in <table> elements
                // with a class of .expandable and a cellspacing attribute of 1,
                // as well as a cellpadding attribute of 2
                const cellSpacing = element.getAttribute("cellspacing");
                var isTrainerBattle: boolean = cellSpacing !== null && cellSpacing === "1";

                if (isTrainerBattle){
                    const includedPokemon = pokemonMentioned();
                    const trainerInfo = moreTrainerInfo();
                    trainers.push({
                        image: trainerInfo[5],
                        name : trainerInfo[1],
                        title : trainerInfo[0],
                        pokemon : includedPokemon,
                        location : trainerInfo[3],
                        game : trainerInfo[4],
                    });
                }
            });

            return trainers;
        });

        await browser.close();
        if (cache.hasOwnProperty(cacheKey))
            cache[cacheKey].battles = notableTrainerBattles; // Cache the response
        else {
            cache[cacheKey] = {
                battles : notableTrainerBattles,
            }
        }

        console.log(notableTrainerBattles);
        console.log("finished with getPageBattles");
        return notableTrainerBattles;
    }
    catch (error) {
        console.error('Error while scraping:', error);
        return "error while scraping";
    }
}

//Test function, to be deleted
const getPagePokemon = async (url: string) => {

    const findPokemonMentioned = () => {
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
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
        });

        const page = await browser.newPage();

        let cacheKey: string = `${url}`;
        if (cache.hasOwnProperty(cacheKey) && cache[cacheKey].hasOwnProperty("pokemon")) {
            console.log('Cache hit for:', cacheKey);
            return cache[cacheKey].pokemon;
        }


        //Test page url to scrape from 
        //Webscraping should get you the names Espeon, Umbreon, Zigzagoon, and Whismur
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        }); 
        console.log('Page loaded');
        console.log('Page title:', await page.title());

        // This has not been tested on pages other than the Pokemon Colosseum Walkthrough Pt 1 page

        // Idea -> on Bulbapdeia, the pokemon trainer names that have their 
        // parties displayed are enclosed in <b></b> tags.
        // We can use this to group the pokemon data that we can scrape from the <table> tags directly after
        // and piece together the trainer battle information.

        

        const pokemonMentioned = await page.evaluate(findPokemonMentioned);

        console.log('Pokemon mentioned on the page:', pokemonMentioned);

        await browser.close();
        if (cache.hasOwnProperty(cacheKey))
            cache[cacheKey].pokemon = pokemonMentioned; // Cache the response
        else {
            cache[cacheKey] = {
                pokemon : pokemonMentioned,
            }
        }

        return pokemonMentioned
    }
    catch (error) {
        console.error('Error while scraping:', error);
        return "error while scraping";
    }
    
};

export { getPagePokemon, getPageBattles };