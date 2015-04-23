var TopHelpers = require('components/top_helpers');
var QuestionList = require('components/question_list');
var Link = ReactRouter.Link;

var Home = React.createClass({
  componentWillUnmount: function() {
    console.log('home did unmount');
  },

  render: function() {
    return (
      <section role="region" className="vbox fit">
        <header>
          <menu type="toolbar">
            <a href="profile.html" id="settings" className="settings-icon" data-icon="settings" data-modal="true">
              <span className="visuallyhidden">Settings</span>
            </a>
          </menu>
          <h1>Support</h1>
        </header>
        <main className="fit scroll">
          <section className="HomeCallout HomeCallout--ask vbox">
            <h2 className="HomeCallout-title HomeCallout-shadow">Have Questions?</h2>
            <p className="HomeCallout-subtitle HomeCallout-shadow">Get a Buddy to help you with your device</p>
            <Link to="question" className="bb-button HomeCallout-button">Ask a Question</Link>
          </section>
          <section className="HomeCallout HomeCallout--answer vbox">
            <h2 className="HomeCallout-title">Have Answers?</h2>
            <p className="HomeCallout-subtitle">Help other users around the world</p>
            <a href="question_list_helper.html?role=helper" className="bb-button recommend HomeCallout-button">Answer Questions</a>
          </section>
          <TopHelpers />
          <QuestionList />
        </main>
      </section>)
  }
})

module.exports = Home;
