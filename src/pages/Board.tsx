import React, { useContext, useEffect } from 'react'
import { Icon, Pivot, PivotItem, Spinner, Text } from '@fluentui/react';
import MeetingView from '../components/MeetingView';
import { NeutralColors, SharedColors } from '@fluentui/theme';
import { GlobalContext } from '../store/GlobalState';
import { Link } from 'react-router-dom';
import ServiceMeetingView from './ServiceMeetingView';
import GroupView from './GroupView';
export default function Board() {


  const { auth } = useContext(GlobalContext)


  const signIn = async () => { 
      try {
          await auth.signInAnonymously()
      } catch (error) { 
          console.log(error)
      }
  } 

  useEffect(() => {
    console.log(auth)
      if (!auth.currentUser) {
          signIn() 
      }
      // eslint-disable-next-line
  }, [])
    
      const PivotTabs = () => (
        <div className="container mx-auto pb-10 pt-4 px-4">
          <div className="flex justify-between items-center">
          <Text className="leading-5 my-5 font-bold text-gray-400">
            Tableau d'Affichage <br/>
            <span className="text-2xl text-black">Bronx Concourse French - New York NY (USA)</span>
          </Text>
          {
            auth.currentUser ?
            <Link 
                style={{ color: SharedColors.green20}}
                className="py-4 items-center inline-flex text-center"
                to={auth.currentUser.isAnonymous ? '/login' : '/admin'}>
                <Icon iconName={auth.currentUser.isAnonymous ? 'SchoolDataSyncLogo' : 'FollowUser'} className="mr-2"/>
                <Text>{ auth.currentUser.isAnonymous ? 'Login' : 'Dashboard' }</Text>
            </Link> : null
          }
              
          </div>

          <Pivot 
          styles={{
              linkIsSelected: {
                fontWeight: 'bold'
              },
              link: {
                  fontWeight: 'bold',
                  backgroundColor: NeutralColors.gray10
              }
          }}
          linkFormat="links">
            <PivotItem headerText="Réunions">
              <MeetingView />
            </PivotItem>
            <PivotItem headerText="Prédication">
              <ServiceMeetingView />
            </PivotItem>
            <PivotItem headerText="Groupes">
              <GroupView />
            </PivotItem>
          </Pivot>
        </div>
      );

    return !auth.currentUser ? <Spinner className="mt-64" /> : <PivotTabs />
      
}
