
import React, { useState, useEffect } from "react";
import makeRequest from '../../libs/request';
import moment from "moment";
import InputForm from '../../partials/common/InputForm';
import ButtonLoading from '../../partials/common/ButtonLoading';
import { Link } from 'react-router-dom';
import {
    makeStyles
} from "@material-ui/core/styles";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TextField,
    TableBody,
    Button
} from "@material-ui/core";

import { Form, Card, Col } from "react-bootstrap";
import Icon from "@material-ui/core/Icon";
import { Modal, Pagination } from "antd";
import { showSuccessMessageIcon, showErrorMessage } from '../../actions/notification';
import SelectForm from '../../partials/common/SelectForm';
import { ACTIVE_STATUS } from '../../config/common/testme'
import "./user.css";
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

export default function List_User(props) {

    const classes1 = useStyles1();
    const formUpdate = React.createRef();
    const inputNameBankRef = React.createRef();
    const [isLoadSearch, setLoadSearch] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({ visible: false });
    const [dataSearch, setData] = useState({ email: '', Active: 0 });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [dataAdd, setDataAdd] = useState({});
    const [isLoadDelete, setLoadDelete] = useState(false);
    const [total, setTotal] = useState(0);
    const [dataDelete, setDataDelete] = useState({ visible: false });
    const [rows, setRow] = useState([]);
    let index = (page == 1 ? 0 : (rowsPerPage * (page - 1)));
    useEffect(() => {
        searchUser({ page: 1, limit: rowsPerPage });

    }, []);
    const onChangeValueSearch = (key, value) => {
        setData({
            ...dataSearch,
            [key]: value
        })
    }
    const onChangeAddValue = (key, value) => {
        setDataAdd({
            ...dataAdd,
            [key]: value
        })
        console.log('111111111111111', dataAdd)
    }
    const unfilteredData = (e) => {
        setData({
            name: ''
        });
        setPage(1);
        searchUser({ page: 1, limit: rowsPerPage });
    }
    const handleChangePage = (newPage) => {
        setPage(newPage);
        searchUser({ ...dataSearch, page: newPage, limit: rowsPerPage });
    };
    const renderStatusText = (category) => {
        if (category == 0) {
            return (<span className="btn btn-label-primary btn-bold btn-sm btn-icon-h" style={{ borderRadius: '.42rem' }}>Active</span>);
        } else {
            return (<span className="btn btn-label-warning btn-bold btn-sm btn-icon-h" style={{ borderRadius: '.42rem' }}>De-active</span>);
        }
    }
    const submitUpdate = (e) => {
        e.preventDefault();
        const nodeUpdate = formUpdate.current;
        nodeUpdate.click();
    }
    const searchUser = (dataSearch = {}) => {
        console.log('111111111111', dataSearch);
        makeRequest('get', `account/getAllUser`, dataSearch)
            .then(({ data }) => {
                if (data.signal) {
                    console.log('xxxxxxxxxxxxx', data.data)
                    const res = data.data.user;
                    setRow(res);
                    setTotal(data.data.total)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    const deleteAction = () => {
        setLoadDelete(true);
        hideDeleteModal();
        setLoadDelete(false);
        makeRequest("get", `account/deleteUser`, { id: dataDelete.id })
            .then(({ data }) => {
                if (data.signal) {
                    showSuccessMessageIcon("Xóa thành công");
                    let dataQuestion = rows.filter((item) => item.id !== dataDelete.id);
                    hideDeleteModal();
                }
            })
            .catch((err) => {
                showErrorMessage("Xóa thất bại");
                console.log(err);
            });
    };
    const clickModalUpdateCancel = () => {
        setDataUpdate({
            ...dataUpdate,
            visible: false
        })
    }
    const hideDeleteModal = () => {
        setDataDelete({
            ...dataDelete,
            visible: false,
            idDel: 0,
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        searchUser(dataSearch);
    }
    const showModalDelete = (id) => {
        setDataDelete({
            id,
            visible: true,
        });
    };
    const showModalUpdate = (row) => {
        setDataUpdate({
            ...row,
            visible: true
        })
    }
    const onChangeUpdateValue = (key, value) => {
        setDataUpdate({
            ...dataUpdate,
            [key]: value
        })
    }
    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        if (!dataUpdate.email) {

            return showErrorMessage('Vui lòng nhập email');
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(dataUpdate.email)) {
            return showErrorMessage('Vui lòng nhập đúng định dạng email');
        }
        console.log('dataupdateeeeeeeeeeeeeeeeee', dataUpdate)
        makeRequest('post', `account/updateUser`, dataUpdate)
            .then(({ data }) => {
                if (data.signal) {
                    showSuccessMessageIcon('Update Successfuly!')
                    setDataUpdate({
                        visible: false
                    });

                    let dataRow = rows.map(it => {
                        if (it.id == dataUpdate.id) {
                            return dataUpdate;
                        }
                        return it;
                    })

                    setRow(dataRow);

                } else {
                    return showErrorMessage(data.message);
                }
            })
            .catch(err => {
                console.log('Error', err)
            })
    }
    return (<>
        <Link Icon="" className="btn btn-primary btn-bold btn-sm btn-icon-h kt-margin-l-10">Add New User</Link>

        <div class="row">
            <div className="col-md-12">
                <div className="kt-section">
                    <div className="kt-section__content">
                        <Paper className={classes1.root}>
                            <div className="col-md-12">
                                <Form onSubmit={handleSubmit}>
                                    <div style={{ marginTop: 20, fontSize: 20 }}><label>Tìm kiếm</label></div>
                                    <div className='form-row'>
                                        <div className='form-group col-md-2'>
                                            <div className="form-group" style={{ display: 'flex' }} >
                                                <InputForm
                                                    type="text"
                                                    placeholder="email"
                                                    value={dataSearch.email || ""}
                                                    onChangeValue={(value) => { onChangeValueSearch('email', value) }}
                                                    focus={true}
                                                />
                                            </div>
                                        </div>
                                        <div className='form-group'>
                                            <button
                                                className="btn btn-label-primary btn-bold btn-sm btn-icon-h kt-margin-l-10"
                                                onClick={unfilteredData}
                                                style={{ marginLeft: 10, marginTop: 3 }}
                                                type="button"
                                            >
                                                <span>Bỏ lọc</span>
                                            </button>

                                            <ButtonLoading
                                                type="submit"
                                                className="btn btn-label-primary btn-bold btn-sm btn-icon-h kt-margin-l-10"
                                                loading={isLoadSearch}
                                                style={{ marginLeft: 10, marginTop: 3 }}
                                            >
                                                <span>Tìm kiếm</span>
                                            </ButtonLoading>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>First Name</TableCell>
                                        <TableCell>Last Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Address</TableCell>
                                        <TableCell>City</TableCell>
                                        <TableCell>Mobile</TableCell>
                                        <TableCell>Birthday</TableCell>
                                        <TableCell>Active</TableCell>
                                        <TableCell>CreatedAt</TableCell>
                                        <TableCell>UpdatedAt</TableCell>
                                        <TableCell style={{ width: 150 }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.length ? rows.map((row, key) => (

                                        <TableRow key={`user${row.id}`}>
                                            <TableCell>
                                                {index = index + 1}
                                            </TableCell>
                                            <TableCell>
                                                {row.firstname}
                                            </TableCell>
                                            <TableCell>
                                                {row.lastname}
                                            </TableCell>
                                            <TableCell>
                                                {row.email}
                                            </TableCell>
                                            <TableCell>
                                                {row.address}
                                            </TableCell>
                                            <TableCell>
                                                {row.city}
                                            </TableCell>
                                            <TableCell>
                                                {row.mobile}
                                            </TableCell>
                                            <TableCell>{moment(row.birthday).format("HH:mm DD-MM-YYYY")}</TableCell>
                                            <TableCell>{renderStatusText(row.del)}</TableCell>
                                            <TableCell>{moment(row.createdAt).format("HH:mm DD-MM-YYYY")}</TableCell>
                                            <TableCell>{moment(row.updatedAt).format("HH:mm DD-MM-YYYY")}</TableCell>
                                            <TableCell>
                                                <span style={{ cursor: 'pointer' }} d data-toggle="tooltip" data-placement="top" title="Edit data"><Icon className="fa fa-pen" onClick={(e) => showModalUpdate(row)} style={{ color: '#ffa800', fontSize: 15 }} /></span>
                                                <span style={{ cursor: 'pointer' }} data-toggle="tooltip" data-placement="top" title="Delete"><Icon className="fa fa-trash" onClick={(e) => showModalDelete(row.id)} style={{ color: 'rgb(220, 0, 78)', fontSize: 15, marginLeft: 15 }} /></span>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center">No data</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            {total > rowsPerPage && (
                                <div className="customSelector custom-svg">
                                    <Pagination className="pagination-crm" current={page} pageSize={rowsPerPage} total={total} onChange={(p, s) => handleChangePage(p)} />
                                </div>
                            )}
                        </Paper>
                        <Modal
                            title="Xóa câu hỏi"
                            visible={dataDelete.visible}
                            onOk={deleteAction}
                            onCancel={hideDeleteModal}
                            footer={[
                                <ButtonLoading
                                    type="default"
                                    onClick={hideDeleteModal}
                                    className="btn btn-label-secondary btn-secondary"
                                >
                                    Đóng
								</ButtonLoading>,
                                <ButtonLoading
                                    className="btn btn-label-danger btn-danger"
                                    onClick={deleteAction}
                                    loading={isLoadDelete}
                                >
                                    <span>Xóa</span>
                                </ButtonLoading>,
                            ]}
                        >
                            <p>Bạn có muốn xóa câu hỏi này?</p>
                        </Modal>
                        <Modal
                            title='Update User'
                            visible={dataUpdate.visible}
                            cancelText='Cancel'
                            okText='Update'
                            onCancel={clickModalUpdateCancel}
                            onOk={submitUpdate}
                        >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="kt-section">
                                        <Card >
                                            <Card.Body>
                                                <Form onSubmit={handleSubmitUpdate}>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formBasicNameBank">
                                                            <Form.Label className="starDanger">First Name</Form.Label>
                                                            <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="First Name" value={dataUpdate.firstname || ''} onChange={(e) => onChangeUpdateValue('firstname', e.target.value)} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formBasicNameBank">
                                                            <Form.Label className="starDanger">Last Name</Form.Label>
                                                            <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Last Name" value={dataUpdate.lastname || ''} onChange={(e) => onChangeUpdateValue('lastname', e.target.value)} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formBasicNameBank">
                                                            <Form.Label className="starDanger">Email</Form.Label>
                                                            <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Email" value={dataUpdate.email || ''} onChange={(e) => onChangeUpdateValue('email', e.target.value)} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formBasicNameBank">
                                                            <Form.Label className="starDanger">Address</Form.Label>
                                                            <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Address" value={dataUpdate.address || ''} onChange={(e) => onChangeUpdateValue('address', e.target.value)} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formBasicNameBank">
                                                            <Form.Label className="starDanger">City</Form.Label>
                                                            <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="City" value={dataUpdate.city || ''} onChange={(e) => onChangeUpdateValue('city', e.target.value)} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formBasicNameBank">
                                                            <Form.Label className="starDanger">Mobile</Form.Label>
                                                            <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Mobile" value={dataUpdate.mobile || ''} onChange={(e) => onChangeUpdateValue('mobile', e.target.value)} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col}>
                                                            <Form.Label className="starDanger">Active</Form.Label>
                                                            <SelectForm
                                                                optionData={ACTIVE_STATUS}
                                                                keyString="id"
                                                                required
                                                                labelString="name"
                                                                value={dataUpdate.del}
                                                                onChangeValue={(value) => { onChangeUpdateValue('del', value) }}
                                                            />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col}>
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
                                                                    console.log('11111111111111111', value)
                                                                    onChangeUpdateValue("birthday", value.target.value)
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Button variant="primary" type="submit" ref={formUpdate} visible={false} style={{ width: 0, height: 0, paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 0 }} ref={formUpdate}>
                                                    </Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>

                </div>

            </div>
        </div>

    </>)

}