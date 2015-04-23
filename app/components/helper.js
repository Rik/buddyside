var Helper = React.createClass({
  render: function() {
    return (<li>
      <a href="helper_profile.html?username={this.props.username}" data-modal="true">
        <img src={this.props.avatar} alt={this.props.username} />
      </a>
    </li>)
  }
})

module.exports = Helper;
