/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from "react";
import makeRequest from '../../libs/request';
import { showMessageWithType } from '../../common/antd/actions/Notification';
import {
    makeStyles
} from "@material-ui/core/styles";
import {
    Paper
} from "@material-ui/core";
import Tabs from '../../common/antd/component/Tabs';
import TabPane from '../../common/antd/component/TabPane';

const useStyles1 = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto"
    },
    table: {
        minWidth: 650
    }
}));

export default function Profile() {
    const classes1 = useStyles1();
    const [dataUpdate, setDataUpdate] = useState({ name: '', email: '', mobile: '', address: '', avatar: '' });
    const [changePass, setChangePass] = useState({ oldPassword: '', password: '', reNewPassword: '' });
    const refName = React.createRef();
    const refMobile = React.createRef();
    const refAddress = React.createRef();
    const refoldPassword = React.createRef();
    const refpassword = React.createRef();
    const refreNewPassword = React.createRef();
    const [LinkImage, setLinkImage] = useState("");
    const [srcImage, setSrcImage] = useState("");
    const [conditionUp, setConditionUp] = useState();
    const [userInfo, setUserInfo] = useState({});

    const handleInput = (key, value) => {
        setDataUpdate({
            ...dataUpdate,
            [key]: value
        })
    }

    const handleInputChangePass = (key, value) => {
        setChangePass({
            ...changePass,
            [key]: value
        })
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    const getUserInfo = () => {
        makeRequest('get', `user/userInfo`)
            .then(({ data }) => {
                let detail = data.data;

                setDataUpdate({
                    ...dataUpdate,
                    name: detail.name,
                    email: detail.email,
                    mobile: detail.mobile,
                    address: detail.address,
                    avatar: detail.avatar
                })

                setUserInfo(data.data);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const resetFormChangePass = () => {
        setChangePass({
            oldPassword: '',
            password: '',
            reNewPassword: ''
        })
    }

    const resetSrcImg = () => {
        setSrcImage('');
        setLinkImage('');
    }

    const handleInputSubmit = (e) => {
        e.preventDefault();

        if (!dataUpdate.name || dataUpdate.name === '') {
            refName.current.focus();
            return showMessageWithType('', 'L???i nh???p d??? li???u', 'Vui l??ng nh???p h??? t??n');
        }

        if (!dataUpdate.mobile || dataUpdate.mobile === '') {
            refMobile.current.focus();
            return showMessageWithType('error', 'L???i nh???p d??? li???u', 'Vui l??ng nh???p s??? ??i???n tho???i');
        }

        if (!dataUpdate.address || dataUpdate.address === '') {
            refAddress.current.focus();
            return showMessageWithType('error', 'L???i nh???p d??? li???u', 'Vui l??ng nh???p ?????a ch???');
        }

        let dataPost = new FormData();
        dataPost.append('file', LinkImage);
        dataPost.append('name', dataUpdate.name);
        dataPost.append('mobile', dataUpdate.mobile);
        dataPost.append('address', dataUpdate.address);

        makeRequest('post', `profile/update`, dataPost, {
            'Content-Type': 'multipart/form-data'
        })
            .then(({ data }) => {
                if (data.signal) {
                    showMessageWithType('success', 'K???t qu??? ', 'C???p nh???t th??nh c??ng');
                    resetSrcImg();
                    // getUserInfo();
                } else {
                    return showMessageWithType('error', 'K???t qu???', data.message);
                }
            }).catch(

            )
    }

    const handleInputChangePassSubmit = (e) => {
        e.preventDefault();

        if (!changePass.oldPassword || changePass.oldPassword === '') {
            refoldPassword.current.focus();
            return showMessageWithType('error', 'L???i nh???p d??? li???u', 'M???t kh???u c?? kh??ng ???????c b??? tr???ng');
        }

        if (!changePass.password || changePass.password === '') {
            refpassword.current.focus();
            return showMessageWithType('error', 'L???i nh???p d??? li???u', 'Vui l??ng nh???p m???t kh???u m???i');
        }

        if (!changePass.reNewPassword || changePass.reNewPassword === '') {
            refreNewPassword.current.focus();
            return showMessageWithType('error', 'L???i nh???p d??? li???u', 'Vui l??ng x??c nh???n m???t kh???u m???i');
        }

        if (changePass.reNewPassword != changePass.password) {
            refreNewPassword.current.focus();
            return showMessageWithType('error', 'L???i nh???p d??? li???u', 'X??c nh???n m???t kh???u kh??ng tr??ng kh???p');
        }

        makeRequest('post', `profile/changePassword`, changePass)
            .then(({ data }) => {
                if (data.signal) {
                    showMessageWithType('success', 'K???t qu???', 'C???p nh???t m???t kh???u th??nh c??ng');
                    // getUserInfo();
                    resetFormChangePass();
                } else {
                    return showMessageWithType('error', 'K???t qu???', data.message);
                }
            }).catch(

            )
    }

    const callback = (key) => {
    }

    const onChangeLink = (event) => {
        const file = event.target.files[0];
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            return showMessageWithType('error', 'L???i ?????nh d???ng', 'Ch??? h??? tr??? ?????nh d???ng PNG|JPEG|JPG.');
        }

        let url = window.URL.createObjectURL(file);
        setSrcImage(url);

        setLinkImage(event.target.files[0]);
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="kt-section">
                        <div className="kt-section__content">
                            <Paper className={classes1.root}>
                                <div className='row'>
                                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-3">
                                        <div className="imgAvatarContainer">
                                            <div className="imgAvatar">
                                                {LinkImage ? <img src={srcImage} alt={srcImage} className="img-circle img-full-width" /> :
                                                    <img src={dataUpdate.avatar} alt={dataUpdate.avatar} className="img-circle img-full-width" />
                                                }
                                            </div>
                                            <div className="marginT10">
                                                <label className="fileInputTextKT" htmlFor="inputGroupFile01">
                                                    Click v??o ????y ????? upload avatar
                                                        <input type="file" accept="image/*" id="inputGroupFile01" onChange={onChangeLink} />
                                                </label>
                                            </div>
                                        </div>
                                        {/* {userInfo && userInfo.id && userInfo.type != 1 &&
                                            <div className="imgAvatarContainer">
                                                <div style={{ paddingTop: "20px", paddingBottom: "20px" }}><strong style={{ color: "red" }}>C???p hi???n t???i</strong></div>
                                                <Level />
                                                { userInfo.level != 1 && <div style={{ paddingTop: "20px", paddingBottom: "20px", color: "navy" }}>C???n mua th??m {formatMoney(conditionUp)} ????? l??n c???p</div>}
                                            </div>
                                        } */}
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-9">
                                        <Tabs defaultActiveKey="1" onChange={callback}>
                                            <TabPane tab="Th??ng tin" key="1">
                                                <div className="form-group">
                                                    <label className="fontBold">
                                                        Email</label>
                                                    <div className="input-group">
                                                        <span className="input-group-addon" style={{ paddingRight: 25, borderRight: 1, position: 'relative', margin: 'auto' }}>
                                                            <span className="fa fa-envelope" />
                                                        </span>
                                                        <input type="text" className="form-control" placeholder="Nh???p email" readOnly value={dataUpdate.email ? dataUpdate.email : ''} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <p className="fontBold">
                                                        H??? t??n</p>
                                                    <div className="input-group">
                                                        <span className="input-group-addon" style={{ paddingRight: 25, borderRight: 1, position: 'relative', margin: 'auto' }}>
                                                            <span className="fa fa-user" />
                                                        </span>
                                                        <input type="text" className="form-control" placeholder="Nh???p h??? t??n" ref={refName} value={dataUpdate.name ? dataUpdate.name : ''} onChange={(e) => handleInput('name', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <p className="fontBold">
                                                        S??? ??i???n tho???i</p>
                                                    <div className="input-group">
                                                        <span className="input-group-addon" style={{ paddingRight: 25, borderRight: 1, position: 'relative', margin: 'auto' }}>
                                                            <span className="fa fa-phone-alt" />
                                                        </span>
                                                        <input type="text" className="form-control" placeholder="Nh???p s??? ??i???n tho???i" ref={refMobile} value={dataUpdate.mobile ? dataUpdate.mobile : ''} onChange={(e) => handleInput('mobile', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <p className="fontBold">
                                                        ?????a ch???</p>
                                                    <div className="input-group">
                                                        <span className="input-group-addon" style={{ paddingRight: 25, borderRight: 1, position: 'relative', margin: 'auto' }}>
                                                            <span className="fa fa-address-card" />
                                                        </span>
                                                        <input type="text" className="form-control" placeholder="Nh???p ?????a ch???" ref={refAddress} value={dataUpdate.address ? dataUpdate.address : ''} onChange={(e) => handleInput('address', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <button type="button" className="btn btn-primary" onClick={handleInputSubmit}>
                                                        C???p nh???t</button>
                                                </div>
                                            </TabPane>
                                            <TabPane tab="?????i m???t kh???u" key="2">
                                                <div className="form-group">
                                                    <p className="fontBold">
                                                        M???t kh???u c??</p>
                                                    <div className="input-group">
                                                        <span className="input-group-addon" style={{ paddingRight: 25, borderRight: 1, position: 'relative', margin: 'auto' }}>
                                                            <span className="fa fa-lock" />
                                                        </span>
                                                        <input type="password" className="form-control" placeholder="Nh???p m???t kh???u c??" ref={refoldPassword}
                                                            value={changePass.oldPassword} onChange={(e) => handleInputChangePass('oldPassword', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <p className="fontBold">
                                                        M???t kh???u m???i</p>
                                                    <div className="input-group">
                                                        <span className="input-group-addon" style={{ paddingRight: 25, borderRight: 1, position: 'relative', margin: 'auto' }}>
                                                            <span className="fa fa-lock" />
                                                        </span>
                                                        <input type="password" className="form-control" placeholder="Nh???p m???t kh???u m???i" ref={refpassword}
                                                            value={changePass.password} onChange={(e) => handleInputChangePass('password', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <p className="fontBold">
                                                        X??c nh???n m???t kh???u m???i</p>
                                                    <div className="input-group">
                                                        <span className="input-group-addon" style={{ paddingRight: 25, borderRight: 1, position: 'relative', margin: 'auto' }}>
                                                            <span className="fa fa-lock" />
                                                        </span>
                                                        <input type="password" className="form-control" placeholder="X??c nh???n m???t kh???u m???i" ref={refreNewPassword}
                                                            value={changePass.reNewPassword} onChange={(e) => handleInputChangePass('reNewPassword', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <button type="button" className="btn btn-primary" onClick={handleInputChangePassSubmit}>
                                                        ?????i m???t kh???u</button>
                                                </div>
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </div>
                            </Paper>
                        </div>

                    </div>
                </div>
            </div>
        </>

    );
}