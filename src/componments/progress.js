import React, { Component } from 'react';
import './progress.css';
import PropTypes from 'prop-types';

class Progress extends Component {

    changeProgress(e){
        let progressBar =this.refs.progressBar;
        let progress=(e.clientX-progressBar.getBoundingClientRect().left)/progressBar.clientWidth;
        console.log(progress);
        this.props.onProgressChange&&this.props.onProgressChange(progress);

    }

    render() {
        return (
           <div className="components-progress" ref="progressBar" onClick={this.changeProgress.bind(this)}>
               <div className="progress" style={{width:`${this.props.progress}%`, background:this.props.barColor}} ></div>

           </div>
        );
    }
}
// Specifies the default values for props:
Progress.defaultProps = {
    barColor:'#ff9673'
};

export default Progress;
