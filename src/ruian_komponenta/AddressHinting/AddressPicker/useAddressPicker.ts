import { useEffect, useMemo, useRef, useState } from "react"
import { IAddress, IMunicipality, IPlace, IRegion, IStreet, RuianApi } from "./RuianApi";
import { encode, decode } from 'js-base64';


export const useAddressPicker = (base64: string | null, onAddressSelected: (base64: string) => void): [
    RuianApi,
    IAddress,
    IMunicipality[],
    IStreet[],
    IPlace[],
    (data: IRegion) => void,
    (data: IMunicipality) => void,
    (data: IStreet) => void,
    (data: IPlace) => void
] => {
    const addressRef = useRef<IAddress>({});
    const ruianApi = useMemo(() => {return new RuianApi()}, []);
    const [address, setAddress] = useState<IAddress>({});
    const [municipalities, setMunicipalities] = useState<IMunicipality[]>([]);
    const [streets, setStreets] = useState<IStreet[]>([]);
    const [places, setPlaces] = useState<IPlace[]>([]);

    const convertBase64ToAddress = (): IAddress => {
        if(!base64) {
            return {}
        }
        return JSON.parse(decode(base64));
    }

    const selectRegion = async (data: IRegion) => {
        addressRef.current.region = data;
        setMunicipalities(await ruianApi.getMunicipalities());
        setAddress({...addressRef.current});
    }
    const selectMunicipality = async (data: IMunicipality) => {
        addressRef.current.region!.municipality = data;
        setStreets(await ruianApi.getStreets());
        setAddress({...addressRef.current});
    };

    const selectStreet = async (data: IStreet) => {
        addressRef.current.region!.municipality!.street = data;
        setPlaces(await ruianApi.getPlaces())
        setAddress({...addressRef.current});
    };
    const selectPlace = (data: IPlace) => {
        addressRef.current.region!.municipality!.street!.place = data;
        setAddress({...addressRef.current});
    }

    useEffect(() => {
        addressRef.current = convertBase64ToAddress();
        ruianApi.setAddress(addressRef.current);
        (async () => {
            if(addressRef.current.region) {
                setMunicipalities(await ruianApi.getMunicipalities());
            }
            if(addressRef.current.region?.municipality) {
                setStreets(await ruianApi.getStreets())
            }
            if(addressRef.current.region?.municipality?.street) {
                setPlaces(await ruianApi.getPlaces())
            }
        })()
        setAddress(addressRef.current);

    }, []);
    useEffect(() => {
        if(address.region) {
            const addressBase64 = encode(JSON.stringify(address));
            onAddressSelected(addressBase64);
        }
    }, [address])
    return [ruianApi, address, municipalities, streets, places, selectRegion, selectMunicipality, selectStreet, selectPlace];
}