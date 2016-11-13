import React from 'react'

class LiveComponent extends React.Component {
  constructor(props) {
    super(props);

    const {context} = this.props.route;
    this._actions = context.actions;
    this._db = context.db;
  }

  componentWillMount() {

  }

  componentWillUnmount() {
    
  }
}

export {LiveComponent}
