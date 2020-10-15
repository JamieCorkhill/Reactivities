import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/Activity';
import { NavBar } from '../../features/nav/NavBar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import { Nullable } from '../../types';

import agent from './../api/agent';
import { LoadingComponent } from './LoadingComponent';

export const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<
        Nullable<IActivity>
    >(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [target, setTarget] = useState('');

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter((a) => a.id === id)[0]);
        setEditMode(false);
    };

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    };

    const handleCreateActivity = async (activity: IActivity) => {
        setSubmitting(true);
        await agent.activities.create(activity);
        setSubmitting(false);

        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
    };

    const handleEditActivity = async (activity: IActivity) => {
        setSubmitting(true);
        await agent.activities.update(activity);
        setSubmitting(false);

        setActivities([
            ...activities.filter((a) => a.id !== activity.id),
            activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
    };

    const handleDeleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setTarget(event?.currentTarget.name);
        setSubmitting(true);
        await agent.activities.delete(id);
        setSubmitting(false);

        setActivities([...activities.filter((a) => a.id !== id)]);
    };

    useEffect(() => {
        agent.activities
            .list()
            .then((r) => {
                const withDateFormatted = r.map((a) => ({
                    ...a,
                    date: a.date.split('.')[0],
                }));
                setActivities(withDateFormatted);
            })
            .then(() => setLoading(false));
    }, []);

    if (loading) return <LoadingComponent content='Loading activities...' />;

    return (
        <React.Fragment>
            <NavBar openCreateForm={handleOpenCreateForm} />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard
                    activities={activities}
                    selectActivity={handleSelectActivity}
                    selectedActivity={selectedActivity}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setSelectedActivity={setSelectedActivity}
                    createActivity={handleCreateActivity}
                    editActivity={handleEditActivity}
                    deleteActivity={handleDeleteActivity}
                    submitting={submitting}
                    target={target}
                />
            </Container>
        </React.Fragment>
    );
};
