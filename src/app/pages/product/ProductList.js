import React, { useState, useEffect } from "react";
import moment from "moment";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import makeRequest from '../../libs/request';
import { Link } from 'react-router-dom';
import InputForm from '../../partials/common/InputForm';
import ButtonLoading from '../../partials/common/ButtonLoading';
import {
    makeStyles

} from "@material-ui/core/styles";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Select from 'react-select';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button
} from "@material-ui/core";
import makeAnimated from 'react-select/animated';

import { Form, Card, Col } from "react-bootstrap";
import Icon from "@material-ui/core/Icon";
import { Modal, Pagination } from "antd";
import { showSuccessMessageIcon, showErrorMessage } from '../../actions/notification';
import SelectForm from '../../partials/common/SelectForm';
import SelectFormMulti from '../../partials/common/MultiSelect';
import "./product.css";
import { map } from "lodash";
import { TYPE_SIZE } from '../../config/common/testme'
import MultiSelect from "react-multi-select-component";
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
    const [selectedlistSize, setSelectedlistSize] = useState(null);
    const classes1 = useStyles1();
    const formUpdate = React.createRef();
    const formAdd = React.createRef();
    const formAddSale = React.createRef();
    const [dataSearch, setData] = useState({ name: '' });
    const [rows, setRow] = useState([]);
    const [dataProMa, setdataProMa] = useState([]);
    const [dataDetail, setDataDetail] = useState({ visible: false });
    const [dataSale, setDataSale] = useState({ visible: false });
    const [dataDelete, setDataDelete] = useState({ visible: false });
    const [dataDeleteSale, setDataDeleteSale] = useState({ visible: false });
    const [dataSize, setdataSize] = useState([]);
    const [dataSizeUpdate, setdataSizeUpdate] = useState([]);
    const [total, setTotal] = useState(0);
    const inputDescriptionRef = React.createRef();
    const [dataUpdate, setDataUpdate] = useState({ visible: false });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [srcImage, setSrcImage] = useState("");
    const [srcImageUpdate, setSrcImageUpdate] = useState("");
    const [isLoadSearch, setLoadSearch] = useState(false);
    const [dataAdd, setDataAdd] = useState({ cost: "100000", priceold: "100000", number: '1' });
    const inputNameBankRef = React.createRef();
    const [LinkImage, setLinkImage] = useState("");
    const [LinkImageUpdate, setLinkImageUpdate] = useState("");
    const [isLoadDelete, setLoadDelete] = useState(false);
    const [isLoadDeleteSale, setLoadDeleteSale] = useState(false);
    const [isLoadSubmit, setLoadSubmit] = useState(false);
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
            name: '',
            productcode: '',
            productmanufacturerId: ''
        });
        setPage(1);
        searchSize({ page: 1, limit: rowsPerPage });
    }
    const handleSubmitAdd = (e) => {
        e.preventDefault();
        let dataTemp = dataAdd;
        let data = [selectedlistSize.value]
        let dataPost = new FormData();
        dataPost.append('file', LinkImage);
        dataPost.append('name', dataTemp.name);
        dataPost.append('productcode', dataTemp.productcode)
        dataPost.append('productmanufacturerId', dataTemp.productmanufacturerId);
        dataPost.append('description', dataTemp.description);
        dataPost.append('number', dataTemp.number);
        dataPost.append('typesize', dataTemp.typesize);
        dataPost.append('listSize', JSON.stringify(data));
        dataPost.append('cost', dataTemp.cost);
        dataPost.append('priceold', dataTemp.priceold);
        makeRequest('post', `product/createProduct`, dataPost)
            .then(({ data }) => {
                console.log('dataaddddddddddd', dataAdd)
                if (data.signal) {
                    showSuccessMessageIcon('Add Successfuly!')
                    setPage(1);
                    searchSize({ page: 1, limit: rowsPerPage });
                    setDataAdd({
                        ...dataAdd,
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
    const showModalDetail = (row) => {
        let listsize = ""
        row.productsize.map((it, index) => {
            listsize = listsize + it.size.name
        })
        console.log('productsize', row.description)
        setDataDetail({
            ...row,
            visible: true,
            ["productmanufacturer"]: row.productmanufacturer.name,
            ["productsizeupdate"]: listsize
        })
        let a = dataDetail
        console.log('1231231231', a)
    }
    const clickModalDetailCancel = () => {
        setDataDetail({
            ...dataDetail,
            visible: false
        })
    }
    const getProductManufacturer = () => {
        makeRequest('get', `productmanufacturer/getallProductManufacturer`,)
            .then(({ data }) => {
                console.log("dataaaaaaaaaaaaaaa", data)
                if (data.signal) {
                    setdataProMa(data.data.listProductManufacturer);
                    console.log()
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
            visible: true,
        })
    }
    const showModalDelete = (id) => {
        setDataDelete({
            id,
            visible: true,
        });
    };
    const showModalDeleteSale = (id) => {
        setDataDeleteSale({
            id,
            visible: true,
        });
    };
    const showModalSale = (row) => {
        setDataSale({
            ...row,
            visible: true
        })
    }
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
    const deleteAction = () => {
        setLoadDelete(true);
        hideDeleteModal();
        setLoadDelete(false);
        makeRequest("get", `product/deleteProduct`, { id: dataDelete.id })
            .then(({ data }) => {
                if (data.signal) {
                    showSuccessMessageIcon("Xóa thành công");
                    let dataQuestion = rows.filter((item) => item.id !== dataDelete.id);
                    setRow(dataQuestion);
                    setTotal(total - 1);
                    hideDeleteModal();
                }
            })
            .catch((err) => {
                showErrorMessage("Xóa thất bại");
                console.log(err);
            });
    };
    const deleteSaleAction = () => {
        setLoadDelete(true);
        hideDeleteSaleModal();
        setLoadDelete(false);
        makeRequest("post", `product/updateSaleProduct`, { id: dataDeleteSale.id.toString(),sale:'0' })
            .then(({ data }) => {
                if (data.signal) {
                    showSuccessMessageIcon("Xóa thành công");
                    rows.forEach((item) => {if(item.id === dataDeleteSale.id){item.sale = 0}});
                    console.log(rows)
                    setRow(rows);
                    hideDeleteModal();
                }
            })
            .catch((err) => {
                showErrorMessage("Xóa thất bại");
                console.log(err);
            });
    };
    const hideDeleteModal = () => {
        setDataDelete({
            ...dataDelete,
            visible: false,
            idDel: 0,
        });
    };
    const hideDeleteSaleModal = () => {
        setDataDeleteSale({
            ...dataDeleteSale,
            visible: false,
        });
    };
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
    const clickModalUpdateCancel = () => {
        setDataUpdate({
            ...dataUpdate,
            visible: false
        })
    }
    const clickModalSaleCancel = () => {
        setDataSale({
            ...dataSale,
            visible: false
        })
    }
    const submitUpdate = (e) => {
        e.preventDefault();
        const nodeUpdate = formUpdate.current;
        nodeUpdate.click();
    }
    const submitSale = (e) => {
        e.preventDefault();
        const nodeUpdateSale = formAddSale.current;
        nodeUpdateSale.click();
    }
    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        let dataTemp = dataUpdate;
        //let data = [dataUpdate.productsize]
        let dataPost = new FormData();
        dataPost.append('file', LinkImageUpdate);
        dataPost.append('id', dataTemp.id);
        dataPost.append('name', dataTemp.name);
        dataPost.append('productcode', dataTemp.productcode)
        dataPost.append('productmanufacturerId', dataTemp.productmanufacturerId);
        dataPost.append('description', dataTemp.description);
        dataPost.append('number', dataTemp.number);
        dataPost.append('cost', dataTemp.cost);
        dataPost.append('priceold', dataTemp.priceold);
        console.log('dataupdateeeeeeeeeeeeeeeeee', dataTemp)
        makeRequest('post', `product/updateProduct`, dataPost)
            .then(({ data }) => {
                if (data.signal) {
                    showSuccessMessageIcon('Update Successfuly!')
                    setDataUpdate({
                        ...dataUpdate,
                        visible: false
                    });
                    let update = dataUpdate;
                    console.log('111111111111111111', update)
                    let dataRow = rows.map(it => {
                        if (it.id == data.data.id) {
                            return data.data;
                        }
                        return it;
                    })
                    console.log('datarowwwwwwww', dataRow)
                    setRow(dataRow);

                } else {
                    return showErrorMessage(data.message);
                }
            })
            .catch(err => {
                console.log('Error', err)
            })
    }
    const handleSubmitSale = (e) => {
        console.log('11111111111111111111111111111111111111',dataSale)
        e.preventDefault();
        makeRequest('post', `product/updateSaleProduct`, dataSale)
            .then(({ data }) => {
                if (data.signal) {
                    showSuccessMessageIcon('Update Successfuly!')
                    setDataSale({
                        visible: false
                    });

                    let dataRow = rows.map(it => {
                        if (it.id == dataSale.id) {
                            return dataSale;
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
    const onChangeAddValue = (key, value) => {
        setDataAdd({
            ...dataAdd,
            [key]: value
        })
        console.log('111111111111111', dataAdd)
    }
    const onChangeSale = (key, value) => {
        setDataSale({
            ...dataSale,
            [key]: value
        })
        console.log('111111111111111', dataSale)
    }
    const onChangeLink = (event) => {
        const file = event.target.files[0];
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            return showErrorMessage('Support PNG|JPEG|JPG.');
        }
        let url = window.URL.createObjectURL(file);
        setSrcImage(url);
        setLinkImage(event.target.files[0]);

    }
    const onChangeLinkUpdate = (event) => {
        const file = event.target.files[0];
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            return showErrorMessage('Support PNG|JPEG|JPG.');
        }
        let url = window.URL.createObjectURL(file);
        setSrcImageUpdate(url);
        setLinkImageUpdate(event.target.files[0]);

    }
    const getListSize = async (key, value) => {
        let dataTemp = dataAdd;
        setDataAdd({
            ...dataAdd,
            [key]: value
        })
        dataTemp[key] = value;
        console.log('1', dataAdd.typesize)
        makeRequest('get', `size/getSizebyType`, dataTemp)
            .then(({ data }) => {
                console.log("dataaaaaaaaaaaaaaa", data)
                if (data.signal) {
                    setdataSize(data.data.listSize);
                }
            })
            .catch(err => {
                console.log(err)
            })

        console.log('2', dataAdd.typesize)
    }
    const onChangeUpdateValue = (key, value) => {
        setDataUpdate({
            ...dataUpdate,
            [key]: value
        })
    }
    const animatedComponents = makeAnimated();
    return (

        <>
            <Link onClick={showModalAdd} Icon="" className="btn btn-primary btn-bold btn-sm btn-icon-h kt-margin-l-10">Thêm mới sản phẩm</Link>
            <div className="row">

                <div className="col-md-12">
                    <div className="kt-section">
                        <div className="kt-section__content">
                            <Paper className={classes1.root}>
                                <div className="col-md-12">
                                    <Form onSubmit={handleSubmit}>
                                        <div style={{ marginTop: 20, fontSize: 20 }}><label>Tìm kiếm</label></div>
                                        <div className='form-row'>

                                            <div className="form-group col-md-2" style={{ display: 'flex' }} >
                                                <div className="col"></div>
                                                <SelectForm
                                                    optionData={dataProMa}
                                                    keyString="id"
                                                    required
                                                    placeholder="Nhãn hiệu"
                                                    labelString="name"
                                                    value={dataSearch.productmanufacturerId}
                                                    onChangeValue={(value) => { onChangeValueSearch('productmanufacturerId', value) }}
                                                />
                                            </div>
                                            <div className="form-group col-md-2" style={{ display: 'flex' }} >
                                                <div className="col"></div>
                                                <InputForm
                                                    type="text"
                                                    placeholder="Mã sản phẩm"
                                                    value={dataSearch.productcode || ""}
                                                    onChangeValue={(value) => {
                                                        console.log('123456', value)
                                                        onChangeValueSearch('productcode', value)
                                                    }}
                                                    focus={true}
                                                />
                                            </div>
                                            <div className="form-group col-md-2" style={{ display: 'flex' }} >
                                                <div className="col"></div>
                                                <InputForm
                                                    type="text"
                                                    placeholder="Tên sản phẩm"
                                                    value={dataSearch.name || ""}
                                                    onChangeValue={(value) => { onChangeValueSearch('name', value) }}
                                                    focus={true}
                                                />
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
                                            <TableCell>Size</TableCell>
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
                                                    <img src={row.image} width="100" height="100" />
                                                </TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.productcode}
                                                </TableCell>
                                                <TableCell>
                                                    {dataProMa.map(i => {
                                                        if (i.id === row.productmanufacturerId) {
                                                            return i.name || ""
                                                        }
                                                    })}
                                                </TableCell>
                                                <TableCell>{renderSize(row.productsize)}</TableCell>
                                                <TableCell>{renderStatusText(row.number, row.quantity_sold)}</TableCell>
                                                <TableCell>
                                                    <span style={{ cursor: 'pointer' }} data-toggle="tooltip" data-placement="top" onClick={(e) => showModalUpdate(row)} title="Edit data"><Icon className="fa fa-pen" style={{ color: '#ffa800', fontSize: 15 }} /></span>
                                                    <span style={{ cursor: 'pointer' }} data-toggle="tooltip" data-placement="top" onClick={(e) => showModalDelete(row.id)} title="Delete"><Icon className="fa fa-trash" style={{ color: 'rgb(220, 0, 78)', fontSize: 15, marginLeft: 15 }} /></span>
                                                    <span style={{ cursor: 'pointer' }} data-toggle="tooltip" data-placement="top" onClick={(e) => showModalDetail(row)} title="Delete"><Icon className="fa fa-info-circle" style={{ color: 'rgb(220, 0, 78)', fontSize: 15, marginLeft: 15 }} /></span>
                                                    {row.sale > 0 ? <span style={{ cursor: 'pointer' }} data-toggle="tooltip" data-placement="top" onClick={(e) => showModalDeleteSale(row.id)} title="Sales"><Icon className="fa fa-bolt" aria-hidden="true" style={{ color: 'rgb(220, 0, 78)', fontSize: 15, marginLeft: 15 }} /></span> :
                                                        <span style={{ cursor: 'pointer' }} data-toggle="tooltip" data-placement="top" onClick={(e) => showModalSale(row)} title="Sales"><Icon className="fa fa-bolt" aria-hidden="true" style={{ fontSize: 15, marginLeft: 15 }} /></span>}

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
                            title='Thêm mới sản phẩm'
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
                                                <Form onSubmit={handleSubmitAdd}>
                                                    <Form.Group as={Col} controlId="formProductImage">
                                                        <Form.Label className="starDanger">Ảnh sản phẩm</Form.Label>
                                                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-3">
                                                            <div className="imgAvatarContainer">
                                                                <div className="imgAvatar">
                                                                    {LinkImage ? <img src={srcImage} alt={srcImage} className="img-circle img-full-width" /> :
                                                                        <img src={dataAdd.image} alt={dataAdd.image} className="img-circle img-full-width" />
                                                                    }
                                                                </div>
                                                                <div className="marginT10">
                                                                    <label className="fileInputTextKT" htmlFor="inputGroupFile01">
                                                                        Click here to upload image
                                                                         <input type="file" accept="image/*" id="inputGroupFile01" onChange={onChangeLink} />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductName">
                                                        <Form.Label className="starDanger">Tên sản phẩm</Form.Label>
                                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Tên sản phẩm" value={dataAdd.name || ''} onChange={(e) => onChangeAddValue('name', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductCode">
                                                        <Form.Label className="starDanger">Mã Sản phẩm</Form.Label>
                                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Mã sản phẩm" value={dataAdd.productcode || ''} onChange={(e) => onChangeAddValue('productcode', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductManufacturer">
                                                        <Form.Label className="starDanger">Nhãn hiệu</Form.Label>
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
                                                    <Form.Group as={Col} controlId="formProductPriceold">
                                                        <Form.Label className="starDanger">Giá bán</Form.Label>
                                                        <Form.Control required type="number" autoFocus min="100000" ref={inputNameBankRef} value={dataAdd.cost || '100000'} onChange={(e) => {
                                                            onChangeAddValue('cost', e.target.value)
                                                        }} />
                                                    </Form.Group>
                                                    <Form.Label className="starDanger">Chi tiết sản phẩm</Form.Label>
                                                    <CKEditor
                                                        editor={ClassicEditor}

                                                        data={dataAdd.description || ""}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            console.log('ckeditor ', data)
                                                            onChangeAddValue('description', data)
                                                        }}
                                                    />
                                                    <Form.Group as={Col} controlId="formProductTypesize">
                                                        <Form.Label className="starDanger">Chọn kiểu size</Form.Label>
                                                        <SelectForm
                                                            optionData={TYPE_SIZE}
                                                            keyString="id"
                                                            required
                                                            labelString="name"
                                                            value={dataAdd.typesize}
                                                            onChangeValue={(value) => { getListSize('typesize', value) }}
                                                        />
                                                    </Form.Group>
                                                    {dataAdd.typesize ?
                                                        <Form.Group as={Col} controlId="formProductPriceold">
                                                            <Form.Label className="starDanger">Chọn Size</Form.Label>
                                                            <Select
                                                                components={animatedComponents}
                                                                isMulti={false}
                                                                options={dataSize.map(it => { return { value: it.id, label: it.name } })}
                                                                onChange={setSelectedlistSize}

                                                            //value={dataUpdateTopic || []}
                                                            />
                                                        </Form.Group>
                                                        : null

                                                    }
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
                            title="Xóa sản phẩm"
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
                            <p>Bạn có muốn xóa sản phẩm này?</p>
                        </Modal>
                        <Modal
                            title='Chi tiết sản phẩm'
                            visible={dataDetail.visible}
                            cancelText='Cancel'
                            okText='OK'
                            onCancel={clickModalDetailCancel}
                            onOk={clickModalDetailCancel}
                            cancelButtonProps={{ style: { display: 'none' } }}
                        >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="kt-section">
                                        <Card >
                                            <Card.Body>
                                                <Form>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formBasicNameBank">
                                                            <Form.Label className="starDanger">Ảnh sản phẩm</Form.Label>
                                                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-3">
                                                                <div className="imgAvatarContainer">
                                                                    <div className="imgAvatar">
                                                                        {LinkImage ? <img src={srcImage} alt={srcImage} className="img-circle img-full-width" /> :
                                                                            <img src={dataDetail.image} alt={dataDetail.image} className="img-circle img-full-width" />
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductName">
                                                            <Form.Label className="starDanger">Tên sản phẩm</Form.Label>
                                                            <Form.Control readOnly type="text" autoFocus maxLength={255} ref={inputDescriptionRef} value={dataDetail.name} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductCode">
                                                            <Form.Label className="starDanger">Mã sản phẩm</Form.Label>
                                                            <Form.Control readOnly type="text" autoFocus maxLength={255} ref={inputDescriptionRef} value={dataDetail.productcode} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductName">
                                                            <Form.Label className="starDanger">Nhãn hiệu</Form.Label>
                                                            <Form.Control readOnly type="text" autoFocus maxLength={255} ref={inputDescriptionRef} value={dataDetail.productmanufacturer} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductName">
                                                            <Form.Label className="starDanger">Số lượng nhập</Form.Label>
                                                            <Form.Control readOnly type="text" autoFocus maxLength={255} ref={inputDescriptionRef} value={dataDetail.number} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductName">
                                                            <Form.Label className="starDanger">Giá nhập</Form.Label>
                                                            <Form.Control readOnly type="text" autoFocus maxLength={255} ref={inputDescriptionRef} value={dataDetail.priceold} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductName">
                                                            <Form.Label className="starDanger">Số lượng đã bán</Form.Label>
                                                            <Form.Control readOnly type="text" autoFocus maxLength={255} ref={inputDescriptionRef} value={dataDetail.quantity_sold} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductName">
                                                            <Form.Label className="starDanger">Giá bán</Form.Label>
                                                            <Form.Control readOnly type="text" autoFocus maxLength={255} ref={inputDescriptionRef} value={dataDetail.cost} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    {dataDetail.sale > 0 ? <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductName">
                                                            <Form.Label className="starDanger">Giá bán sau sale</Form.Label>
                                                            <Form.Control readOnly type="text" autoFocus maxLength={255} ref={inputDescriptionRef} value={dataDetail.cost - (dataDetail.cost*dataDetail.sale)/100} />
                                                        </Form.Group>
                                                    </Form.Row>: null}
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductName">
                                                            <Form.Label className="starDanger">Size</Form.Label>
                                                            <Form.Control readOnly type="text" autoFocus maxLength={255} ref={inputDescriptionRef} value={dataDetail.productsizeupdate} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="FormProductName">
                                                            <Form.Label className="starDanger">Chi tiết sản phẩm</Form.Label>
                                                            {<div dangerouslySetInnerHTML={{ __html: dataDetail.description }} className='editor'></div>}


                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Button variant="primary" type="submit" visible={false} style={{ width: 0, height: 0, paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 0 }} ref={formUpdate}>
                                                    </Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        <Modal
                            title='Cập nhật sản phẩm'
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
                                                    <Form.Group as={Col} controlId="formProductImage">
                                                        <Form.Label className="starDanger">Ảnh sản phẩm</Form.Label>
                                                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-3">
                                                            <div className="imgAvatarContainer">
                                                                <div className="imgAvatar">
                                                                    {LinkImageUpdate ? <img src={srcImageUpdate} alt={srcImageUpdate} className="img-circle img-full-width" /> :
                                                                        <img src={dataUpdate.image} alt={dataUpdate.image} className="img-circle img-full-width" />
                                                                    }
                                                                </div>
                                                                <div className="marginT10">
                                                                    <label className="fileInputTextKT" htmlFor="inputGroupFile01">
                                                                        Click here to upload image
                                                                         <input type="file" accept="image/*" id="inputGroupFile01" onChange={onChangeLinkUpdate} />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductName">
                                                        <Form.Label className="starDanger">Tên sản phẩm</Form.Label>
                                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Tên sản phẩm" value={dataUpdate.name || ''} onChange={(e) => onChangeUpdateValue('name', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductCode">
                                                        <Form.Label className="starDanger">Mã Sản phẩm</Form.Label>
                                                        <Form.Control required type="text" autoFocus maxLength={255} ref={inputNameBankRef} placeholder="Mã sản phẩm" value={dataUpdate.productcode || ''} onChange={(e) => onChangeUpdateValue('productcode', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductManufacturer">
                                                        <Form.Label className="starDanger">Nhãn hiệu</Form.Label>
                                                        <SelectForm
                                                            optionData={dataProMa}
                                                            keyString="id"
                                                            required
                                                            labelString="name"
                                                            value={dataUpdate.productmanufacturerId}
                                                            onChangeValue={(value) => { onChangeUpdateValue('productmanufacturerId', value) }}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductNumber">
                                                        <Form.Label className="starDanger">Số lượng nhập</Form.Label>
                                                        <Form.Control required type="number" autoFocus min="1" ref={inputNameBankRef} value={dataUpdate.number || '1'} onChange={(e) => onChangeUpdateValue('number', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductPriceold">
                                                        <Form.Label className="starDanger">Giá nhập</Form.Label>
                                                        <Form.Control required type="number" autoFocus min="100000" ref={inputNameBankRef} value={dataUpdate.priceold || '100000'} onChange={(e) => onChangeUpdateValue('priceold', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductCost">
                                                        <Form.Label className="starDanger">Giá bán</Form.Label>
                                                        <Form.Control required type="number" autoFocus min="100000" ref={inputNameBankRef} value={dataUpdate.cost || '100000'} onChange={(e) => onChangeUpdateValue('cost', e.target.value)} />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="formProductDescription">
                                                        <Form.Label className="starDanger">Chi tiết sản phẩm</Form.Label>
                                                        <CKEditor
                                                            editor={ClassicEditor}

                                                            data={dataUpdate.description || ""}
                                                            onChange={(event, editor) => {
                                                                const data = editor.getData();
                                                                onChangeUpdateValue('description', data)
                                                            }}
                                                        />
                                                    </Form.Group>
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
                            title='Sale sản phẩm'
                            visible={dataSale.visible}
                            cancelText='Cancel'
                            okText='OK'
                            onCancel={clickModalSaleCancel}
                            onOk={submitSale}
                            cancelButtonProps={{ style: { display: 'none' } }}
                        >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="kt-section">
                                        <Card>
                                            <Card.Body>
                                                <Form onSubmit={handleSubmitSale}>
                                                <Form.Group as={Col} controlId="formProductNumber">
                                                        <Form.Label className="starDanger">Phần trăm sale</Form.Label>
                                                        <Form.Control required type="number" autoFocus min="1" max="100" ref={inputNameBankRef} value={dataSale.sale || '1'} onChange={(e) => onChangeSale('sale', e.target.value)} />
                                                    </Form.Group>
                                                    <Button variant="primary" type="submit" visible={false} style={{ width: 0, height: 0, paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 0 }} ref={formAddSale}>
                                                    </Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            </div>

                        </Modal>
                        <Modal
                            title="Xóa Sale sản phẩm"
                            visible={dataDeleteSale.visible}
                            onOk={deleteSaleAction}
                            onCancel={hideDeleteSaleModal}
                            footer={[
                                <ButtonLoading
                                    type="default"
                                    onClick={hideDeleteSaleModal}
                                    className="btn btn-label-secondary btn-secondary"
                                >
                                    Đóng
								</ButtonLoading>,
                                <ButtonLoading
                                    className="btn btn-label-danger btn-danger"
                                    onClick={deleteSaleAction}
                                    loading={isLoadDeleteSale}
                                >
                                    <span>Xóa</span>
                                </ButtonLoading>,
                            ]}
                        >
                            <p>Bạn có muốn xóa sale sản phẩm này?</p>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    )
}