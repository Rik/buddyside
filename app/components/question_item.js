var QuestionItem = React.createClass({
  render: function() {
    var question = this.props.question;

    return (
      <li>
      <a href="question.html?id={question.id}" className="ListItem">
        <div className="ListItem-inside">
          <p className="li__title ellipsis">{question.title}</p>
          <div className="hbox">
            <span className="li__subtitle fit">
            </span>
            <span className="li__comments">{question.num_answers}</span>
          </div>
        </div>
      </a>
    </li>)
  }
});

module.exports = QuestionItem;
