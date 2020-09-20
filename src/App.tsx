import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

class App extends React.Component {
	render() {
		return (
			<>
				<h1>
					Hello Strataki
				</h1>
				<AmplifySignOut />
			</>
		);
	}
}

export default withAuthenticator(hot(App))
