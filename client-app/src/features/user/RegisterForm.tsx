import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react'
import { Form as FinalForm, Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header } from 'semantic-ui-react';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import { TextInput } from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/User';
import { RootStoreContext } from '../../app/stores/RootStore';

const validate = combineValidators({
    username: isRequired('email'),
    displayName: isRequired('password'),
    email: isRequired('email'),
    password: isRequired('password')
});

export const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
const { register } = rootStore.userStore;

    return (
        <FinalForm
            onSubmit={(values: IUserFormValues) => register(values).catch(error => ({
                [FORM_ERROR]: error
            }))}
            validate={validate}
            render={({ 
                handleSubmit, 
                submitting, 
                form, 
                submitError, 
                invalid, 
                pristine,
                dirtySinceLastSubmit 
            }) => (
                <Form onSubmit={handleSubmit}>
                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign='center' />
                    <Field
                        name='username'
                        component={TextInput}
                        placeholder='Username'
                    />
                    <Field
                        name='displayname'
                        component={TextInput}
                        placeholder='Display Name'
                    />
                    <Field
                        name='email'
                        component={TextInput}
                        placeholder='Email'
                    />
                    <Field
                        name='password'
                        component={TextInput}
                        placeholder='Password'
                        type='password'
                    />
                    {submitError && !dirtySinceLastSubmit && (
                        <ErrorMessage error={submitError} text='Invalid email or password'/>
                    )}
                    <Button 
                        fluid 
                        disabled={invalid && !dirtySinceLastSubmit || pristine} 
                        loading={submitting} 
                        color='teal' 
                        content='Register'
                    />
                </Form>
            )}
        />
    )
}
