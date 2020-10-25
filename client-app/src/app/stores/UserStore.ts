import { action, computed, makeObservable, observable, runInAction, values } from "mobx";
import { history } from "../..";
import { Nullable } from "../../types";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/User";
import { RootStore } from "./RootStore";

export default class UserStore {
    private rootStore: RootStore;

    @observable
    public user: Nullable<IUser> = null;

    public constructor(rootStore: RootStore) {
        makeObservable(this);

        this.rootStore = rootStore;
    }

    @action
    public login = async (values: IUserFormValues) => {
        try {
            const user = await agent.user.login(values);
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities')
        } catch (e) {
            throw e;
        } finally {

        }
    }

    @action
    public register = async (values: IUserFormValues) => {
        try {
            const user = await agent.user.register(values);
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        } catch (e) {
            throw e;
        }
    }

    @action
    public getUser = async () => {
        try {
            const user = await agent.user.current();
            runInAction(() => {
                this.user = user;
            });
        } catch (e) {
            console.error(e);
        }
    }

    @action
    public logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    @computed
    public get isLoggedIn() { return !!this.user; }
}