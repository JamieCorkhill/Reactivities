import React from 'react'
import { FieldRenderProps } from 'react-final-form';
import { DateTimePicker } from 'react-widgets';
import { Form, FormFieldProps, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {}

export const DateInput: React.FC<IProps> = ({ 
    input, 
    width, 
    date = false,
    time = false,
    placeholder, 
    meta: { touched, error }, 
    ...rest
}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <DateTimePicker 
                date={date}
                time={time}
                id={null as any}
                messages={{ dateButton: 'gfd', timeButton: 'gfd'}}
                onBlur={input.onBlur}
                onKeyDown={e => e.preventDefault()}
                placeholder={placeholder}
                value={new Date(input.value) || null}
                onChange={input.onChange}
                {...rest}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}
