import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom';
import { GlobalContext } from '../store/GlobalState';

export default function ProtectedRoute(props: any) {
    const {  auth } = useContext(GlobalContext)
        if (auth.currentUser && !auth.currentUser.isAnonymous) {
            return (
                <Route strict={true} sensitive={true} exact={props.exact} path={props.path}>{props.children}</Route>
            )
        } else {
            return (<Redirect to={props.redirectTo} />)
        }

}
