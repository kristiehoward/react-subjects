////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Make `withMousePosition` a "higher-order component" that sends the mouse
// position to the component as props.
//
// Hint: use `event.clientX` and `event.clientY`
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

const withMousePosition = (Component) => {
  return class extends React.Component {
    state = {
      x: 0,
      y: 0,
    }

    getMousePosition = (e) => {
      this.setState({
        x: e.clientX,
        y: e.clientY,
      });
    }

    render() {
      return (
        <div onMouseMove={this.getMousePosition} >
          <Component {...this.props} mouse={this.state} />
        </div>
      );
    }
  }
}

class App extends React.Component {
  static propTypes = {
    message: PropTypes.string,
    mouse: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired
  }

  render() {
    const { mouse } = this.props

    return (
      <div style={{ height: '100%' }}>
        {this.props.message}
        {mouse ? (
          <h1>The mouse position is ({mouse.x}, {mouse.y})</h1>
        ) : (
          <h1>We don't know the mouse position yet :(</h1>
        )}
      </div>
    )
  }
}

const AppWithMouse = withMousePosition(App)

ReactDOM.render(<AppWithMouse message="Hello!" />, document.getElementById('app'))
