
import { action, observable } from 'mobx';
import { RootStore } from './RootStore';
import { configure } from 'mobx';
export default class ModalStore {
    public rootStore: RootStore;

    @observable.shallow
    public modal = {
        open: false,
        body: null
    };

    public constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    public openModal = (content: any) => {
        this.modal.open = true;
        this.modal.body = content;
    }

    @action
    public closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }    
}