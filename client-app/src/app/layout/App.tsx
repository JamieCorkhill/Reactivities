import React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Container } from 'semantic-ui-react';

import { NavBar } from '../../features/nav/NavBar';

// Router Components
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import { HomePage } from '../../features/home/HomePage';
import { ActivityForm } from '../../features/activities/form/ActivityForm';
import { ActivityDetails } from '../../features/activities/details/ActivityDetails';

const AppComponent: React.FC<RouteComponentProps> = observer(({ location }) => {
    return (
        <React.Fragment>
            <Route path='/' component={HomePage} exact/>
            <Route path={'/(.+)'} render={() => (
                <React.Fragment>
                <NavBar />
                    <Container style={{ marginTop: '7em' }}>
                        
                        <Route path='/activities' exact component={ActivityDashboard}/>
                        <Route path='/activities/:id' component={ActivityDetails}/>
                        <Route 
                            key={location.key} 
                            path={['/createActivity', '/manage/:id']} 
                            component={ActivityForm}
                        />
                    </Container>
                </React.Fragment>
            )}/>
        </React.Fragment>
    );
});

export const App = withRouter(AppComponent);