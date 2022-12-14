import * as React from 'react'
import { Form, Button, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, updateNote, getTodoById, patchTodo } from '../api/todos-api'
import { Todo } from '../types/Todo'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
}

interface EditTodoState {
  todo: Todo
  note: string
  name: string
  dueDate: string
  file: any
  uploadState: UploadState
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    todo : {
      todoId : '',
      createdAt : '',
      done : false,
      dueDate : '',
      name : '',
      note : ''
    },
    note: "",
    name:"",
    dueDate:"",
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ note: event.target.value })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ dueDate: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  handleSubmitNote = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await patchTodo(this.props.auth.getIdToken(), this.props.match.params.todoId, {
        name: this.state.name,
        dueDate: this.state.dueDate,
        done: this.state.todo.done,
        note: this.state.note
      })
      
      alert('Updated')

    } catch(e) {
      alert(e)
      alert('Update fail')
    }

  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>TODO edit</h1>
        <Form onSubmit={this.handleSubmitNote}>
          <Form.Field>
            <label>Name</label>
            <Input placeholder='Name' onChange={this.handleNameChange} 
            defaultValue = {this.state.todo.name}            
            />
            
            <label>Due Date</label>
            <Input placeholder='DueDate' onChange={this.handleDueDateChange} 
            defaultValue = {this.state.todo.dueDate}            
            />

            <label>Note</label>
            <Input placeholder='Note' onChange={this.handleNoteChange} 
            defaultValue = {this.state.todo.note}            
            />

          </Form.Field>

          {this.renderButtonChange()}
        </Form>
        <hr/>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form> 
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit">
          Upload
        </Button>
      </div>
    )
  }

  renderButtonChange() {
    return (
      <div>
        <Button type="submit">
          Update
        </Button>
      </div>
    )
  }

  async componentDidMount() {
    try {
      console.log("onTodoGet start with id : " + this.props.match.params.todoId)
      const todo = await getTodoById(this.props.auth.getIdToken(), this.props.match.params.todoId)

      console.log("todo = : " + todo)
      this.setState({
        todo: todo,
        note: todo.note,
        name: todo.name,
        dueDate: todo.dueDate
      })

      console.log("onTodoGet end")

    } catch {
      alert('Todo get failed')
    }
  }

}
