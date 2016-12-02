import React from 'react'

const connect = (mapStateToProps) => {
  return (Component) => {
    return class extends React.Component {
      static contextTypes = {
        store: React.PropTypes.object.isRequired,
      }

      state = {
        // only keep the props we need for this component
        componentProps: mapStateToProps(this.context.store.getState()),
      }

      componentWillMount() {
        // Every time the store changes, I know I will get a new state out of
        // this, so lets force the update
        // We could alternatively just put this on the state, and then set
        // the state
        this.context.store.subscribe(() => this.setState({
          componentProps: mapStateToProps(this.context.store.getState())
        }));
      }

      render() {
        // Pull the store off of context
        // What are the props we need to pass?
        // --> That is what the mapStateToProps function is for!
        // --> if we pass thhe state to mapStateToProps, we will get the
        // --> function
        // Nothing is happening when we click the buttons because we're not
        // listening for changes!
        // --> When the component mounts we can listen to the store

        // Make sure that we always pass through the component's own props
        // as well as the props that we get from mapStateToProps
        return (
          <Component
            {...this.props}
            {...this.state.componentProps}
            dispatch={this.context.store.dispatch}
          />
        );
      }
    }
  }
}

export default connect
