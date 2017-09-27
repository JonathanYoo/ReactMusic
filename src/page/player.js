import React, { Component } from 'react';
import Progress from '../componments/progress';
import Pubsub from 'pubsub-js'
import {Link} from 'react-router-dom';
import Cover from '../componments/cover';
const $=window.$;
let duration=null;

class Player extends Component {
    constructor(){
        super();
        this.state = {
            progress:0,
            volume: 0,
            time:0,
            isPlay:true
        }
    }

    componentDidMount(){
        $('#player').bind($.jPlayer.event.timeupdate,(e)=>{
            duration=e.jPlayer.status.duration;     /*音频文件的总时长*/
            // console.log("总时长"+duration);
            if(this.refs.myref) {
                this.setState({
                    volume: e.jPlayer.options.volume * 100,
                    progress: e.jPlayer.status.currentPercentAbsolute,
                    time: e.jPlayer.status.currentTime
                })
            }
            // console.log("jiazai"+this.state.progress);
;        })
    }

    componentWillMount() {

        $('#player').unbind($.jPlayer.event.timeupdate);


    }
    changeVolumeHandler(progress){
        $('#player').jPlayer('volume',progress);
    }
    progressChangeHandler(progress){
        $('#player').jPlayer('play',duration*progress);/*总时长乘以鼠标点击所占比例已设置进度*/
        // console.log("窝窝");
    }
    play(){
        this.state.isPlay ? $('#player').jPlayer('pause') : $('#player').jPlayer('play');
        this.setState({
            isPlay:!this.state.isPlay
        })
    }
    playPrev(){
        Pubsub.publish('PLAY_PREV');
        this.setState({
            isPlay:true
        })
    }
    playNext(){
        Pubsub.publish('PLAY_NEXT');
        this.setState({
            isPlay:true
        })
    }
    playCurrent(){
        Pubsub.publish('PLAY_CURRENT');
    }

    render(){
        return (
            <div >
                {/*<Progress progress={this.state.progress} onProgressChange={this.progressChangeHandler.bind(this)} />*/}
                {/*<div id="player"></div>*/}
                <div className='player-page' ref="myref">
                    <h1 className='caption'><Link to='/list'>我的私人音乐坊</Link> </h1>
                    <Cover bg={this.props.currentMusicItem.cover}/>
                    <div className="mt20 row">
                        <div className="controll-wrapper">
                            <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                            <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                            <div className="row mt20">
                                <div className="volume-container">
                                    <i className="icon-volume rt" style={{top:5,left:-5}}></i>
                                    <div className="volume-wrapper">
                                        <Progress progress={this.state.volume} barColor="#ff9673" onProgressChange={this.changeVolumeHandler.bind(this)} />
                                    </div>
                                </div>
                            </div>
                            <div style={{height:10,lineHeight:'10px'}}>
                                <Progress progress={this.state.progress} barColor="#3C4FFF"    onProgressChange={this.progressChangeHandler.bind(this)} />
                                <div className="left-time -col-auto">{(this.state.time/60).toFixed(0)>10?10:'0'+(this.state.time/60).toFixed(0)} : {((this.state.time).toFixed(0)%60<10) ? '0'+(this.state.time).toFixed(0)%60 : (this.state.time).toFixed(0)%60} s</div>
                            </div>
                            <div className="mt35 row">
                                <div>
                                    <i className="icon prev" onClick={this.playPrev.bind(this)}></i>
                                    <i className={`icon ml20 ${Math.ceil(this.state.time)>= Math.ceil(duration) ? 'play' : this.state.isPlay ? 'pause':'play'}`} onClick={this.play.bind(this)}></i>
                                    <i className="icon next ml20" onClick={this.playNext.bind(this)}></i>
                                </div>
                                <div className="-col-auto">
                                    <i className="icon repeat-cycle" onClick={this.playCurrent.bind(this)}></i>
                                </div>
                            </div>
                        </div>
                        <div className='-col-auto cover' >
                            <img className={`${Math.ceil(this.state.time)>= Math.ceil(duration) ? 'pause' : this.state.isPlay ? '':'pause'}`} src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
export default Player;
