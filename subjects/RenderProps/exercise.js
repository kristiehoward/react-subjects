////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Refactor App by creating a new component named `<GeoPosition>`
// - <GeoPosition> should use a child render callback that passes
//   to <App> the latitude and longitude state
// - When you're done, <App> should no longer have anything but
//   a render method
//
// Got extra time?
//
// - Now create a <GeoAddress> component that also uses a render
//   callback with the current address. You will use
//   `getAddressFromCoords(latitude, longitude)` to get the
//   address, it returns a promise.
// - You should be able to compose <GeoPosition> and <GeoAddress>
//   beneath it to naturally compose both the UI and the state
//   needed to render it
// - Make sure <GeoAddress> supports the user moving positions
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import LoadingDots from './utils/LoadingDots'
import getAddressFromCoords from './utils/getAddressFromCoords'

class GeoAddress extends React.Component {
  static propTypes = {
    coords: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    children: PropTypes.func.isRequired,
  }

  state = {
    address: '',
    error: null
  }

  componentWillReceiveProps(nextProps) {
    const { latitude, longitude } = nextProps.coords;
    getAddressFromCoords(latitude, longitude)
      .then((address) => {
        this.setState({ address });
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  // always needs to get new props as the address changes
  render() {
    return this.props.children(this.state);
  }
}

class GeoPosition extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  state = {
    coords: {
      latitude: null,
      longitude: null
    },
    error: null
  }

  componentDidMount() {
    this.geoId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      },
      (error) => {
        this.setState({ error })
      }
    )
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.geoId)
  }

  render() {
    return this.props.children(this.state);
  }
}

class App extends React.Component {

  renderAddress = ({ error, address }) => {
    if (error) {
      return <div>ADDRESS Error: {error.message}</div>
    }
    return (
      <dl>
        <dt>Your Address is:</dt>
        <dd>{address || <LoadingDots/>}</dd>
      </dl>
    );
  }

  renderPosition = ({ error, coords }) => {
    if (error) {
      return <div>Error: {error.message}</div>
    }
    return (
      <dl>
        <dt>Latitude</dt>
        <dd>{coords.latitude || <LoadingDots/>}</dd>
        <dt>Longitude</dt>
        <dd>{coords.longitude || <LoadingDots/>}</dd>
        <GeoAddress coords={coords}>
          {this.renderAddress}
        </GeoAddress>
      </dl>
    );
  }

  render() {
    return (
      <div>
        <h1>Geolocation</h1>
        <GeoPosition>
          {this.renderPosition}
        </GeoPosition>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
