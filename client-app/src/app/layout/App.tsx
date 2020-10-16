import React, { useEffect, useContext } from 'react';
import { Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Container } from 'semantic-ui-react';

import { NavBar } from '../../features/nav/NavBar';

// Router Components
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import { HomePage } from '../../features/home/HomePage';
import { ActivityForm } from '../../features/activities/form/ActivityForm';
import { ActivityDetails } from '../../features/activities/details/ActivityDetails';

import { LoadingComponent } from './LoadingComponent';

import ActivityStore from '../stores/ActivityStore';




export const App = observer(() => {
    const activityStore = useContext(ActivityStore);

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if (activityStore.loadingInitial)
        return <LoadingComponent content='Loading activities...' />;

    return (
        <React.Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <Route path='/' component={HomePage} exact/>
                <Route path='/activities' exact component={ActivityDashboard}/>
                <Route path='/activities/:id' component={ActivityDetails}/>
                <Route path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
            </Container>
        </React.Fragment>
    );
});
