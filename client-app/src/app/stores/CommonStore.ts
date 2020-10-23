import { RootStore } from "./RootStore";

export default class CommonStore {
    rootStore: RootStore;

    public constructor (rootStore: RootStore) {
        this.rootStore = rootStore;
    }
}