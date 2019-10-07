import React from 'react';
import DataSource from "../DataSource";
import TextBlock from "../TextBlock";
import withSubscription from "../HOCs/withSubscription";

class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }
  
  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }
  
  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }
  
  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }
  
  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}

export default withSubscription(BlogPost, DataSource => { DataSource.getBlogPost(2) })