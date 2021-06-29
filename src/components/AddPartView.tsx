import { Dropdown, Icon, IconButton, IDropdownOption, PrimaryButton, TextField } from '@fluentui/react'
import React, { useContext } from 'react'
import { Privilege } from '../models/publisher';
import { GlobalContext } from '../store/GlobalState';

import { v4 } from 'uuid'
import { CONG_ID } from '../constants';

import { Parent, Part, WeekProgram } from '../models/wol';

export default function AddPartView({ week } : { week: WeekProgram }) {
    const { dismissModal, firestore } = useContext(GlobalContext);
    const [part, setPart] = React.useState<Part>();

    const privileges: IDropdownOption[] = [
        { key: 0, text: 'Ancien', data: Privilege.elder },
        { key: 1, text: 'Assistant', data: Privilege.ms },
        { key: 2, text: 'Proclamateur', data: Privilege.pub },
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



    

    const addPart = () => {

        if (part) {
          
         //   if (part.index && part.title) {
                console.log(part)
                let id = v4()
                let _part : Part = {
                    ...part,
                    week: week.id,
                    date: week.date,
                    id: id,
                    hasAssistant: false,
                    isConfirmed: false
                }
                firestore
                .doc(`congregations/${CONG_ID}/weeks/${week.id}/parts/${id}`)
                .set(_part)
                .then(dismissModal)
           // }
        }
    }
      
    return (
        <div>
            <div className="flex items-center justify-between pl-4 pr-2 py-2 bg-gray-50">
               
               <div className="inline-flex items-center">
                   <Icon iconName="Add" className="mr-2 text-lg"/>
                   <span className="font-bold text-lg">Add Part</span>
               </div>
               <IconButton
               onClick={dismissModal}
               iconProps={{
                   iconName: "ChromeClose"
               }}
               />
           </div>
           <div className="px-4 pb-2 " style={{ minWidth: 500 }}>
               <div className="flex">
                    <TextField 
                     onChange={(e, value) => {
                        setPart({ 
                            ...part,
                            title: e.currentTarget.value
                        })
                     }}
                    className="mr-2 w-full" 
                    placeholder="Lecture" 
                    label="Title" 
                    required />
               </div>
               <div className="flex">
                    <Dropdown
                        placeholder="Ancien"
                        label="Privilege"
                        multiSelect={true}
                        onChange={(e, option) => {
                            if (option) {
                                if (option.selected) {
                                setPart({ 
                                    ...part,
                                    privilege: part && part.privilege && part.privilege.length > 0 ? [
                                        ...part.privilege,
                                        option.data
                                    ] : [option.data]
                                })
                                } else {
                                    setPart({ 
                                        ...part,
                                        privilege: part && part.privilege && part.privilege.length > 0 ? part.privilege.filter(p => p !== option.data) : []
                                    })
                                }
                            }
                        }}
                        options={privileges}
                        className="flex-1 mr-2"
                    />
                    <Dropdown
                        placeholder="1"
                        onChange={(e, option) => {
                            setPart({ 
                                ...part,
                                index: Number(option?.key)
                            })
                        }}
                        label="Order"
                        className="flex-1"
                        options={indexes}
                    />
               </div>
               <Dropdown
                    placeholder="Priere"
                    onChange={(e, option) => {
                        setPart({ 
                            ...part,
                            parent: option?.data
                        })
                    }}
                    label="Section"
                    className="flex-1"
                    options={parents}
                />
               <div className="flex py-4 justify-center">
                    <PrimaryButton
                    onClick={addPart}
                    className="w-full" 
                    iconProps={{iconName: 'Add'}}
                    text= 'Add Part' />
            </div>
           </div>
        </div>
    )
}
