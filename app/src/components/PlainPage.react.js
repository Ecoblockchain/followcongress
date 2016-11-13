import React from 'react'
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

const canned = {
  
};

class PlainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: canned[props.route.content],
      title : props.route.title
    };
  }
  render() {
    let content = {__html:this.state.content};

    return <div>
      <AppBar
        title={this.state.title}
        iconElementLeft={<IconButton><ArrowBack /></IconButton>}
        onLeftIconButtonTouchTap={this.goBack} />
      <div dangerouslySetInnerHTML={content}></div>
    </div>;
  }

  goBack = () => this.props.history.goBack();
}

export {PlainPage}
