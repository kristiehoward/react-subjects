////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Write a <RainbowList> that only shows the elements in the view.
//
// Got extra time?
//
// - Render fewer rows as the size of the window changes (Hint: Listen
//   for the window's "resize" event)
// - Try rendering a few rows above and beneath the visible area to
//   prevent tearing when scrolling quickly
// - Remember scroll position when you refresh the page
////////////////////////////////////////////////////////////////////////////////
import React, { PropTypes } from 'react'
import { render, findDOMNode } from 'react-dom'
import * as RainbowListDelegate from './RainbowListDelegate'
import './styles'

// 1. What state is there?
// to get the starting index:
// --> how far are we scrolled?
// --> height of each row
// to get our ending index:
// --> height of the viewport or element

// 2. When does it change?
// Changes when we scroll

class RainbowList extends React.Component {
  static propTypes = {
    numRows: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    renderRowAtIndex: PropTypes.func.isRequired
  }

  state = {
    scrollTop: 0,
    availableHeight: 0,
  }

  componentDidMount() {
    this.setState({
      availableHeight: this.node.offsetHeight,
    })
  }

  onScroll = (e) => {
    this.setState({
      scrollTop: e.target.scrollTop,
    });
  }

  render() {
    const { numRows, rowHeight, renderRowAtIndex } = this.props
    const totalHeight = numRows * rowHeight
    const { scrollTop, availableHeight } = this.state;

    const items = []

    // How far am i scrolled down the page?
    // Divided by how tall each thing is ==> index of the top of the list
    // want to see bottom of item, round down
    const startIndex = Math.floor(scrollTop / rowHeight);
    // starting index + num visible rows === ending
    // round up bc want end index to be the next thing
    // (to show the top of the last item)
    const endIndex = startIndex + Math.ceil(availableHeight / rowHeight);

    let index = startIndex
    while (index < endIndex) {
      items.push(<li key={index}>{renderRowAtIndex(index)}</li>)
      index++
    }

    // Need to keep list always in view
    return (
      <div
        onScroll={this.onScroll}
        style={{
          height: '100%',
          overflowY: 'scroll',
          paddingTop: (startIndex * rowHeight) }}
        ref={node => this.node = node}
      >
        <ol style={{ height: totalHeight }}>
          {items}
        </ol>
      </div>
    )
  }
}

render(
  <RainbowList
    numRows={500}
    rowHeight={RainbowListDelegate.rowHeight}
    renderRowAtIndex={RainbowListDelegate.renderRowAtIndex}
  />,
  document.getElementById('app')
)
