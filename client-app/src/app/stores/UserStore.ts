import { action, computed, makeObservable, observable, runInAction } from "mobx";
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
            history.push('/activities')
        } catch (e) {
            throw e;
        } finally {

        }
    }

    @computed
    public get isLoggedIn() { return !!this.user; }
}