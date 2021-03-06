
import InsertImages from '..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import { Editor, Raw } from 'slate'

class Image extends React.Component {

  state = {};

  componentDidMount() {
    const { node } = this.props
    const { data } = node
    const file = data.get('file')
    this.load(file)
  }

  load(file) {
    const reader = new FileReader()
    reader.addEventListener('load', () => this.setState({ src: reader.result }))
    reader.readAsDataURL(file)
  }

  render() {
    const { attributes } = this.props
    const { src } = this.state
    return src
      ? <img {...attributes} src={src} />
      : <span>Loading...</span>
  }

}

const schema = {
  nodes: {
    image: Image
  }
}

class Example extends React.Component {

  plugins = [
    InsertImages({
      applyTransform: (transform, file) => {
        return transform.insertBlock({
          type: 'image',
          isVoid: true,
          data: { file },
        })
      }
    })
  ];

  state = {
    state: Raw.deserialize(initialState, { terse: true })
  };

  onChange = (state) => {
    this.setState({ state })
  }

  render = () => {
    return (
      <Editor
        schema={schema}
        onChange={this.onChange}
        plugins={this.plugins}
        state={this.state.state}
      />
    )
  }
}

const example = <Example />
const root = document.body.querySelector('main')
ReactDOM.render(example, root)
