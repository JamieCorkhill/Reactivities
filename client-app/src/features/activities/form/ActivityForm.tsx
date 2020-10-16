import React, { FormEvent, useContext, useState, useEffect } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/Activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/ActivityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';

interface IDetailParams {
    id: string;
}

export const ActivityForm: React.FC<
    RouteComponentProps<IDetailParams>
> = observer(({ match }) => {
    const activityStore = useContext(ActivityStore);
    const { 
        createActivity, 
        editActivity, 
        cancelFormOpen, 
        loadActivity,
        submitting, 
        activity: initialFormState 
    } = activityStore;

    useEffect(() => {
        if (match.params.id) {
            loadActivity(match.params.id)
                .then(() => initialFormState && setActivity(initialFormState));
        }
    }, [loadActivity, match.params.id, initialFormState])

    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
    });

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid(),
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    };

    const handleInputChange = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.currentTarget;
        setActivity({
            ...activity,
            [name]: value,
        });
    };

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    onChange={handleInputChange}
                    name='title'
                    placeholder='Title'
                    value={activity.title}
                />
                <Form.TextArea
                    onChange={handleInputChange}
                    name='description'
                    rows={2}
                    placeholder='Description'
                    value={activity.description}
                />
                <Form.Input
                    onChange={handleInputChange}
                    name='category'
                    placeholder='Category'
                    value={activity.category}
                />
                <Form.Input
                    onChange={handleInputChange}
                    name='date'
                    type='datetime-local'
                    placeholder='Date'
                    value={activity.date}
                />
                <Form.Input
                    onChange={handleInputChange}
                    name='city'
                    placeholder='City'
                    value={activity.city}
                />
                <Form.Input
                    onChange={handleInputChange}
                    name='venue'
                    placeholder='Venue'
                    value={activity.venue}
                />
                <Button
                    loading={submitting}
                    floated='right'
                    positive
                    type='submit'
                    content='Submit'
                />
                <Button
                    onClick={cancelFormOpen}
                    floated='right'
                    content='Cancel'
                />
            </Form>
        </Segment>
    );
});
