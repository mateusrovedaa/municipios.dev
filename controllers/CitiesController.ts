import { Request, Response } from 'express';
// import { City } from "../models/City";
import puppeteer, { Page } from 'puppeteer';

class CityController {

    find = async (req: Request, res: Response) => {
        try {
            const province = req.params.province as string;
            const city = req.params.city as string;

            const cityData = await this._getCityInfos(province, city);

            res.json(cityData);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    _getCityInfos = async (province: String, city: String) => {
        try {
            
            const URL = `https://www.ibge.gov.br/cidades-e-estados/${province}/${city}.html`;
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
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

                await browser.close();

                population = population ? population.split(' ')[0] : null;
                mayor = mayor ? mayor.split('[')[0].trimEnd() : null;
                gentle = gentle ? gentle.split(' ')[0] : null;
                IDHM = IDHM ? IDHM.split('[')[0].trimEnd() : null;
                cityName = cityName ? cityName : null;
                code = code ? code.split(' ')[1] : null;

                const cityObject = {
                    code: code,
                    city: cityName,
                    province: province,
                    mayor: mayor,
                    gentle: gentle,
                    idhm: IDHM,
                    population: population
                }

                console.log(cityObject);
                return cityObject;
            }
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    _handle = async (page: Page, xpath: String) => {
        return await page.$x(`${xpath}`);
    }

    _getData = async (page: Page, handle: any) => {
        return await page.evaluate(el => el.textContent, handle[0]);
    }

}

export default new CityController;