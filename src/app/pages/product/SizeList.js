import React, { useState, useEffect } from "react";
import moment from "moment";
import makeRequest from '../../libs/request';
import { Link } from 'react-router-dom';
import ButtonLoading from '../../partials/common/ButtonLoading';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
    makeStyles
} from "@material-ui/core/styles";
import { TYPE_SIZE } from '../../config/common/testme'
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button
} from "@material-ui/core";

import { Form, Card, Col } from "react-bootstrap";
import Icon from "@material-ui/core/Icon";

import { Modal, Pagination } from "antd";
import { showSuccessMessageIcon, showErrorMessage } from '../../actions/notification';
import SelectForm from '../../partials/common/SelectForm';
import "./product.css";
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
export default function Product_Manufacturer(props) {
    const classes1 = useStyles1();
    const formUpdate = React.createRef();
    const formAdd = React.createRef();
    const [dataSearch, setData] = useState({ name: '' });
    const [rows, setRow] = useState([]);
    const [total, setTotal] = useState(0);
    const [dataUpdate, setDataUpdate] = useState({ visible: false });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [isLoadSearch, setLoadSearch] = useState(false);
    const [dataAdd, setDataAdd] = useState({});
    const inputNameBankRef = React.createRef();
    const [isLoadDelete, setLoadDelete] = useState(false);
    const [isLoadSubmit, setLoadSubmit] = useState(false);
    const [dataDelete, setDataDelete] = useState({ visible: false });
    useEffect(() => {
        searchSize({ page: 1, limit: rowsPerPage });

    }, []);
    let index = (page == 1 ? 0 : (rowsPerPage * (page - 1)));
    const onChangeAddValue = (key, value) => {
        console.log("333333333333333333", value)
        console.log("4444444444444444", key)
        setDataAdd({
            ...dataAdd,
            [key]: value
        })
        console.log('111111111111111', dataAdd)
    }
    const onChangeValueSearch = (key, value) => {
        setData({
            ...dataSearch,
            [key]: value
        })
    }
    const clickModalAddCancel = () => {
        setDataAdd({
            ...dataAdd,
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
    const disableLoadSubmit = () => {
        setLoadSubmit(false);
    };
    const submitAdd = (e) => {
        e.preventDefault();
        const nodeAdd = formAdd.current;
        nodeAdd.click();
        disableLoadSubmit(false);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        searchSize(dataSearch);
    }
    const searchSize = (dataSearch = {}) => {
        console.log('111111111111', dataSearch);
        makeRequest('get', `size/getSize`, dataSearch)
            .then(({ data }) => {
                if (data.signal) {
                    console.log('xxxxxxxxxxxxx', data.data)
                    const res = data.data.listSize;
                    setRow(res);
                    setTotal(data.data.total)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    const unfilteredData = (e) => {
        setData({
            name: ''
        });
        setPage(1);
        searchSize({ page: 1, limit: rowsPerPage });
    }
    const handleSubmitAdd = (e) => {
        e.preventDefault();
        if (!dataAdd.name) {
            return showErrorMessage('Vui l??ng nh???p t??n nh?? s???n xu???t');
        }
        if (!dataAdd.type) {
            return showErrorMessage('Vui l??ng ch???n ki???u Size');
        }
        //enableLoadSubmit();
        makeRequest('post', `size/createSize`, dataAdd)
            .then(({ data }) => {
                console.log('dataaddddddddddd', dataAdd)
                if (data.signal) {
                    showSuccessMessageIcon('Add Successfuly!')
                    setPage(1);
                    searchSize({ page: 1, limit: rowsPerPage });
                    setDataAdd({
                        visible: false
                    })
                } else {
                    showErrorMessage(data.message);
                }
                disableLoadSubmit();
            })
            .catch(err => {
                disableLoadSubmit();
            })
    }
    const deleteAction = () => {
        setLoadDelete(true);
        hideDeleteModal();
        setLoadDelete(false);
        makeRequest("get", `size/deleteSize`, { id: dataDelete.id })
            .then(({ data }) => {
                if (data.signal) {
                    showSuccessMessageIcon("X??a th??nh c??ng");
                    let data = rows.filter((item) => item.id !== dataDelete.id);
                    setRow(data);
                    setTotal(total - 1);
                    hideDeleteModal();
                }
            })
            .catch((err) => {
                showErrorMessage("X??a th???t b???i");
                console.log(err);
            });
    };
    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        if (!dataUpdate.name) {

            return showErrorMessage('Vui l??ng nh???p t??n nh?? s???n xu???t');
        }
        console.log('dataupdateeeeeeeeeeeeeeeeee', dataUpdate)
        makeRequest('post', `size/updateSize`, dataUpdate)
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
    const submitUpdate = (e) => {
        e.preventDefault();
        const nodeUpdate = formUpdate.current;
        nodeUpdate.click();
    }
    const clickModalUpdateCancel = () => {
        setDataUpdate({
            ...dataUpdate,
            visible: false
        })
    }
    const showModalAdd = () => {
        setDataAdd({
            ...dataAdd,
            visible: true
        })
    }
    const showModalUpdate = (row) => {
        setDataUpdate({
            ...row,
            visible: true
        })
    }
    const showModalDelete = (id) => {
        setDataDelete({
            id,
            visible: true,
        });
    };
    const renderStatusText = (category) => {
        if (category == 0) {
            return (<span className="btn btn-label-primary btn-bold btn-sm btn-icon-h" style={{ borderRadius: '.42rem' }}>Size ??o</span>);
        } else {
            return (<span className="btn btn-label-primary btn-bold btn-sm btn-icon-h" style={{ borderRadius: '.42rem' }}>Size gi??y</span>);
        }
    }
    const onChangeUpdateValue = (key, value) => {
        setDataUpdate({
            ...dataUpdate,
            [key]: value
        })
    }
    return (
        <>
            <Link onClick={showModalAdd} Icon="" className="btn btn-primary btn-bold btn-sm btn-icon-h kt-margin-l-10">Th??m size</Link>
            <div className="row">
                <div className="col-md-12">
                    <div className="kt-section">
                        <div className="kt-section__content">
                            <Paper className={classes1.root}>
                                <div className="col-md-12">
                                    <Form onSubmit={handleSubmit}>
                                        <div style={{ marginTop: 20, fontSize: 20 }}><label>T??m ki???m</label></div>
                                        <div className='form-row'>
                                            <div className='form-group col-md-2'>
                                                <div className="form-group" style={{ display: 'flex' }} >
                                                    <SelectForm
                                                        optionData={TYPE_SIZE}
                                                        keyString="id"
                                                        required
                                                        labelString="name"
                                                        value={dataSearch.type}
                                                        onChangeValue={(value) => { onChangeValueSearch('type', value) }}
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
                                                    <span>B??? l???c</span>
                                                </button>

                                                <ButtonLoading
                                                    type="submit"
                                                    className="btn btn-label-primary btn-bold btn-sm btn-icon-h kt-margin-l-10"
                                                    loading={isLoadSearch}
                                                    style={{ marginLeft: 10, marginTop: 3 }}
                                                >
                                                    <span>T??m ki???m</span>
                                                </ButtonLoading>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No</TableCell>
                                            <TableCell>Size</TableCell>
                                            <TableCell>Ki???u size</TableCell>
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
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>{renderStatusText(row.type)}</TableCell>
                                                <TableCell>{moment(row.createdAt).format("HH:mm DD-MM-YYYY")}</TableCell>
                                                <TableCell>{moment(row.updatedAt).format("HH:mm DD-MM-YYYY")}</TableCell>
                                                <TableCell>
                                                    <span style={{ cursor: 'pointer' }} d data-toggle="tooltip" data-placement="top" onClick={(e) => showModalUpdate(row)} title="Edit data"><Icon className="fa fa-pen" style={{ color: '#ffa800', fontSize: 15 }} /></span>
                                                    <span style={{ cursor: 'pointer' }} data-toggle="tooltip" data-placement="top" onClick={(e) => showModalDelete(row.id)} title="Delete"><Icon className="fa fa-trash" style={{ color: 'rgb(220, 0, 78)', fontSize: 15, marginLeft: 15 }} /></span>
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
                                        <Pagination className="pagination-crm" current={page} pageSize={rowsPerPage} total={total} />
                                    </div>
                                )}
                            </Paper>
                            <Modal
                                title='Th??m m???i Size'
                                visible={dataAdd.visible}
                                cancelText='Cancel'
                                okText='Save'
                                onCancel={clickModalAddCancel}
                                onOk={submitAdd}
                            >
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="kt-section">
                                            <Card >
                                                <Card.Body>
                                                    <Form onSubmit={handleSubmitAdd}>
                                                        <Form.Row>
                                                            <Form.Group as={Col} controlId="formFirstName">
                                                                <Form.Label className="starDanger">Size</Form.Label>
                                                                <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Size" value={dataAdd.name || ''} onChange={(e) => {
                                                                    console.log('2222222222222222', e.target.value)
                                                                    onChangeAddValue('name', e.target.value)
                                                                }} />
                                                            </Form.Group>
                                                        </Form.Row>
                                                        <Form.Row>
                                                            <Form.Group as={Col} controlId="formFirstName">
                                                                <Form.Label className="starDanger">Ki???u Size</Form.Label>
                                                                <SelectForm
                                                                    optionData={TYPE_SIZE}
                                                                    keyString="id"
                                                                    required
                                                                    labelString="name"
                                                                    value={dataAdd.type||""}
                                                                    onChangeValue={(value) => { onChangeAddValue('type', value) }}
                                                                />

                                                            </Form.Group>
                                                        </Form.Row>
                                                        <Button variant="primary" type="submit" ref={formAdd} visible={false} style={{ width: 0, height: 0, paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 0 }} ref={formAdd}>
                                                        </Button>
                                                    </Form>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                            <Modal
                                title='C???p nh???t nh?? s???n xu???t'
                                visible={dataUpdate.visible}
                                cancelText='Cancel'
                                okText='Save'
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
                                                            <Form.Group as={Col} controlId="formFirstName">
                                                                <Form.Label className="starDanger">Size</Form.Label>
                                                                <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Size" value={dataUpdate.name || ''} onChange={(e) => {
                                                                    console.log('2222222222222222', e.target.value)
                                                                    onChangeUpdateValue('name', e.target.value)
                                                                }} />
                                                            </Form.Group>
                                                        </Form.Row>
                                                        <Form.Row>
                                                            <Form.Group as={Col} controlId="formFirstName">
                                                                <Form.Label className="starDanger">Ki???u Size</Form.Label>
                                                                <SelectForm
                                                                    optionData={TYPE_SIZE}
                                                                    keyString="id"
                                                                    required
                                                                    labelString="name"
                                                                    value={dataUpdate.type}
                                                                    onChangeValue={(value) => { onChangeUpdateValue('type', value) }}
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
                            <Modal
                                title="X??a nh?? s???n xu???t"
                                visible={dataDelete.visible}
                                onOk={deleteAction}
                                onCancel={hideDeleteModal}
                                footer={[
                                    <ButtonLoading
                                        type="default"
                                        onClick={hideDeleteModal}
                                        className="btn btn-label-secondary btn-secondary"
                                    >
                                        ????ng
								</ButtonLoading>,
                                    <ButtonLoading
                                        className="btn btn-label-danger btn-danger"
                                        onClick={deleteAction}
                                        loading={isLoadDelete}
                                    >
                                        <span>X??a</span>
                                    </ButtonLoading>,
                                ]}
                            >
                                <p>B???n c?? mu???n x??a c??u h???i n??y?</p>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}