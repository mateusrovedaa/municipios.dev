import { Request, Response } from 'express';
import { City } from "../models/City";
import puppeteer, { Page } from 'puppeteer';

class CityController {

    find = async (req: Request, res: Response) => {
        try {
            const province = req.params.province.toUpperCase() as string;
            const city = req.params.city.toLowerCase().trimEnd().split(' ').join('-') as string;

            const cityData = await this._getCityInfo(province, city);

            res.json(cityData);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    _getCityInfo = async (province: string, city: string) => {
        const cityDataFromDatabase = await City.locateCity(city, province);
        const maxDaysDataNotUpdated = 7;

        if (cityDataFromDatabase) {
            const older = new Date(cityDataFromDatabase.updatedAt).getTime();
            const diffDays = await this._compareDaysDiffDates(older);

            if (diffDays > maxDaysDataNotUpdated) {
                return await this._searchAndSaveOrUpdate(province, city, city);
            }

            return cityDataFromDatabase;
        } else {
            return await this._searchAndSaveOrUpdate(province, city);
        }
    }

    _searchAndSaveOrUpdate = async (province: string, city: string, slug?: string) => {
        if (slug) {
            const cityDataSource = await this._getCityInfoSource(province, city);
            await City.update(cityDataSource, {
                where: {
                    slug: slug,
                    province: province
                }
            });

            return await City.locateCity(city, province);;
        } else {
            const cityDataSource = await this._getCityInfoSource(province, city);
            const cityData = await City.create(cityDataSource);
            return cityData;
        }
    }

    _compareDaysDiffDates = async (date: number) => {
        const now = new Date().getTime();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    _getCityInfoSource = async (province: string, city: string) => {
        try {

            const URL = `https://www.ibge.gov.br/cidades-e-estados/${province}/${city}.html`;
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disabled-setupid-sandbox'],
            });
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(0);
            await page.goto(URL);

            if (page.url() !== URL) {
                throw new Error(`City or Province doesn't exists.`);
            } else {
                const xpathPopulation = "//html/body/main/section/div[2]/div/div[2]/div[2]/div[2]/ul/li[2]/div/p";
                const xpathMayor = "//html/body/main/section/div[2]/div/div[2]/div[2]/div[1]/ul/li[1]/div/p";
                const xpathGentle = "//html/body/main/section/div[2]/div/div[2]/div[2]/div[1]/ul/li[2]/div/p";
                const xpathIDHM = "//html/body/main/section/div[2]/div/div[2]/div[2]/div[2]/ul/li[5]/div[1]/p";
                const xpathCity = "//html/body/main/section/div[2]/div/div[2]/div[1]/h1";
                const xpathCode = "//html/body/main/section/div[2]/div/div[2]/div[1]/p";

                const populationHandle = await this._handle(page, xpathPopulation);
                const mayorHandle = await this._handle(page, xpathMayor);
                const gentleHandle = await this._handle(page, xpathGentle);
                const IDHMHandle = await this._handle(page, xpathIDHM);
                const cityHandle = await this._handle(page, xpathCity);
                const codeHandle = await this._handle(page, xpathCode);

                let population = await this._getData(page, populationHandle);
                let mayor = await this._getData(page, mayorHandle);
                let gentle = await this._getData(page, gentleHandle);
                let IDHM = await this._getData(page, IDHMHandle);
                let cityName = await this._getData(page, cityHandle);
                let code = await this._getData(page, codeHandle);

                const siteUrl = await this._searchUrlGoogle(page, `${city} ${province} governo site`)

                await browser.close();

                population = population ? population.split(' ')[0].replaceAll('.', '') : null;
                mayor = mayor ? mayor.split('[')[0].trimEnd() : null;
                gentle = gentle ? gentle.split(' ')[0] : null;
                IDHM = IDHM ? IDHM.split('[')[0].trimEnd().replaceAll(',', '.') : null;
                cityName = cityName ? cityName : null;
                code = code ? code.split(' ')[1] : null;

                const cityObject = {
                    slug: city,
                    name: cityName,
                    province: province,
                    ibgecode: code,
                    mayor: mayor,
                    gentle: gentle,
                    idhm: IDHM,
                    population: population,
                    site: siteUrl
                }

                console.log(cityObject);
                return cityObject;
            }
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    _searchUrlGoogle = async (page: Page, searchQuery: string) => {
        await page.goto("https://www.google.com/?hl=en", { waitUntil: "domcontentloaded" });
        await page.waitForSelector('input[aria-label="Search"]', { visible: true });
        await page.type('input[aria-label="Search"]', `${searchQuery}`);
        await Promise.all([
            page.waitForNavigation({ waitUntil: "domcontentloaded" }),
            page.keyboard.press("Enter"),
        ]);
        await page.waitForSelector(".LC20lb", { visible: true });
        await Promise.all([
            page.waitForNavigation({ waitUntil: "domcontentloaded" }),
            page.click(".LC20lb"),
        ]);

        return page.url();
    }

    _handle = async (page: Page, xpath: string) => {
        return await page.$x(`${xpath}`);
    }

    _getData = async (page: Page, handle: any) => {
        return await page.evaluate(el => el.textContent, handle[0]);
    }

}

export default new CityController;