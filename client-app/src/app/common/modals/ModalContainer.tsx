import React, { useContext } from 'react'
import { Modal } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/RootStore';
import { observer } from 'mobx-react-lite';

export const ModalContainer = observer(() => {
    const rootStore = useContext(RootStoreContext);
    const { modal: { open, body }, closeModal } = rootStore.modalStore;

    return (
        <Modal open={open} onClose={closeModal} size='mini'>
            <Modal.Content>
                {body}
            </Modal.Content>
        </Modal>
    );
});
