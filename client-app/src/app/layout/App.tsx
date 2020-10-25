import React, { useContext, useEffect } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Container } from 'semantic-ui-react';

import { NavBar } from '../../features/nav/NavBar';

import { ToastContainer } from 'react-toastify';

// Router Components
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import { HomePage } from '../../features/home/HomePage';
import { ActivityForm } from '../../features/activities/form/ActivityForm';
import { ActivityDetails } from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { RootStoreContext } from '../stores/RootStore';
import { LoadingComponent } from './LoadingComponent';
import { ModalContainer } from '../common/modals/ModalContainer';

const AppComponent: React.FC<RouteComponentProps> = observer(({ location }) => {
    const rootStore = useContext(RootStoreContext);
    const { setAppLoaded, token, isAppLoaded } = rootStore.commonStore;
    const { getUser } = rootStore.userStore;

    useEffect(() => {
        if (token) {
            getUser().finally(() => setAppLoaded());
        } else {
            setAppLoaded();
        }
    }, [token, getUser, setAppLoaded]);

    if (!isAppLoaded)
        return <LoadingComponent content='Loading app...'/>
    
    return (
        <React.Fragment>
            <ModalContainer/>
            <ToastContainer position='bottom-right'/>
            <Route path='/' component={HomePage} exact/>
            <Route path={'/(.+)'} render={() => (
                <React.Fragment>
                <NavBar />
                    <Container style={{ marginTop: '7em' }}>
                        <Switch>
                            <Route path='/activities' exact component={ActivityDashboard}/>
                            <Route path='/activities/:id' component={ActivityDetails}/>
                            <Route 
                                key={location.key} 
                                path={['/createActivity', '/manage/:id']} 
                                component={ActivityForm}
                            />
                            <Route component={NotFound}/>
                        </Switch>
                    </Container>
                </React.Fragment>
            )}/>
        </React.Fragment>
    );
});

export const App = withRouter(AppComponent);