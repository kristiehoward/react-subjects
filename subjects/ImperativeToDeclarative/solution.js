////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// This Modal, even though its a React component, has an imperative API to
// open and close it. Can you convert it to a declarative API?
////////////////////////////////////////////////////////////////////////////////
import React, { PropTypes } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import $ from 'jquery'
import 'bootstrap-webpack'

class Modal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    // Necessary so that we can pass back that it was closed by jQuery /
    // bootstrap itself
    onClose: PropTypes.func,
    children: PropTypes.node
  }

  componentDidMount() {
    this.doImperativeWork()

    // This is only necessary to keep state in sync
    // with the DOM. Since we're keeping state now,
    // we should make sure it's accurate.

    // Previously:
    // findDOMNode(this) with ref="modal"
    // Now:
    // this.node with ref={node => this.node = node } on the outer div we
    // are returning
    $(this.node).on('hidden.bs.modal', () => {
      if (this.props.onClose)
        this.props.onClose()
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen)
      this.doImperativeWork()
  }

  // NOTE: this is used in the willMount AND didUpdate
  doImperativeWork() {
    if (this.props.isOpen === true) {
      $(this.node).modal('show')
    } else {
      $(this.node).modal('hide')
    }
  }

  render() {
    return (
      <div ref={node => this.node = node } className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  state = {
    isModalOpen: false
  }

  openModal = () => {
    this.setState({ isModalOpen: true })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    return (
      <div className="container">
        <h1>Let’s make bootstrap modal declarative</h1>

        <button
          className="btn btn-primary"
          onClick={this.openModal}
        >open modal</button>

        <Modal
          isOpen={this.state.isModalOpen}
          onClose={this.closeModal}
          title="Declarative is better"
        >
          <p>Calling methods on instances is a FLOW not a STOCK!</p>
          <p>It’s the dynamic process, not the static program in text space.</p>
          <p>You have to experience it over time, rather than in snapshots of state.</p>
          <button
            onClick={this.closeModal}
            type="button"
            className="btn btn-default"
          >Close</button>
        </Modal>

      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
