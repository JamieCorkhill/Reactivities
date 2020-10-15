import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/Activity';
import axios from 'axios';
import { NavBar } from '../../features/nav/NavBar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import { Nullable } from '../../types';

export const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<
        Nullable<IActivity>
    >(null);
    const [editMode, setEditMode] = useState(false);

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter((a) => a.id === id)[0]);
        setEditMode(false);
    };

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    };

    const handleCreateActivity = (activity: IActivity) => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
    };

    const handleEditActivity = (activity: IActivity) => {
        setActivities([
            ...activities.filter((a) => a.id !== activity.id),
            activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
    };

    const handleDeleteActivity = (id: string) => {
        setActivities([...activities.filter((a) => a.id !== id)]);
    };

    useEffect(() => {
        axios
            .get<IActivity[]>('http://localhost:5000/api/activities')
            .then((r) => {
                const activities: IActivity[] = [];
                r.data.forEach((activity) => {
                    activity.date = activity.date.split('.')[0];
                    activities.push(activity);
                });
                setActivities(activities);
            });
    }, []);

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
                />
            </Container>
        </React.Fragment>
    );
};
