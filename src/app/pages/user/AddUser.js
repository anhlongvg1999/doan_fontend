import React, { useState, useEffect } from "react";
import makeRequest from '../../libs/request';
import { showSuccessMessageIcon, showErrorMessage } from '../../actions/notification';
import ButtonLoading from "../../partials/common/ButtonLoading";
import { Link } from 'react-router-dom';
import SelectForm from '../../partials/common/SelectForm';
import {
    TextField,
    Button
} from "@material-ui/core";

import { Form, Card, Col } from "react-bootstrap";

const Add_User = (props) => {
    const inputNameBankRef = React.createRef();
    const [isLoadSubmit, setLoadSubmit] = useState(false);
    const [dataAdd, setDataAdd] = useState({});
    const enableLoadSubmit = () => {
        setLoadSubmit(true);
    };

    const disableLoadSubmit = () => {
        setLoadSubmit(false);
    };
    const onChangeAddValue = (key, value) => {
        setDataAdd({
            ...dataAdd,
            [key]: value
        })
    }
    const handleSubmitAdd = (e) => {
        e.preventDefault();
        if (!dataAdd.email) {
            return showErrorMessage('Vui lòng nhập email');
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(dataAdd.email)) {
            return showErrorMessage('Vui lòng nhập đúng định dạng email');
        }
        if(dataAdd.password != dataAdd.confirmpassword)
        {
            return showErrorMessage('password không khớp');
        }
        //enableLoadSubmit();
        makeRequest('post', `account/createUser`, dataAdd)
            .then(({ data }) => {
                console.log('dataaddddddddddd', dataAdd)
                if (data.signal) {
                    showSuccessMessageIcon('Add Successfuly!')
                    props.history.push('/User/List')
                } else {
                    showErrorMessage(data.message);
                }
                disableLoadSubmit();
            })
            .catch(err => {
                disableLoadSubmit();
            })
    }
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="kt-section">
                    <Card >
                        <Card.Body>
                            <Form onSubmit={handleSubmitAdd}>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formFirstName">
                                        <Form.Label className="starDanger">First Name</Form.Label>
                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="First Name" value={dataAdd.firstname || ''} onChange={(e) => onChangeAddValue('firstname', e.target.value)} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formLastName">
                                        <Form.Label className="starDanger">Last Name</Form.Label>
                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Last Name" value={dataAdd.lastname || ''} onChange={(e) => onChangeAddValue('lastname', e.target.value)} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formEmail">
                                        <Form.Label className="starDanger">Email</Form.Label>
                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Email" value={dataAdd.email || ''} onChange={(e) => onChangeAddValue('email', e.target.value)} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formPassword">
                                        <Form.Label className="starDanger">Password</Form.Label>
                                        <Form.Control required type="password" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Password" value={dataAdd.password || ''} onChange={(e) => onChangeAddValue('password', e.target.value)} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formConfirmPassword">
                                        <Form.Label className="starDanger">Confirm Password</Form.Label>
                                        <Form.Control required type="password" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="ConfirmPassword" value={dataAdd.confirmpassword || ''} onChange={(e) => {
                                            onChangeAddValue('confirmpassword', e.target.value)
                                        }
                                        } />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formAddress">
                                        <Form.Label className="starDanger">Address</Form.Label>
                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Address" value={dataAdd.address || ''} onChange={(e) => onChangeAddValue('address', e.target.value)} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formCity">
                                        <Form.Label className="starDanger">City</Form.Label>
                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="City" value={dataAdd.city || ''} onChange={(e) => onChangeAddValue('city', e.target.value)} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formMobile">
                                        <Form.Label className="starDanger">Mobile</Form.Label>
                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Mobile" value={dataAdd.mobile || ''} onChange={(e) => onChangeAddValue('mobile', e.target.value)} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlI="formBirthday">
                                        <Form.Label className="starDanger">Birthday</Form.Label>
                                        <TextField
                                            id="date"
                                            type="date"
                                            defaultValue="2017-05-24"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            required
                                            onChange={(value) => {
                                                onChangeAddValue("birthday", value.target.value)
                                            }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <div className="kt-login__actions">
                                        <Link to="/User/List" style={{ marginRight: '5px' }}>
                                            <button type="button" className="btn btn-secondary btn-elevate kt-login__btn-secondary">Cancel</button>
                                        </Link>
                                        <ButtonLoading className='btn btn-primary' loading={isLoadSubmit} type="submit" >
                                            Add New
                                        </ButtonLoading>
                                    </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );

}
export default Add_User;