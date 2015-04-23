var SumoDB = require('sumo_db');
var User = require('user');
var QuestionItem = require('components/question_item');

var QuestionList = React.createClass({
  componentDidMount: function() {
    User.get_user().then((user) => {
      return SumoDB.get_my_questions(user);
    }).then((response) => {
      this.setState({questions: response.results});
    });
  },

  getInitialState: function() {
    return {};
  },

  render: function() {
    if (!this.state.questions || !this.state.questions.length) {
      return (<div />);
    }

    var questions = this.state.questions.slice(0, 3).map((question) => {
      return <QuestionItem question={question} key={question.id} />
    });

    return (
      <div>
        <section id="myquestions" className="questions" data-empty-message="No questions">
          <header>
            <h2>My Questions</h2>
            <section>
              <h1 className="list-day">2015-04-22</h1>
              <ul>
                {questions}
              </ul>
            </section>
          </header>
        </section>
        <a id="all_questions_button" href="question_list_helpee.html" className="ListItem">
          <div className="ListItem-inside li__title" data-icon-after="forward-light" >
            All My Questions
          </div>
        </a>
      </div>
    )
  }
})

module.exports = QuestionList;
