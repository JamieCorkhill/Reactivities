import { RootStore } from "./RootStore";
import { observable, action, reaction } from 'mobx';
import { Nullable } from "../../types";

export default class CommonStore {
    rootStore: RootStore;

    @observable
    public token: Nullable<string> = window.localStorage.getItem('jwt');

    @observable
    public isAppLoaded = false;

    public constructor (rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        );
    }

    @action
    public setToken = (token: Nullable<string>) => {
        this.token = token;
    }

    @action
    public setAppLoaded = () => this.isAppLoaded = true;
}