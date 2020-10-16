import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';

import { Grid } from 'semantic-ui-react';

import { ActivityDetails } from '../details/ActivityDetails';
import { ActivityForm } from '../form/ActivityForm';
import { ActivityList } from './ActivityList';

import ActivityStore from '../../../app/stores/ActivityStore';

export const ActivityDashboard: React.FC = observer(() => {
    const activityStore = useContext(ActivityStore);
    const { editMode, activity } = activityStore;

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
