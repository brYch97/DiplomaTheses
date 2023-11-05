import * as React from 'react';
import { VirtualizedComboBox as ComboBox } from '@fluentui/react';
import { useAddressPicker } from './useAddressPicker';

export interface IAddressPicker {
    base64: string | null;
    onAddressSelected: (base64: string) => void;
    disabled: boolean
}

export const AddressPicker: React.FC<IAddressPicker> = (props) => {
    const [
        ruianAPI,
        address,
        municipalities,
        streets,
        places,
        setRegion,
        setMunicipality,
        setStreet,
        setPlace
    ] = useAddressPicker(props.base64, props.onAddressSelected);

    return <div>
        <ComboBox
            label='Kraj'
            disabled={props.disabled}
            styles={{
                root: {
                    maxWidth: 280
                }
            }}
            placeholder='---'
            selectedKey={address.region?.regionId ?? '__'}
            onChange={(e, option) => setRegion({
                regionId: option?.key as string,
                regionName: option?.text as string
            })}
            options={ruianAPI.getRegions().map(region => {
                return {
                    key: region.regionId,
                    text: region.regionName
                }
            })} />
            <ComboBox
                disabled={!address.region || props.disabled}
                styles={{
                    root: {
                        maxWidth: 280
                    }
                }}
                allowFreeInput
                placeholder='---'
                selectedKey={address.region?.municipality?.municipalityId ?? '___'}
                autoComplete='on'
                onChange={(e, option) => setMunicipality({
                    municipalityId: option?.key as string,
                    municipalityName: option?.text as string
                })}
                options={municipalities.map((municipality) => {
                    return {
                        key: municipality.municipalityId,
                        text: municipality.municipalityName
                    }
                }).sort((a, b) => a.text.localeCompare(b.text))}
                label='Obec' />
            <ComboBox
                allowFreeInput
                disabled={!address.region?.municipality || props.disabled}
                styles={{
                    root: {
                        maxWidth: 280
                    }
                }}
                placeholder='---'
                autoComplete='on'
                selectedKey= {`${address.region?.municipality?.municipalityId}_${address.region?.municipality?.street?.streetName ??  address.region?.municipality?.street?.streetLessPartName}` ?? '__'}
                onChange={(e, option: any) => {
                    if (option["data-is-streetless"]) {
                        setStreet({
                            streetLessPartName: option.text
                        })
                    }
                    else {
                        setStreet({
                            streetName: option.text
                        })
                    }
                }}
                options={streets.map((street) => {
                    return {

                        key: `${address.region?.municipality?.municipalityId}_${street.streetName ??  street.streetLessPartName}`,
                        text: street.streetName! ?? street.streetLessPartName,
                        ["data-is-streetless"]: street.streetLessPartName && true
                    }
                }).sort((a, b) => a.text.localeCompare(b.text))}
                label='Ulice'
            />
            {console.log(address.region?.municipality?.street?.place?.placeId)}
            <ComboBox
                disabled={!address.region?.municipality?.street || props.disabled}
                styles={{
                    root: {
                        maxWidth: 70
                    }
                }}
                allowFreeInput
                autoComplete='on'
                placeholder='---'
                label='Číslo popisné'
                selectedKey={address.region?.municipality?.street?.place?.placeId ?? '__'}
                onChange={(e, option: any) => {
                    setPlace({
                        placeId: option.key,
                        placeCp: option.text,
                        placeCe: option["data-ce"],
                        placeCo: option["data-co"],
                        placeZip: option["data-zip"],
                    })
                }}
                options={places.map((place) => {
                    return {
                        key: place.placeId,
                        text: place.placeCp,
                        "data-ce": place.placeCe,
                        "data-co": place.placeCo,
                        "data-zip": place.placeZip
                    }
                })}
             />
    </div>
}