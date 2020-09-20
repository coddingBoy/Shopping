import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { listTodos } from './graphql/queries'
import { createTodo, createTodo as createTodoMutation, deleteTodo, deleteTodo as deleteTodoMutation } from './graphql/mutations'

const initialFormState = { name: '', description: '', image: '' }

class App extends React.Component {
	constructor(props: any) {
		super(props)
	}
	state = {
		todoList: [],
		formData: initialFormState
	}
	componentDidMount() {
		this.fetchTodo()
	}
	fetchTodo = async () => {
		const apiData: any = await API.graphql({ query: listTodos })
		const items = apiData.data.listTodos.items
		await Promise.all(items.map(async (item: any) => {
			if (item.image) {
				const image = await Storage.get(item.image)
				item.image = image
			}
			return item
		}))
		this.setState({
			todoList: apiData.data.listTodos.items
		})
	}
	createTodo = async () => {
		if (!this.state.formData.name || !this.state.formData.description) return
		await API.graphql({
			query: createTodo, variables: { input: this.state.formData }
		})
		if (this.state.formData.image) {
			const image = await Storage.get(this.state.formData.image);
			this.setState({
				formData: { ...this.state.formData, image }
			})
		}
		this.fetchTodo()
		this.setState({
			formData: initialFormState
		})
	}
	deleteTodo = async (id: string) => {
		const newTodoList = this.state.todoList.filter((e: any) => e.id !== id)
		this.setState({
			todoList: newTodoList
		})
		await API.graphql({
			query: deleteTodo, variables: { input: { id } }
		})
	}
	onChange = async (e: any) => {
		if (!e.target.files[0]) return
		const file = e.target.files[0];
		this.setState({
			formData: {
				...this.state.formData, image: file.name
			}
		})
		await Storage.put(file.name, file);
		this.fetchTodo();
	}
	render() {
		return (
			<>
				<h1>My todo App</h1>
				<input
					onChange={e => { this.setState({ formData: { ...this.state.formData, 'name': e.target.value } }) }}
					placeholder="Note name"
					value={this.state.formData.name}
				/>
				<input
					onChange={e => { this.setState({ formData: { ...this.state.formData, 'description': e.target.value } }) }}
					placeholder="Note description"
					value={this.state.formData.description}
				/>
				<input
					type="file"
					onChange={this.onChange}
				/>
				<button onClick={this.createTodo}>Create Note</button>
				<div style={{ marginBottom: 30 }}>
					{
						this.state.todoList.map((note: any) => (
							<div key={note.id || note.name}>
								<h2>{note.name}</h2>
								<p>{note.description}</p>
								<button onClick={() => this.deleteTodo(note.id)}>Delete note</button>
								{
									note.image && <img src={note.image} style={{ width: 400 }} />
								}
							</div>
						))
					}
				</div>
				<h1>
					Hello Strataki
				</h1>
				<AmplifySignOut />
			</>
		);
	}
}

export default withAuthenticator(hot(App))
