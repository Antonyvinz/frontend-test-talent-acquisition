import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Dropdown, Image, Input, Menu, MenuProps, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosRepository from "../../config/Axios";
import itemEmptyVector from "../../assets/images/todo-empty-state.svg";
import iconEdit from "../../assets/icons/icon-edit.svg";
import { Formik } from "formik";
import * as yup from "yup";
import ModalDetail from "./components/ModalDetail";
import iconDelete from "../../assets/icons/icon-delete.svg";
import { ModalDelete, ModalAlert } from "../../config/Util";

const items: MenuProps["items"] = [
    {
        // icon: <></>,
        label: <a href="https://www.antgroup.com">1st menu item</a>,
        key: "0",
    },
    {
        label: <a href="https://www.aliyun.com">2nd menu item</a>,
        key: "1",
    },
    {
        type: "divider",
    },
    {
        label: "3rd menu item",
        key: "3",
    },
];

function DetailPage() {
    const navigate = useNavigate();
    const { activityID } = useParams();
    const [listItem, setListItem] = useState([] as any);
    const [data, setData] = useState({} as any);
    const [dataInit, setDataInit] = useState({} as any);
    const [modalCreateVisible, setModalCreateVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [toDoTitle, setToDoTitle] = useState("");
    const [deleteId, setDeleteId] = useState(0);
    const [deleteName, setDeleteName] = useState("");
    const [contentLoading, setContentLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = () => {
        setContentLoading(true);
        axiosRepository.getActivityDetail(activityID).then((res) => {
            console.log(res.data);
            setData(res?.data);
            setToDoTitle(res?.data.title);
            setListItem(res?.data?.todo_items);
            setContentLoading(false);
            setButtonLoading(false);
            closeModal();
        });
    };
    const openCreateModal = () => {
        console.log(dataInit);
        setDataInit({
            activity_group_id: activityID?.toString(),
        });
        setModalCreateVisible(true);
    };
    const closeModal = () => {
        setModalCreateVisible(false);
        setModalEditVisible(false);
        setModalDeleteVisible(false);
    };

    const createToDo = (value: any) => {
        console.log(value);
        axiosRepository.postToDoItem(value).then(() => {
            setButtonLoading(true);
            getData();
        });
    };
    const openAlert = () => {
        setAlertVisible(true);
    };
    const closeAlert = () => {
        setAlertVisible(false);
    };

    const deleteToDo = async () => {
        setButtonLoading(true);
        await axiosRepository.deleteToDoItem(deleteId).then(async () => {
            getData();
        });
        openAlert();
    };
    const patchTitle = (value: any) => {
        console.log(value);
        // setEditMode(false);
        axiosRepository.patchActivityGroups(value, activityID).then(() => {
            getData();
            setEditMode(false);
        });
    };
    const checkItem = (value: any, item: any) => {
        // console.log(value, id);
        let payload = {
            is_active: value === true ? 0 : 1,
            priority: item?.priority,
        };
        console.log(payload);
        axiosRepository.patchActiveToDoItem(payload, item?.id).then(() => {
            getData();
        });
    };

    const priorityColor = (value: any) => {
        if (value === "very-high") {
            return "#ED4C5C";
        } else if (value === "high") {
            return "#F8A541";
        } else if (value === "normal") {
            return "#00A790";
        } else if (value === "low") {
            return "#428BC1";
        } else if (value === "very-low") {
            return "#8942C1";
        }
    };

    return (
        <div className="item-list">
            <div className="todo-title-bar">
                <Row justify="space-between">
                    <Col>
                        <Row align="middle">
                            <Col>
                                <Button
                                    className="todo-nav-button"
                                    onClick={() => {
                                        navigate("/");
                                    }}
                                >
                                    <LeftOutlined />
                                </Button>
                            </Col>
                            <Col>
                                {editMode ? (
                                    <Formik
                                        enableReinitialize
                                        initialValues={{
                                            title: data?.title,
                                        }}
                                        validationSchema={yup.object().shape({
                                            // name: yup.string().required("Required"),
                                        })}
                                        onSubmit={(
                                            values
                                            // , { resetForm }
                                        ) => {
                                            patchTitle(values);
                                        }}
                                    >
                                        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, isValid }) => (
                                            <Input
                                                className="todo-input-title"
                                                // value={data?.title}
                                                // value={toDoTitle}
                                                value={values.title}
                                                name="title"
                                                bordered={false}
                                                onChange={handleChange}
                                                onBlur={() => handleSubmit()}
                                                onPressEnter={() => handleSubmit()}
                                            />
                                        )}
                                    </Formik>
                                ) : (
                                    <div
                                        className="todo-title"
                                        data-cy="todo-title"
                                        onClick={() => {
                                            setEditMode(!editMode);
                                        }}
                                    >
                                        {data?.title}
                                    </div>
                                )}
                            </Col>
                            <Col>
                                <Button
                                    className="todo-edit-button"
                                    onClick={() => {
                                        setEditMode(!editMode);
                                    }}
                                >
                                    <Image src={iconEdit} preview={false} />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                {/* <Dropdown
                                // menu={{}}
                                // trigger={["click"]}
                                >
                                    Sort
                                </Dropdown> */}
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => {
                                        openCreateModal();
                                    }}
                                    className="activity-add-button"
                                    data-cy="activity-add-button"
                                    icon={<PlusOutlined />}
                                >
                                    Tambah
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            {listItem.length === 0 ? (
                <div className="todo-empty-state" data-cy="todo-empty-state">
                    <Button onClick={() => openCreateModal()} type="link">
                        <Image src={itemEmptyVector} preview={false} />
                    </Button>
                </div>
            ) : (
                <div>
                    item list
                    {listItem.map((item: any, index: any) => {
                        return (
                            <div key={item.id} className="todo-item">
                                <Row justify="space-between">
                                    <Col>
                                        <Row gutter={20} align="middle">
                                            <Col>
                                                <Checkbox
                                                    onChange={(e: any) => {
                                                        // console.log(e.target?.checked);
                                                        checkItem(e.target.checked, item);
                                                    }}
                                                    value={item.is_active === 0 ? true : false}
                                                    // checked={item.is_active === 0 ? true : false}
                                                />
                                            </Col>
                                            <Col>
                                                <div
                                                    style={{
                                                        height: 12,
                                                        width: 12,
                                                        backgroundColor: priorityColor(item.priority),
                                                        borderRadius: 12,
                                                    }}
                                                />
                                            </Col>
                                            <Col>
                                                <div style={{ textDecoration: item.is_active === 0 ? "line-through" : "none" }}>{item.title}</div>
                                            </Col>
                                            <Col>
                                                <Button
                                                    className="item-ghost-button"
                                                    onClick={() => {
                                                        // setEditMode(!editMode);
                                                    }}
                                                >
                                                    <Image src={iconEdit} preview={false} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Button
                                            className="item-ghost-button"
                                            onClick={() => {
                                                setModalDeleteVisible(true);
                                                setDeleteId(item?.id);
                                                setDeleteName(item?.title);
                                            }}
                                        >
                                            <Image className="icon-delete" src={iconDelete} preview={false} />
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
                </div>
            )}
            {modalCreateVisible && (
                <ModalDetail
                    visible={modalCreateVisible}
                    closeModal={closeModal}
                    title="Tambah List Item"
                    dataInit={dataInit}
                    // dataPayload={(e:any)=>createToDo(e)}
                    dataPayload={(e: any) => createToDo(e)}
                    loadingState={buttonLoading}
                />
            )}
            {modalEditVisible && (
                <ModalDetail
                    visible={modalCreateVisible}
                    closeModal={closeModal}
                    title="Edit Item"
                    dataInit={dataInit}
                    // dataPayload={(e:any)=>createToDo(e)}
                    dataPayload={(e: any) => createToDo(e)}
                    loadingState={buttonLoading}
                />
            )}

            <ModalDelete title="activty" name={deleteName} closeModal={closeModal} visible={modalDeleteVisible} loadingState={buttonLoading} functConfirm={deleteToDo} />
            <ModalAlert title="Item berhasil dihapus" closeModal={closeAlert} visible={alertVisible} />
        </div>
    );
}

export default DetailPage;
