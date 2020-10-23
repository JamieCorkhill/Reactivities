import React, { FormEvent, useContext, useState, useEffect } from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { ActivityFormValues, IActivity, IActivityFormValues } from '../../../app/models/Activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/ActivityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../../app/common/form/TextInput';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import { DateInput } from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/utils/utils';
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/RootStore';

const validate = combineValidators({
    title: isRequired({ message: 'The event title is required.' }),
    category: isRequired('category'),
    description: composeValidators(
        isRequired('desctipion'),
        hasLengthGreaterThan(4)({ message: 'Description should be at least 5 chars' }),
    ),
    city: isRequired('city'),
    venue: isRequired('venue'),
    date: isRequired('date'),
    time: isRequired('time')
});

interface IDetailParams {
    id: string;
}

export const ActivityForm: React.FC<
    RouteComponentProps<IDetailParams>
> = observer(({ match, history}) => {
    const rootStore = useContext(RootStoreContext);
    const { 
        createActivity, 
        editActivity, 
        loadActivity,
        clearActivity,
        submitting, 
        activity: initialFormState 
    } = rootStore.activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then((activity) => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }

        return () => clearActivity();
    }, [
        loadActivity, 
        match.params.id, 
    ]);

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        
        if (!activity) {
            const newActivity = {
                ...activity,
                id: uuid(),
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form onSubmit={handleSubmit} loading={loading}>
                                <Field
                                    component={TextInput}
                                    name='title'
                                    placeholder='Title'
                                    value={activity.title}
                                />
                                <Field
                                    component={TextAreaInput}
                                    name='description'
                                    rows={2}
                                    placeholder='Description'
                                    value={activity.description}
                                />
                                <Field
                                    component={SelectInput}
                                    options={category}
                                    name='category'
                                    placeholder='Category'
                                    value={activity.category}
                                />
                                <Form.Group widths='equal'>
                                    <Field
                                        component={DateInput}
                                        date
                                        name='date'
                                        placeholder='Date'
                                        value={activity.date}
                                    />
                                    <Field
                                        component={DateInput}
                                        name='time'
                                        time
                                        placeholder='Date'
                                        value={activity.time}
                                    />
                                </Form.Group>
                                <Field
                                    component={TextInput}
                                    name='city'
                                    placeholder='City'
                                    value={activity.city}
                                />
                                <Field
                                    component={TextInput}
                                    name='venue'
                                    placeholder='Venue'
                                    value={activity.venue}
                                />
                                <Button
                                    disabled={loading}
                                    loading={submitting}
                                    floated='right'
                                    positive
                                    type='submit'
                                    content='Submit'
                                />
                                <Button
                                    disabled={loading || invalid || pristine}
                                    onClick={
                                        activity.id 
                                            ? () => history.push(`/activities/${activity.id}`) 
                                            : () => history.push('/activities')
                                        }
                                    floated='right'
                                    content='Cancel'
                                />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>
    );
});
