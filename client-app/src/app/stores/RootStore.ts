import { configure } from "mobx";
import { createContext } from "react";

import ActivityStore from "./ActivityStore";
import UserStore from "./UserStore";

configure({ enforceActions: 'always' })

export class RootStore {
    public activityStore: ActivityStore;
    public userStore: UserStore;

    public constructor () {
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());