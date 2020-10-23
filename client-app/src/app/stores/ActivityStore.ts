import { action, computed, makeObservable, observable, configure, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Nullable } from '../../types';
import agent from '../api/agent';
import { IActivity } from '../models/Activity';
import { RootStore } from './RootStore';

export default class ActivityStore {
    private rootStore: RootStore;

    @observable
    public activityRegistry: Map<string, IActivity> = new Map();

    @observable
    public activity: Nullable<IActivity> = null;

    @observable
    public loadingInitial = false;

    @observable
    public submitting = false;

    @observable
    public loadingTarget = '';

    public constructor(rootStore: RootStore) {
        makeObservable(this);

        this.rootStore = rootStore;
    }

    @action
    public loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activities = await agent.activities.list();

            runInAction(() => {
                this.withDateFormatted(activities)
                    .forEach(activity => this.activityRegistry.set(activity.id, activity));
            });
        } catch (e) {
            console.log(e);
        } finally {
            runInAction(() => this.loadingInitial = false);
        }
    }

    @action
    public loadActivity = async (id: string): Promise<IActivity> => {
        const activityOrNone = this.getActivity(id);

        if (activityOrNone) {
            this.activity = activityOrNone;
            return activityOrNone;
        }  
        
        this.loadingInitial = true;
        try {
            const activity = await agent.activities.details(id);
            runInAction(() => {
                this.activity = { ...activity, date: new Date(activity.date) };
                this.activityRegistry.set(activity.id, activity);
            });
            return activity;
        } catch (e) {
           console.log(e);
           throw e;
        } finally {
            runInAction(() => this.loadingInitial = false);
        }
    }

    @action
    public clearActivity = () => {
        this.activity = null;
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action
    public createActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            });
            history.push(`/activities/${activity.id}`)
        } catch (e) {
            toast.error('error submitting data')
        } finally {
            runInAction(() => this.submitting = false);
        }
    }

    @action
    public editActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            });
            history.push(`/activities/${activity.id}`)
        } catch (e) {
            toast.error('error submitting data')
        } finally {
            runInAction(() => this.submitting = false);
        }
    }

    @action
    public deleteActivity = async (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.loadingTarget = e.currentTarget.name;

        try {
            await agent.activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
            });
        } catch (e) {
            console.log(e);
        } finally {
            runInAction(() => {
                this.submitting = false;
                this.loadingTarget = '';
            });
        }
    }

    @computed
    public get activitiesByDate() {
        return this.groupActivitiesByDate(
            Array.from(this.activityRegistry.values())
        );
    }

    private groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    private withDateFormatted(activities: IActivity[]): IActivity[] {
        return activities.map((a) => ({
            ...a,
            date: new Date(a.date),
        }));
    }
}