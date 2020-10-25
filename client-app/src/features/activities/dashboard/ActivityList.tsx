import React, {  useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Item, Label } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/ActivityStore';
import { ActivityListItem } from './ActivityListItem';
import { RootStoreContext } from '../../../app/stores/RootStore';
import { format } from 'date-fns';

export const ActivityList: React.FC = observer(() => {
    const rootStore = useContext(RootStoreContext);
    const { activitiesByDate } = rootStore.activityStore;

    return (
        <React.Fragment>
            {activitiesByDate.map(([group, activities]) => (
                <React.Fragment key={group}>
                    <Label size='large' color='blue'>{format(group, 'eeee do MMMM')}</Label>
                    <Item.Group divided>
                        {activities.map((activity) => (
                            <ActivityListItem key={activity.id} activity={activity}/>
                        ))}
                    </Item.Group>
                </React.Fragment>
            ))}
        </React.Fragment>
    );
});
