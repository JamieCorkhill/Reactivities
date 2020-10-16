import { action, computed, makeObservable, observable, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { act } from 'react-dom/test-utils';
import agent from '../api/agent';
import { IActivity } from '../models/Activity';

configure({ enforceActions: 'always' })

class ActivityStore {
    @observable
    public activityRegistry: Map<string, IActivity> = new Map();

    @observable
    public activity: IActivity | undefined;

    @observable
    public loadingInitial = false;

    @observable
    public editMode = false;

    @observable
    public submitting = false;

    @observable
    public loadingTarget = '';

    public constructor() {
        makeObservable(this);
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
    public loadActivity = async (id: string) => {
        const activityOrNone = this.getActivity(id);

        if (activityOrNone) {
            this.activity = activityOrNone;
            return;
        }  
        
        this.loadingInitial = true;
        try {
            const activity = await agent.activities.details(id);
            runInAction(() => {
                this.activity = activity;
            });
        } catch (e) {
           console.log(e);
        } finally {
            runInAction(() => this.loadingInitial = false);
        }
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
                this.editMode = false;
            });
        } catch (e) {
            console.log(e);
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
                this.editMode = false;
            });
        } catch (e) {
            console.log(e);
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

    @action
    public openCreateForm = () => {
        this.editMode = true;
        this.activity = undefined;
    }

    @action
    public openEditForm = (id: string) => {
        this.activity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action
    public cancelSelectedActivity = () => {
        this.activity = undefined;
    }

    @action
    public cancelFormOpen = () => {
        this.editMode = false;
    }

    @action
    public selectActivity = (id: string) => {
        this.activity = this.activityRegistry.get(id);
        this.editMode = false;
    }

    @computed
    public get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
    }

    private withDateFormatted(activities: IActivity[]): IActivity[] {
        return activities.map((a) => ({
            ...a,
            date: a.date.split('.')[0],
        }));
    }
}

export default createContext(new ActivityStore());
