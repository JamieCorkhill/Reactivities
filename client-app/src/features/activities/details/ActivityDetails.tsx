import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';

import { Button, Card, Image } from 'semantic-ui-react';

import ActivityStore from '../../../app/stores/ActivityStore';

export const ActivityDetails: React.FC = observer(() => {
    const activityStore = useContext(ActivityStore);
    const { 
        openEditForm, 
        cancelSelectedActivity, 
        selectedActivity: activity 
    } = activityStore;

    return (
        <Card fluid>
            <Image
                src={`/assets/categoryImages/${activity!.category}.jpg`}
                wrapped
                ui={false}
            />
            <Card.Content>
                <Card.Header>{activity!.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{activity!.date}</span>
                </Card.Meta>
                <Card.Description>{activity!.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button
                        onClick={() => openEditForm(activity!.id)}
                        basic
                        color='blue'
                        content='Edit'
                    />
                    <Button
                        onClick={cancelSelectedActivity}
                        basic
                        color='grey'
                        content='Cancel'
                    />
                </Button.Group>
            </Card.Content>
        </Card>
    );
});
