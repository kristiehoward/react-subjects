import React, { PropTypes } from 'react'

class Provider extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    store: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      store: this.props.store,
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

export default Provider
