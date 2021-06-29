import {  DefaultButton, SearchBox, Spinner, SpinnerSize } from '@fluentui/react';
import React, { useContext, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { GlobalContext } from '../store/GlobalState';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link, useRouteMatch } from 'react-router-dom';
import PublisherTile from '../components/PublisherTile';
import { Gender, Privilege, Publisher } from '../models/publisher';
import publishersJson from './../assets/hourglass.json';
import { v4 } from 'uuid';
import { Classe } from '../models/group';

export default function Publishers() {
    const { firestore, openPublisherModal } = useContext(GlobalContext)
    const [ value, loading ] = useCollection(firestore.collection(`congregations/${CONG_ID}/publishers`).orderBy('lastName'))
    let { path } = useRouteMatch();
    const [search, setSearch] = useState('');

    const importPublishers = () => {
        publishersJson.forEach(publisher => {
            let id = v4();
            let pub: Publisher = {
                uid: id,
                classe: Classe.primary,
                email: publisher.email,
                firstName: publisher.firstname,
                lastName: publisher.lastname,
                gender: publisher.sex === 'Male' ? Gender.brother : Gender.sister,
                privilege: publisher.appt.length > 1 ? publisher.appt === 'Elder' ? Privilege.elder : Privilege.ms : Privilege.pub,
                isInvited: false
            }
            firestore.doc(`congregations/${CONG_ID}/publishers/${id}`).set(pub);
        })
    }

    return (
        <div className="container p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-semibold text-2xl inline-flex items-center"> <Icon iconName="People" className="mr-2"/>Publishers</h1>
                <DefaultButton 
                onClick={openPublisherModal}
                iconProps={{ iconName: 'AddFriend' }} allowDisabledFocus>
                    Add Publisher
                </DefaultButton>

                {/* <DefaultButton 
                onClick={importPublishers}
                iconProps={{ iconName: 'AddFriend' }} allowDisabledFocus>
                    Import Publishers
                </DefaultButton> */}
            </div>
            {
                   value?.docs && value?.docs.map(p => p.data()).length > 0 ?
                    <SearchBox
                    className="mt-5"
                    placeholder="Search Publishers" onKeyDown={(newValue) => setSearch(newValue.currentTarget.value)} /> : null
                }
            {
                loading ? <Spinner className="pt-10" size={SpinnerSize.large} /> :
                value?.docs
                .filter(p => {
                    let publisher : Publisher = p.data()
                    return publisher.firstName?.toLowerCase().includes(search.toLowerCase()) || publisher.lastName?.toLowerCase().includes(search.toLowerCase())
                })
                .map(data => {
                    let publisher : Publisher = data.data() 
                    return (
                        <Link 
                        to={`${path}/${publisher.uid}`}
                        key={publisher.uid}
                        className="px-2 py-3 bg-white rounded shadow text-black my-2 flex items-center hover:bg-gray-10 hover:bg-opacity-50 cursor-pointer">
                            <PublisherTile publisher={publisher} />
                        </Link>
                    )
                })
            }
        </div>
    )
}
