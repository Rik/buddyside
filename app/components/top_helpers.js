var SumoDB = require('sumo_db');
var Helper = require('components/helper');

var TopHelpers = React.createClass({
  getInitialState: function() {
    return {
      helpers: []
    }
  },

  componentDidMount: function() {
    SumoDB.get_top_helpers().then((response) => {
      this.setState({helpers: response});
    });
  },

  render: function() {
    var helpers = this.state.helpers.map((helper) => {
      return <Helper key={helper.username} username={helper.username} avatar={helper.avatar} />
    })


    return (
      <section id="tophelpers" className="user-list">
        <header>
          <h2>Top Helpers this Week</h2>
        </header>
        <ul>
          {helpers}
        </ul>
      </section>)
  }
});

module.exports = TopHelpers;
