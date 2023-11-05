export interface IRegion {
    regionId: string;
    regionName: string;
    municipality?: IMunicipality;
}
export interface IMunicipality {
    municipalityId: string;
    municipalityName: string;
    street?: IStreet
}
export interface IStreet {
    streetName?: string;
    streetLessPartName?: string;
    place?: IPlace
}
export interface IPlace {
    placeId: string;
    placeCe: string;
    placeCp: string;
    placeCo: string;
    placeZip: string;
}

export interface IAddress {
    region?: IRegion
}


export class RuianApi {
    private _apiKey: string;
    private _address: IAddress | null;

    constructor() {
        this._apiKey = 'ebab2605457e9992d9f0a7c36f35379e1fa9e7187f67982b867f72f573469d9a';
    }
    public setAddress(address: IAddress | null) {
        this._address = address;
    }
    public getRegions() {
        return regions;
    }
    public async getMunicipalities(): Promise<IMunicipality[]> {
        const response = await fetch(`https://ruian.fnx.io/api/v1/ruian/build/municipalities?apiKey=${this._apiKey}&regionId=${this._getRegion()?.regionId}`);
        const result = await response.json();
        return result.data;
    }
    public async getStreets(): Promise<IStreet[]> {
        const response = await fetch(`https://ruian.fnx.io/api/v1/ruian/build/streets?apiKey=${this._apiKey}&municipalityId=${this._getMunicipality()?.municipalityId}`);
        const result = await response.json();
        return result.data;
    }
    public async getPlaces(): Promise<IPlace[]> {
        const response = await fetch(
            `https://ruian.fnx.io/api/v1/ruian/build/places?apiKey=${this._apiKey}&municipalityId=${this._getMunicipality()?.municipalityId}&streetName=${this._getStreet()?.streetName ?? this._getStreet()?.streetLessPartName}`
        );
        const result = await response.json();
        return result.data;
    }

    private _getRegion() {
        return this._address?.region;
    }
    private _getMunicipality() {
        return this._address?.region?.municipality;
    }
    private _getStreet() {
        return this._address?.region?.municipality?.street;
    }
}

const regions: {
    regionId: string;
    regionName: string
}[] = [
        { regionId: "CZ010", regionName: "Hlavní město Praha" },
        { regionId: "CZ020", regionName: "Středočeský kraj" },
        { regionId: "CZ031", regionName: "Jihočeský kraj" },
        { regionId: "CZ032", regionName: "Plzeňský kraj" },
        { regionId: "CZ041", regionName: "Karlovarský kraj" },
        { regionId: "CZ042", regionName: "Ústecký kraj" },
        { regionId: "CZ051", regionName: "Liberecký kraj" },
        { regionId: "CZ052", regionName: "Královéhradecký kraj" },
        { regionId: "CZ053", regionName: "Pardubický kraj" },
        { regionId: "CZ063", regionName: "Vysočina" },
        { regionId: "CZ064", regionName: "Jihomoravský kraj" },
        { regionId: "CZ071", regionName: "Olomoucký kraj" },
        { regionId: "CZ072", regionName: "Zlínský kraj" },
        { regionId: "CZ080", regionName: "Moravskoslezský kraj" },
    ];