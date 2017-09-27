import React, { Component } from 'react';
import Header from './componments/header';
import { MUSIC_LIST } from './config/musiclist';
import mp3 from './player/alert.mp3';
import MusicList from './page/musiclist';
import Player from './page/player';
import Pubsub from 'pubsub-js';
import {Switch,BrowserRouter as Router,IndexRouter,Link,Route,BrowserHistory} from 'react-router-dom';
const $=window.$;

class Root extends Component {
    constructor() {
        super();
        this.state = {
            musicList : MUSIC_LIST,
            currentMusicItem: MUSIC_LIST[0],
            isPlay:null
        };
    }
    playMusic(musicItem){
        $('#player').jPlayer('setMedia',{
            mp3:musicItem.file
        }).jPlayer('play');
        this.setState({
            currentMusicItem:musicItem
        });
    }
    playNext(type='next'){
        let index=this.findMusicIndex(this.state.currentMusicItem);
        let newIndex=null;
        let musicListLength=this.state.musicList.length;
        if(type==='next')
        {
        newIndex=(index+1)%this.state.musicList.length;
        }
        else{
            newIndex=(index-1+musicListLength)%musicListLength;
        }
        this.playMusic(this.state.musicList[newIndex]);
    }
    playCurrent(){
        let index=this.findMusicIndex(this.state.currentMusicItem);
        this.playMusic(this.state.musicList[index]);

    }
    findMusicIndex(musicItem){
        return this.state.musicList.indexOf(musicItem);
    }
    componentDidMount(){
        $('#player').jPlayer({
            supplied:'mp3',
            wmode:'window'
            });
        this.playMusic(this.state.currentMusicItem);
        $('#player').bind($.jPlayer.event.ended,(e)=>{
            this.playNext();
        })
        Pubsub.subscribe('DELETE_MUSIC',(msg,musicItem)=> {
        this.setState({
            musicList: this.state.musicList.filter(item => {

                return item !== musicItem;
            })
        })
    })
    Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem)=>{
        this.playMusic(musicItem);
    })
        Pubsub.subscribe('PLAY_PREV',(msg,musicItem)=>{
        this.playNext('prev');
    })
        Pubsub.subscribe('PLAY_NEXT',(msg,musicItem)=>{
        this.playNext('next');
    })
       Pubsub.subscribe('PLAY_CURRENT',(msg)=>{
           $('#player').bind($.jPlayer.event.ended,(e)=>{
               // this.playCurrent();
               console.log("bofangdangqian");
           })

       })







    }
    componentWillUnMount(){
        Pubsub.unsubscribe('PLAY_MUSIC');
        Pubsub.unsubscribe('DELETE_MUSIC');
        Pubsub.unsubscribe('PLAY_PREV');
        Pubsub.unsubscribe('PLAY_NEXT');
        $('#player').unbind($.jPlayer.event.ended);
    }
    render(){
        const Home = () => (
            <Player
                // cycleModel={this.state.cycleModel}
                currentMusicItem={this.state.currentMusicItem}
            />
        );

        const List = () => (
            <MusicList
                 currentMusicItem={this.state.currentMusicItem}
                musicList={this.state.musicList}
            />
        );

        return (
            <Router>
                <div>
                    <div id="player"></div>
                    <Header/>

                    <Route exact path="/" component={Home}/>
                    <Route path="/list" component={List}/>

                </div>
            </Router>
        );
    }
}

export default Root;
