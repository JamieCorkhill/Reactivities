import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Grid } from 'semantic-ui-react';

import { ActivityList } from './ActivityList';
import ActivityStore from '../../../app/stores/ActivityStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/RootStore';

export const ActivityDashboard: React.FC = observer(() => {
    const rootStore = useContext(RootStoreContext);
    const { loadActivities, loadingInitial } = rootStore.activityStore;

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    if (loadingInitial)
        return <LoadingComponent content='Loading activities...' />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity Filter</h2>
            </Grid.Column>
        </Grid>
    );
});
