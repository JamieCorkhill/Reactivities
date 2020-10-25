import { configure } from "mobx";
import { createContext } from "react";

import ActivityStore from "./ActivityStore";
import UserStore from "./UserStore";
import CommonStore from './CommonStore';
import ModalStore from './ModalStore';

configure({ enforceActions: 'always' })

export class RootStore {
    public activityStore: ActivityStore;
    public userStore: UserStore;
    public commonStore: CommonStore;
    public modalStore: ModalStore;

    public constructor () {
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());