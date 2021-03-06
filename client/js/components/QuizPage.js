import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import Question from './Question';
import Answer from './Answer';
import Result from './Result';
import Count from './Count';

class Quiz extends Component {
    componentWillMount() {
        this.props.dispatch(actions.fetchQuestion(this.props.currentUserId, this.props.accessToken));    
    }
    
    detectTextInput() {
        this.props.dispatch(actions.setCurrentUserInput(this.refs.userInput.value));
    }
    
    checkAnswer(event) {
        event.preventDefault();
        let answerFlag = (this.refs.userInput.value.toLowerCase() === this.props.currentAnswer) ? 'correct' : 'incorrect';
        this.props.dispatch(actions.setAnswerFlag(answerFlag));
        this.props.dispatch(actions.setPrevAnswer(this.props.currentAnswer));
        this.props.dispatch(actions.postQuestionAnsweredStatus(this.props.currentUserId, answerFlag, this.props.accessToken));
        this.refs.userInput.value ='';
    }
    
    nextButton(event) {
        event.preventDefault();
        this.props.dispatch(actions.setCurrentUserInput(null));
        this.props.dispatch(actions.setAnswerFlag(null));
    }
      
    renderQuestionOrResult() {
        if(this.props.currentAnswerFlag) {
            return (
                <div>
                    {this.props.currentAnswerFlag === 'correct' ? <p id="compliment">Good Job!!!</p> : <Answer answer={this.props.prevAnswer} />}
                    <button id="next-question-button" type="submit" name="submit" onClick={this.nextButton.bind(this)} autoFocus={true}>
                        Next Question
                    </button>
                </div>
            );
        }
        return (
            <div>
                <Question question={this.props.currentQuestion} />
                <form id="question-form" onSubmit={this.checkAnswer.bind(this)}>
                    <input id="input-answer" type="text" name="answer" ref="userInput" onChange={this.detectTextInput.bind(this)} autoFocus={true}></input>
                    <input id="submit-button" type="submit" name="submit" disabled={!this.props.currentUserInput}></input>
                </form>
            </div>
        );
    }
    
    render() {
        return (
            <div id="quiz-card">
                {this.renderQuestionOrResult()}
                <div id="score">
                    <Result result={this.props.result} />
                    <Count result={this.props.result} />
                </div>
            </div>
        );
    }
}

let mapStateToProps = (state, props) => {
    return {
       accessToken: state.accessToken,
       currentUserId:  state.currentUserId,
       currentUserInput: state.currentUserInput,
       currentQuestion: state.currentQuestion,
       currentAnswer: state.currentAnswer,
       currentAnswerFlag: state.currentAnswerFlag,
       prevAnswer: state.prevAnswer,
       result: state.result
    };
};

export default connect(mapStateToProps)(Quiz);