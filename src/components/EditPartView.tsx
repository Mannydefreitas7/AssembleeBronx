import React, { useContext, useState } from 'react'
import { Dropdown, Icon, IconButton, IDropdownOption, PrimaryButton, TextField } from '@fluentui/react';
import { Parent, Part } from '../models/wol';
import { useAlert } from 'react-alert';

import { GlobalContext } from '../store/GlobalState';

import { CONG_ID } from '../constants';
import { Privilege } from '../models/publisher';

export default function EditPartView({part}:{part: Part}) {
    const { firestore, dismissModal } = useContext(GlobalContext);
    const [partOptions, setPartOptions] = useState<Part>(part);
    const alert = useAlert()

    const saveChange = () => {
        if (partOptions && part.assignee) {
           firestore.doc(`congregations/${CONG_ID}/publishers/${part.assignee.uid}/parts/${part.id}`).set(partOptions)
        } 
        if (partOptions) {
            firestore.doc(`congregations/${CONG_ID}/weeks/${part.week}/parts/${part.id}`).set(partOptions)
            .then(() => {
                dismissModal()
                alert.success('Part edited successfully!')
            })
        }
    }

    const privileges: IDropdownOption[] = [
        { key: Privilege.elder, text: 'Ancien', data: Privilege.elder },
        { key: Privilege.ms, text: 'Assistant', data: Privilege.ms },
        { key: Privilege.pub, text: 'Proclamateur', data: Privilege.pub },
    ];
    
    const indexes: IDropdownOption[] = [
        { key: 0, text: '1' },
        { key: 1, text: '2' },
        { key: 2, text: '3' },
        { key: 3, text: '4' },
        { key: 4, text: '5' },
    ]; 

    const parents: IDropdownOption[] = [
        { key: 0, data: Parent.prayer, text: 'Priere' },
        { key: 1, data: Parent.chairman, text: 'President' },
        { key: 2, data: Parent.treasures, text: 'Perles Spirituelles' },
        { key: 3, data: Parent.apply, text: 'Appliquons' },
        { key: 4, data: Parent.life, text: 'Vie Chretienne' },
        { key: 5, data: Parent.secondary, text: 'Classe Secondaire' },
        { key: 6, data: Parent.talk, text: 'Discours' },
        { key: 7, data: Parent.wt, text: 'Tour De Garde' },
    ]; 

    return (
        <>
        <div className="h-160 w-80" style={{ minWidth: 500 }}>
            <div className="flex items-center justify-between pl-4 pr-2 py-2 bg-gray-50">
                <div className="inline-flex items-center">
                    <Icon iconName="Rename" className="mr-2 text-lg" />
                    <span className="font-bold text-lg">Edit Part</span>
                </div>
                <IconButton
                    onClick={dismissModal}
                    iconProps={{
                        iconName: "ChromeClose"
                    }}
                />
            </div>
            <div className="p-4">


                <div className="flex">
                    <TextField
                        defaultValue={partOptions.title}
                        multiline
                        resizable 
                        onChange={(e, option) => {
                            setPartOptions({ 
                                ...partOptions,
                                title: option
                            })
                     }}
                    className="mr-2 w-full" 
                    placeholder={partOptions.title} 
                    label="Title" 
                    required />
               </div>
               <div className="flex">
                    <Dropdown
                        placeholder="Ancien"
                        label="Privilege"
                        multiSelect={true}
                        defaultSelectedKeys={partOptions.privilege}
                        onChange={(e, option) => {
                            if (option) {
                                if (option.selected) {
                                    setPartOptions({ 
                                    ...partOptions,
                                    privilege: partOptions && partOptions.privilege && partOptions.privilege.length > 0 ? [
                                        ...partOptions.privilege,
                                        option.data
                                    ] : [option.data]
                                })
                                } else {
                                    setPartOptions({ 
                                        ...partOptions,
                                        privilege: partOptions && partOptions.privilege && partOptions.privilege.length > 0 ? partOptions.privilege.filter(p => p !== option.data) : []
                                    })
                                }
                            }
                        }}
                        options={privileges}
                        className="flex-1 mr-2"
                    />
                    <Dropdown
                        placeholder="1"
                        defaultSelectedKey={partOptions.index}
                        onChange={(e, option) => {
                            setPartOptions({ 
                                ...part,
                                index: Number(option?.key)
                            })
                        }}
                        label="Order"
                        className="flex-1"
                        options={indexes}
                    />
               </div>

                <div className="flex items-center justify-center mt-4">
                    <PrimaryButton className="w-full" text="Save" onClick={saveChange} />
                </div>
            </div>
        </div>
        </>
    )
}