import React, { useState, useEffect } from "react";
import moment from "moment";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import makeRequest from '../../libs/request';
import { Link } from 'react-router-dom';
import ButtonLoading from '../../partials/common/ButtonLoading';
import {
    makeStyles

} from "@material-ui/core/styles";
import { CKEditor } from '@ckeditor/ckeditor5-react';
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
import { map } from "lodash";
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

export default function Product_List(props) {
    const classes1 = useStyles1();
    const formUpdate = React.createRef();
    const formAdd = React.createRef();
    const [dataSearch, setData] = useState({ name: '' });
    const [rows, setRow] = useState([]);
    const [dataProMa, setdataProMa] = useState([]);
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
        getProductManufacturer();

    }, []);
    let index = (page == 1 ? 0 : (rowsPerPage * (page - 1)));
    const onChangeValueSearch = (key, value) => {
        setData({
            ...dataSearch,
            [key]: value
        })
    }
    const disableLoadSubmit = () => {
        setLoadSubmit(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        searchSize(dataSearch);
    }
    const searchSize = (dataSearch = {}) => {
        console.log('111111111111', dataSearch);
        makeRequest('get', `product/getProduct`, dataSearch)
            .then(({ data }) => {
                if (data.signal) {
                    console.log('xxxxxxxxxxxxx', data.data)
                    const res = data.data.listProduct;
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
            return showErrorMessage('Vui lòng nhập tên nhà sản xuất');
        }
        if (!dataAdd.type) {
            return showErrorMessage('Vui lòng chọn kiểu Size');
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
    const getProductManufacturer = () => {
        makeRequest('get', `productmanufacturer/getallProductManufacturer`,)
            .then(({ data }) => {
                console.log("dataaaaaaaaaaaaaaa", data)
                if (data.signal) {
                    setdataProMa(data.data.listProductManufacturer);
                }
            })
            .catch(err => {
                console.log(err)
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
    const clickModalAddCancel = () => {
        setDataAdd({
            ...dataAdd,
            visible: false
        })
    }
    const renderStatusText = (number, quantity_sold) => {
        if (number > quantity_sold) {
            return (<span className="btn btn-label-primary btn-bold btn-sm btn-icon-h" style={{ borderRadius: '.42rem' }}>Còn hàng</span>);
        } else {
            return (<span className="btn btn-label-warning btn-bold btn-sm btn-icon-h" style={{ borderRadius: '.42rem' }}>Hết hàng</span>);
        }
    }
    const submitAdd = (e) => {
        e.preventDefault();
        const nodeAdd = formAdd.current;
        nodeAdd.click();
        disableLoadSubmit(false);
    }
    const renderSize = (data) => {
        let listsize = "";
        data.map((it, index) => {
            listsize = listsize + it.size.name
        })
        return (<TableCell>{listsize}</TableCell>)
    }
    const onChangeAddValue = (key, value) => {
        setDataAdd({
            ...dataAdd,
            [key]: value
        })
        console.log('111111111111111', dataAdd)
    }
    return (

        <>
            <Link onClick={showModalAdd} Icon="" className="btn btn-primary btn-bold btn-sm btn-icon-h kt-margin-l-10">Thêm size</Link>
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
                                            <TableCell>Ảnh</TableCell>
                                            <TableCell>Tên sản phẩm</TableCell>
                                            <TableCell>Mã sản phẩm</TableCell>
                                            <TableCell>Nhã hiệu</TableCell>
                                            <TableCell>Số lượng nhập</TableCell>
                                            <TableCell>Giá nhập</TableCell>
                                            <TableCell>Số lượng đã bán</TableCell>
                                            <TableCell>Giá bán</TableCell>
                                            <TableCell>Mô tả sản phẩm</TableCell>
                                            <TableCell>Size sản phẩm</TableCell>
                                            <TableCell>Trạng thái</TableCell>
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
                                                    {row.image}
                                                </TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.productcode}
                                                </TableCell>
                                                <TableCell>
                                                    {row.productmanufacturer.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.number}
                                                </TableCell>
                                                <TableCell>
                                                    {row.priceold}
                                                </TableCell>
                                                <TableCell>
                                                    {row.quantity_sold}
                                                </TableCell>
                                                <TableCell>
                                                    {row.cost}
                                                </TableCell>
                                                <TableCell>
                                                    {row.description}
                                                </TableCell>
                                                <TableCell>{renderSize(row.productsize)}</TableCell>
                                                <TableCell>{renderStatusText(row.number, row.quantity_sold)}</TableCell>
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

                        </div>
                        {/* {dataAdd.visible && */}
                        <Modal
                            title='Add New User'
                            visible={dataAdd.visible}
                            cancelText='Cancel'
                            okText='Save'
                            onCancel={clickModalAddCancel}
                            onOk={submitAdd}
                        >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="kt-section">
                                        <Card>
                                            <Card.Body>
                                                <Form.Group as={Col} controlId="formProductImage">
                                                    <Form.Label className="starDanger">Ảnh sản phẩm</Form.Label>
                                                    <Form.Control required type="file" autoFocus maxLength={255} ref={inputNameBankRef} accept="image/*" value={dataAdd.image || ''} onChange={(e) => onChangeAddValue('image', e.target.value)} />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formProductName">
                                                    <Form.Label className="starDanger">Tên sản phẩm</Form.Label>
                                                    <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Tên sản phẩm" value={dataAdd.name || ''} onChange={(e) => onChangeAddValue('name', e.target.value)} />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formProductCode">
                                                    <Form.Label className="starDanger">Mã Sản phẩm</Form.Label>
                                                    <Form.Control required type="file" autoFocus maxLength={255} ref={inputNameBankRef} accept="image/*" value={dataAdd.image || ''} onChange={(e) => onChangeAddValue('image', e.target.value)} />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formProductManufacturer">
                                                    <Form.Label className="starDanger">Nhãn hiêun</Form.Label>
                                                    <SelectForm
                                                        optionData={dataProMa}
                                                        keyString="id"
                                                        required
                                                        labelString="name"
                                                        value={dataAdd.productmanufacturerId}
                                                        onChangeValue={(value) => { onChangeAddValue('productmanufacturerId', value) }}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formProductNumber">
                                                    <Form.Label className="starDanger">Số lượng nhập</Form.Label>
                                                    <Form.Control required type="number" autoFocus min="1" ref={inputNameBankRef} value={dataAdd.number || '1'} onChange={(e) => onChangeAddValue('number', e.target.value)} />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formProductPriceold">
                                                    <Form.Label className="starDanger">Giá nhập</Form.Label>
                                                    <Form.Control required type="number" autoFocus min="100000" ref={inputNameBankRef} value={dataAdd.priceold || '100000'} onChange={(e) => onChangeAddValue('priceold', e.target.value)} />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formProductQuantitySold">
                                                    <Form.Label className="starDanger">Số lượng đã bán</Form.Label>
                                                    <Form.Control required type="number" autoFocus min="0" ref={inputNameBankRef} value={dataAdd.quantity_sold || '0'} onChange={(e) => onChangeAddValue('quantity_sold', e.target.value)} />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formProductPriceold">
                                                    <Form.Label className="starDanger">Giá bán</Form.Label>
                                                    <Form.Control required type="number" autoFocus min="100000" ref={inputNameBankRef} value={dataAdd.cost || '100000'} onChange={(e) => onChangeAddValue('cost', e.target.value)} />
                                                </Form.Group>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    
                                                    data={dataAdd.description}
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        onChangeAddValue('description', data)
                                                    }}
                                                />
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>

                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    )
}