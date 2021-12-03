import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import './DetailDoctor.scss';
import { getDetailInfoDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';
import Comment from '../SocialPlugin/Comment';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
require('dotenv').config();

class DetailDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
        }
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            })
            let res = await getDetailInfoDoctor(id);
            if(res && res.errCode === 0){
                this.setState({
                    detailDoctor: res.data
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        
    }
    
    render() {
        let { language } = this.props;
        let { detailDoctor } = this.state;
        let nameVI = '', nameEn = '';
        if(detailDoctor && detailDoctor.positionData){
            nameVI = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }


        let currentURL = +process.env.REACT_APP_IS_LOCALHOST === 1 ? 
            "https://chatbot-goodcare.herokuapp.com/" : window.location.href;


        return (
            <>
                <HomeHeader 
                    isShowBanner={false}
                />
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div className="content-left" 
                            style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}
                        >

                        </div>
                        <div className="content-right">
                            <div className="up">
                                {language === LANGUAGES.VI ? nameVI : nameEn}
                            </div>
                            <div className="down">
                                {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.description
                                    && <span>
                                        {detailDoctor.Markdown.description}
                                    </span>
                                }
                                <div className="like-share-plugin">
                                    <LikeAndShare 
                                        dataHref={currentURL}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule 
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                        <div className="content-right">
                                <DoctorExtraInfo 
                                    doctorIdFromParent={this.state.currentDoctorId}
                                />
                        </div>
                    </div>
                    
                    <div className="detail-info-doctor">
                                {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML
                                    && <div dangerouslySetInnerHTML={{__html: detailDoctor.Markdown.contentHTML}}>
                                        
                                    </div>
                                }
                    </div>
                    <div className="comment-doctor">
                        <Comment 
                            dataHref={currentURL}
                            width={"100%"}
                        />
                    </div>
                    <HomeFooter />
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
