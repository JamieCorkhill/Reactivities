import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite';

import { Button, Container, Menu } from 'semantic-ui-react';

import ActivityStore from '../../app/stores/ActivityStore';
import { NavLink } from 'react-router-dom';

export const NavBar: React.FC = observer(() => {
    const activityStore = useContext(ActivityStore);
    const { openCreateForm } = activityStore;

    return (
        <div>
            <Menu fixed="top" inverted>
                <Container>
                    <Menu.Item header as={NavLink} exact to='/'>
                        <img src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }}/>
                        Reactivities
                    </Menu.Item>
                    <Menu.Item name="Activities" as={NavLink} to='/activities'/>
                    <Menu.Item>
                        <Button as={NavLink} to='/createActivity' onClick={openCreateForm} positive content="Create Activity"></Button>
                    </Menu.Item>
                </Container>
            </Menu>
        </div>
    );
});
