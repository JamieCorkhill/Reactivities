import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import { Header, Icon, List } from 'semantic-ui-react'

function App() {
	const [values, setValues] = useState([]);

	useEffect(() => {
		const doWork = async () => {
			const response = await axios.get('http://localhost:5000/api/values');
			setValues(response.data);
		}

		doWork();
	}, []);

	return (
		<div>
			<Header as='h2'>
				<Icon name='plug' />
				<Header.Content>Uptime Guarantee</Header.Content>
			</Header>
			
			<List>
				{
					values.map((value: any) => <List.Item key={value.id}>{value.name}</List.Item>)
				}
			</List>
		</div>
	);
}

export default App;
