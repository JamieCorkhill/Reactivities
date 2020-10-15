import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite';

import { Button, Container, Menu } from 'semantic-ui-react';

import ActivityStore from '../../app/stores/ActivityStore';

export const NavBar: React.FC = observer(() => {
    const activityStore = useContext(ActivityStore);
    const { openCreateForm } = activityStore;

    return (
        <div>
            <Menu fixed="top" inverted>
                <Container>
                    <Menu.Item header>
                        <img src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }}/>
                        Reactivities
                    </Menu.Item>
                    <Menu.Item name="Activities"/>
                    <Menu.Item>
                        <Button onClick={openCreateForm} positive content="Create Activity"></Button>
                    </Menu.Item>
                </Container>
            </Menu>
        </div>
    );
});
