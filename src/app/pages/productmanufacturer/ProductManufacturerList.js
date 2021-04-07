import React, { useState, useEffect } from "react";
import moment from "moment";
import makeRequest from '../../libs/request';
import { Link } from 'react-router-dom';
import InputForm from '../../partials/common/InputForm';
import ButtonLoading from '../../partials/common/ButtonLoading';
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

import { Form , Card, Col} from "react-bootstrap";
import Icon from "@material-ui/core/Icon";

import { Modal, Pagination } from "antd";
import { showSuccessMessageIcon, showErrorMessage } from '../../actions/notification';
import SelectForm from '../../partials/common/SelectForm';
import "./productmanufacturer.css";
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
    const [dataSearch, setData] = useState({ name: ''});
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
        searchProductManufacturer({ page: 1, limit: rowsPerPage });

    }, []);
    let index = (page == 1 ? 0 : (rowsPerPage * (page - 1)));
    const onChangeAddValue = (key, value) => {
        console.log("333333333333333333",value)
        console.log("4444444444444444",key)
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
        searchProductManufacturer(dataSearch);
    }
    const searchProductManufacturer = (dataSearch = {}) => {
        console.log('111111111111', dataSearch);
        makeRequest('get', `productmanufacturer/getallProductManufacturer`, dataSearch)
            .then(({ data }) => {
                if (data.signal) {
                    console.log('xxxxxxxxxxxxx', data.data)
                    const res = data.data.listProductManufacturer;
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
        searchProductManufacturer({ page: 1, limit: rowsPerPage });
    }
    const handleSubmitAdd = (e) => {
        e.preventDefault();
        if (!dataAdd.name) {
            return showErrorMessage('Vui lòng nhập tên nhà sản xuất');
        }
        //enableLoadSubmit();
        makeRequest('post', `productmanufacturer/createProductManufacturer`, dataAdd)
            .then(({ data }) => {
                console.log('dataaddddddddddd', dataAdd)
                if (data.signal) {
                    showSuccessMessageIcon('Add Successfuly!')
                    setPage(1);
                    searchProductManufacturer({ page: 1, limit: rowsPerPage });
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
        makeRequest("get", `productmanufacturer/deleteProductManufacturer`, { id: dataDelete.id })
            .then(({ data }) => {
                if (data.signal) {
                    showSuccessMessageIcon("Xóa thành công");
                    let data = rows.filter((item) => item.id !== dataDelete.id);
                    setRow(data);
                    setTotal(total - 1);
                    hideDeleteModal();
                }
            })
            .catch((err) => {
                showErrorMessage("Xóa thất bại");
                console.log(err);
            });
    };
    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        if (!dataUpdate.name) {

            return showErrorMessage('Vui lòng nhập tên nhà sản xuất');
        }
        console.log('dataupdateeeeeeeeeeeeeeeeee', dataUpdate)
        makeRequest('post', `productmanufacturer/updateProductManufacturer`, dataUpdate)
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
    const onChangeUpdateValue = (key, value) => {
        setDataUpdate({
            ...dataUpdate,
            [key]: value
        })
    }
    return (
        <>
        <Link onClick={showModalAdd} Icon="" className="btn btn-primary btn-bold btn-sm btn-icon-h kt-margin-l-10">Thêm mới nhà sản xuất</Link>
            <div className="row">
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
                                                        placeholder="tên nhà sản xuất"
                                                        value={dataSearch.name || ""}
                                                        onChangeValue={(value) => { onChangeValueSearch('name', value) }}
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
                                            <TableCell>Tên nhà sản xuất</TableCell>
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
                                                <TableCell>{moment(row.createdAt).format("HH:mm DD-MM-YYYY")}</TableCell>
                                                <TableCell>{moment(row.updatedAt).format("HH:mm DD-MM-YYYY")}</TableCell>
                                                <TableCell>
                                                    <span style={{ cursor: 'pointer' }} d data-toggle="tooltip" data-placement="top" onClick={(e) => showModalUpdate(row)} title="Edit data"><Icon className="fa fa-pen"  style={{ color: '#ffa800', fontSize: 15 }} /></span>
                                                    <span style={{ cursor: 'pointer' }} data-toggle="tooltip" data-placement="top"  onClick={(e) => showModalDelete(row.id)} title="Delete"><Icon className="fa fa-trash"  style={{ color: 'rgb(220, 0, 78)', fontSize: 15, marginLeft: 15 }} /></span>
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
                                        <Pagination className="pagination-crm" current={page} pageSize={rowsPerPage} total={total}  />
                                    </div>
                                )}
                            </Paper>
                            <Modal
                            title='Thêm mới nhà sản xuất'
                            visible={dataAdd.visible}
                            cancelText='Cancel'
                            okText='Save'
                            onCancel={clickModalAddCancel}
                            onOk={submitUpdate}
                        >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="kt-section">
                                        <Card >
                                            <Card.Body>
                                                <Form onSubmit={handleSubmitAdd}>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formFirstName">
                                                            <Form.Label className="starDanger">Tên nhà sản xuất</Form.Label>
                                                            <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Tên nhà sản xuất" value={dataAdd.name ||''} onChange={(e) => {
                                                                console.log('2222222222222222',e.target.value)
                                                                onChangeAddValue('name',e.target.value)} }/>
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
                            title='Cập nhật nhà sản xuất'
                            visible={dataUpdate.visible}
                            cancelText='Cancel'
                            okText='Save'
                            onCancel={clickModalUpdateCancel}
                            onOk={submitAdd}
                        >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="kt-section">
                                        <Card >
                                            <Card.Body>
                                                <Form onSubmit={handleSubmitUpdate}>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formFirstName">
                                                            <Form.Label className="starDanger">Tên nhà sản xuất</Form.Label>
                                                            <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Tên nhà sản xuất" value={dataUpdate.name ||''} onChange={(e) => {
                                                                console.log('2222222222222222',e.target.value)
                                                                onChangeUpdateValue('name',e.target.value)} }/>
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
                            title="Xóa nhà sản xuất"
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}