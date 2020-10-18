import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Grid } from 'semantic-ui-react';

import ActivityStore from '../../../app/stores/ActivityStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { ActivityDetailsHeader } from './ActivityDetailsHeader';
import { ActivityDetailedInfo } from './ActivityDetailedInfo';
import { ActivityDetailedChat } from './ActivityDetailedChat';
import { ActivityDetailedSidebar } from './ActivityDetailedSidebar';

interface IDetailParams {
    id: string;
}

export const ActivityDetails: React.FC<
    RouteComponentProps<IDetailParams>
> = observer(({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const { 
        loadActivity,
        activity,
        loadingInitial
    } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id]);

    if (loadingInitial)
        return <LoadingComponent content="Loading activity..."/>

    if (!activity)
        return <h2>Not Found</h2>;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailsHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar/>
            </Grid.Column>
        </Grid>
    );
});
