import React from 'react';
import Logo from './Logo'

interface TreeNode {
  [key: string]: TreeNode | string;
}

interface TreeProps {
  data: TreeNode;
}

class Tree extends React.Component<TreeProps> {
  renderNode(data: TreeNode) {
    return (
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong>
            {typeof value === 'object' ? this.renderNode(value as TreeNode) : value}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { data } = this.props;

    return (
      <div>
        <Logo />
        <h1>Unità Sperimentazioni Cliniche</h1>
        {this.renderNode(data)}
      </div>
    );
  }
}

export default Tree;
