import { Nullable } from "../../types";

export interface IActivity {
    id: string;
    title: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    date: Date;
}

export interface IActivityFormValues extends Partial<IActivity> {
    time?: Date;
}

export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined;
    title = '';
    category = '';
    description = '';
    date?: Date = undefined;
    time?: Date = undefined;
    city = '';
    venue = '';

    constructor(init?: IActivityFormValues) {
        if (init && init.date) {
            init.time = init.date;
        }

        Object.assign(this, init);
    }
}